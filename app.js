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

                case "Remove Employees":
                removeEmployee();
                break;

                case "Update Employee Role":
                updateEmployeeRole();
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

        promptAdd(roles);
    })
}

// function for prompting choices to add employee
function promptAdd(roles) {
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

// function for removing employee
function removeEmployee() {
    console.log('Removing Employee\n');

    const query = `SELECT * FROM employees`;

    db.query(query, function (err, res) {
        if (err) { throw err; }

        const deleteEmployee = res.map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
    })

    console.table(res);
    console.log('Employees Available\n');

    promptDelete(deleteEmployee);
    })
}

// function for prompting choices to remove employee
function promptDelete(deleteEmployee) {
    inquirer.prompt([
        {
            type: 'list',
            name:  'employeeId',
            message: "Which employee would you like to delete? (WARNING: This will delete all associated data and cannot be undone)",
            choices: deleteEmployee
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: "Are you sure you want to delete this employee?",
            default: false
        }
    ])
    .then(function(answers) {
        console.table(answers);

        const query = `DELETE FROM employees WHERE id = ?`;

        db.query(query, [answers.employeeId], function (err, res) {
            if (err) { throw err; }

            console.table(res);
            console.log(`Employee with the ID:${answers.employeeId} was removed from database\n`);

            initialPrompt();
    })
    })
}

// function for updating employee role
function updateEmployeeRole() {
    console.log('Updating Employee Role\n');

    const query = `SELECT * FROM employees`;

    db.query(query, function (err, res) {
        if (err) { throw err; }

        const updateEmployee = res.map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
        console.table(res);
        console.log('Employees Available\n');

        roleUpdate(updateEmployee);
    })
}

// function for prompting choices to update employee role
function roleUpdate(updateEmployee) {
    console.log ('Updating Employee Role\n');

    const query = `SELECT * FROM roles`;

    db.query(query, function (err, res) {
        if (err) { throw err; }

        const roles = res.map(role => {
            return {
                name: role.title,
                value: role.id,
                salary: role.salary
            }
        })
        console.table(res);
        console.log('Roles Available\n');

        promptUpdate(updateEmployee, roles);
    })
}

// function for prompting choices to update employee role
function promptUpdate(updateEmployee, roles) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: "Which employee would you like to update?",
            choices: updateEmployee
        },
        {
            type: 'list',
            name: 'roleId',
            message: "What will the employee's new role be?",
            choices: roles
        },
    ])
    .then(function(answers) {
        console.table(answers);

        const query = `UPDATE employees SET role_id = ? WHERE id = ?`;

        db.query(query, [answers.roleId, answers.employeeId], function (err, res) {
            if (err) { throw err; }

            console.table(res);
            console.log(`Employee with the ID:${answers.employeeId} was updated to ${answers.roleId}`);

            initialPrompt();
        })
    })
}
    

initialPrompt()