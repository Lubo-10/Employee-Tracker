// modules 
const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
const db = require('./db/connection');
require('console.table');

//  function for initial prompt
function initialPrompt() {
    inquirer.prompt({
        type: 'list',
        name: 'initial',
        message: "What would you like to do?",
        choices: [
            "View Employees",
            "View Employees by Department",
            "Add Employee",
            "Remove Employees",
            "Update Employee Role",
            "Add Role",
            "End"
        ]
    }).then(function ({ initial }) {
        switch (initial) {
            case "View Employees":
                viewEmployee();
                break;

                case "View Employees by Department":
                viewEmployeeByDepartment();
                break;
        }
    });
};

// function for viewing employees
function viewEmployee() {
    console.log('Viewing Employees');

    const query = `SELECT * FROM employees`;
    db.query(query, function (err, res) {
        if (err) {  throw err;
        }
        console.table(res);
        initialPrompt();
    })
}

// function for viewing employees by department
function viewEmployeeByDepartment() {
    console.log('Viewing Employees by Department');

    const query = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id`;

    db.query(query, function (err, res) {
        if (err) { throw err; }
        console.table(res);
        initialPrompt();
    })
}

initialPrompt()