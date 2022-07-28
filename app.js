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

                case "Add Employee":
                addEmployee();
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

// function for adding employee
function addEmployee() {
    console.log('Adding Employee\n');

    const query = `SELECT * FROM roles`;

    db.query(query, function (err, res) {
        if (err) { throw err; }
        const roles = res.map(role => {
            return {
                name: role.title,
                salary: role.salary,
                value: role.id
            }
        })
        console.table(res);
        console.log('Roles Available\n');

        promptChoices(roles);
    })
}

// function for prompting choices to add employee
function promptChoices(roles) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's role?",
            choices: roles
        },
        {
            type: 'input',
            name: 'managerId',
            message: "What is the employee's manager ID?",
        },
        {
            type: 'confirm',
            name: 'is_manager',
            message: "Is the employee a manager?",
            default: false
        },
    ]).then(function (answers){
        console.table(answers);
        const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager)
        VALUES (?, ?, ?, ?, ?)`;
        db.query(query, [answers.first_name, answers.last_name, answers.roleId, answers.managerId, answers.is_manager], function (err, res) {
            if (err) { throw err; }
            
            // console table response with \n
            console.table(res)
            // console table employee name added
            console.log(`${answers.first_name} ${answers.last_name} added to database\n`);
        

            initialPrompt();
        })
    })
};



initialPrompt()