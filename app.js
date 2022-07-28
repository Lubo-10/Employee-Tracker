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
        //  named used for initialPrompt function 
        name: 'initial',
        message: "What would you like to do?",
        choices: [
            "View Departments",
            "View Roles",
            "View Employees",
            "View Employees by Department",
            "Add Employee",
            "Remove Employees",
            "Update Employee Role",
            "Add New Role",
            "Add New Department",
            "End"
        ]
        // parameter for initialPrompt function is named above in the inquirer.prompt function
    }).then(function ({
        initial
    }) {
        // takes the initial parameter and runs the function based on the initial parameter choice
        switch (initial) {
            // case for viewing departments
            case 'View Departments':
                // function for viewing departments
                viewDepartments();
                break;

                // case for viewing roles
            case 'View Roles':
                // function for viewing roles
                viewRoles();
                break;

                // case for choices
            case "View Employees":
                // function for viewing employees
                viewEmployee();
                break;

            case "View Employees by Department":
                // function for viewing employees by department
                viewEmployeeByDepartment();
                break;

            case "Add Employee":
                // function for adding employee
                addEmployee();
                break;

            case "Remove Employees":
                // function for removing employee
                removeEmployee();
                break;

            case "Update Employee Role":
                // function for updating employee role
                updateEmployeeRole();
                break;

            case "Add New Role":
                // function for adding new role
                addNewRole();
                break;

            case "Add New Department":
                // function for adding new department
                addNewDepartment();
                break;

                // ends the program
            case "End":
                db.end();
                console.log("\nGoodbye!");
                break;
        }
    });
};

// function for  viewing departments
function viewDepartments() {
    // message to user \n provides a line break
    console.log('Viewing Departments\n');
    // SQL query to select all departments
    const query = `SELECT * FROM departments`;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        if (err) throw err;
        // console.table is a function that displays the data in a table
        console.table(res);
        // runs the initialPrompt function
        initialPrompt();
    })
}

// function for viewing roles
function viewRoles() {
    // message to user \n provides a line break
    console.log('Viewing Roles\n');
    // SQL query to select all roles
    const query = `SELECT * FROM roles`;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) throw err;
        // console.table is a function that displays the data in a table
        console.table(res);
        // runs the initialPrompt function
        initialPrompt();
    })
}

// function for viewing employees
function viewEmployee() {
    // message to user \n provides a line break
    console.log('Viewing Employees\n');
    // SQL query to select all employees
    const query = `SELECT * FROM employees`;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) {
            throw err;
        }
        // returns the response to the console.table function
        console.table(res);
        // runs the initialPrompt function
        initialPrompt();
    })
}

// function for viewing employees by department
function viewEmployeeByDepartment() {
    // message to user \n provides a line break
    console.log('Viewing Employees by Department\n');
    // SQL query to select all departments and joins roles and employees
    const query = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id`;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) {
            throw err;
        }
        // returns the response to the console.table function
        console.table(res);
        // runs the initialPrompt function
        initialPrompt();
    })
}

// function for adding employee
function addEmployee() {
    // message to user \n provides a line break
    console.log('Adding Employee\n');
    // SQL query to select all roles
    const query = `SELECT * FROM roles`;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) {
            throw err;
        }
        // returns the response to the console.table function and .map will return an array of objects based on the data in the query
        const roles = res.map(role => {
            return {
                //  SQL constructor (title, salary, department_id)
                name: role.title,
                salary: role.salary,
                value: role.id
            }
        })
        // displays the roles to the user as a table
        console.table(res);
        // displays to the user the available roles
        console.log('Roles Available\n');

        // runs the promptAdd function below
        promptAdd(roles);
    })
}

// function for prompting choices to add employee
function promptAdd(roles) {
    // prompts user based on SQL employees table constructor/columns (first_name, last_name, role_id, manager_id, is_manager)
    inquirer.prompt([{
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
            // takes the roles array and displays it to the user
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
    ]).then(function (answers) {
        // displays the answers to the user in the console
        console.table(answers);
        // SQL query to insert the answers into the employees table based on the user's answers
        const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager)
        VALUES (?, ?, ?, ?, ?)`;
        // grabs the response from the query and runs it through the console.table function
        db.query(query, [answers.first_name, answers.last_name, answers.roleId, answers.managerId, answers.is_manager], function (err, res) {
            // if there is an error, throw it
            if (err) {
                throw err;
            }

            // displays the response to the user as a table
            console.table(res)
            // displays to the user name of the employee added
            console.log(`${answers.first_name} ${answers.last_name} added to database\n`);

            // runs the initialPrompt function
            initialPrompt();
        })
    })
};

// function for removing employee
function removeEmployee() {
    // message to user \n provides a line break
    console.log('Removing Employee\n');
    // SQL query to select all employees
    const query = `SELECT * FROM employees`;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) {
            throw err;
        }
        // returns the response to the console.table function and .map will return an array of objects based on the data in the query
        const deleteEmployee = res.map(employee => {
            return {
                // SQL constructor from employees table (first_name, last_name, employee_id)
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
        // displays the employees to the user as a table
        console.table(res);
        // displays to the user the available employees to remove based on ID
        console.log('Employees Available\n');

        // runs the promptRemove function below
        promptDelete(deleteEmployee);
    })
}

// function for prompting choices to remove employee
function promptDelete(deleteEmployee) {
    // prompts user based on SQL employees table constructor/columns using the employeesID 
    inquirer.prompt([{
                type: 'list',
                name: 'employeeId',
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
        .then(function (answers) {
            // displays the answers to the user in the console
            console.table(answers);
            // SQL query to delete the employee based on the user's answers
            const query = `DELETE FROM employees WHERE id = ?`;
            // grabs the response from the query and runs it through  to the console.table function
            db.query(query, [answers.employeeId], function (err, res) {
                // if there is an error, throw it
                if (err) {
                    throw err;
                }

                // displays the response to the user as a table
                console.table(res);
                // displays the ID of the employee deleted
                console.log(`Employee with the ID:${answers.employeeId} was removed from database\n`);
                // runs the initialPrompt function
                initialPrompt();
            })
        })
}

// function for updating employee role
function updateEmployeeRole() {
    // message to user \n provides a line break
    console.log('Updating Employee Role\n');
    // SQL query to select all employees
    const query = `SELECT * FROM employees`;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) {
            throw err;
        }
        //  returns the response to the console.table function and .map will return an array of objects based on the data in the query
        const updateEmployee = res.map(employee => {
            return {
                //  SQL constructor (first_name, last_name, employee_id)
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
        // displays the employees to the user as a table
        console.table(res);
        // displays to the user the available employees to update based on ID
        console.log('Employees Available\n');
        // runs the promptUpdate function below
        roleUpdate(updateEmployee);
    })
}

// function for prompting choices to update employee role
function roleUpdate(updateEmployee) {
    // displays to the user with \n a line break
    console.log('Updating Employee Role\n');
    // SQL query to select all roles
    const query = `SELECT * FROM roles`;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) {
            throw err;
        }
        // returns the response to the console.table function and .map will return an array of objects based on the data in the query
        const roles = res.map(role => {
            return {
                // SQL roles constructor (title, salary, id)
                name: role.title,
                value: role.id,
                salary: role.salary
            }
        })
        // displays the roles to the user as a table
        console.table(res);
        // displays to the user the available roles to update.
        console.log('Roles Available\n');
        // runs the promptUpdate function below
        promptUpdate(updateEmployee, roles);
    })
}

// function for prompting choices to update employee role
function promptUpdate(updateEmployee, roles) {
    // prompts user based on SQL employees table constructor/columns using the employeesID and rolesID
    inquirer.prompt([{
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
        .then(function (answers) {
            // displays the answers to the user in the console
            console.table(answers);
            // SQL query to update the employee's role based on the user's answers
            const query = `UPDATE employees SET role_id = ? WHERE id = ?`;
            // grabs the response from the query and runs it through to the console.table function
            db.query(query, [answers.roleId, answers.employeeId], function (err, res) { // based on the user's answers, the employee's role will be updated
                // if there is an error, throw it
                if (err) {
                    throw err;
                }
                // displays the response to the user as a table
                console.table(res);
                // displays the ID of the employee updated
                console.log(`Employee with the ID:${answers.employeeId} was updated to ${answers.roleId}`);
                // runs the initialPrompt function
                initialPrompt();
            })
        })
}

// function to add role
function addNewRole() {
    // message to user \n provides a line break
    console.log('Adding Role\n');
    // SQL query to select all roles
    const query = `SELECT * FROM departments
    `;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) {
            throw err;
        }
        // returns the response to the console.table function and .map will return an array of objects based on the data in the query
        const departments = res.map(departments => {
            return {
                // SQL departments constructor (dep_name)
                name: departments.dep_name,
                value: departments.id
            }
        })
        // displays the departments to the user as a table
        console.table(res);
        // displays to the user the available departments to add.
        console.log('Departments Available\n');
        // runs the promptAdd function below
        promptAddNewRole(departments);
    })
}

// function for prompting choices to add role
function promptAddNewRole(departments) {
    //  prompts user based on SQL departments table constructor/columns using the departments table as a reference
    inquirer.prompt([{
            type: 'input',
            name: 'title',
            message: "What is the title for the new role?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the role's salary? (Enter as a decimal EX: 100000.00)"
        },
        {
            type: 'list',
            name: 'departmentId',
            message: "What is the role's department?",
            choices: departments
        },
    ]).then(function (answers) {
        // displays the answers to the user in the console
        console.table(answers);
        // SQL query to add the new role based on the user's answers
        const query = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        // grabs the response from the query and runs it through to the console.table function
        db.query(query, [answers.title, answers.salary, answers.departmentId], function (err, res) { // roles constructor (title, salary, department_id)
            // if there is an error, throw it
            if (err) {
                throw err;
            }
            // displays the response to the user as a table
            console.table(res);
            // displays the title of the role added
            console.log(`${answers.title} added to database\n`);
            // runs the initialPrompt function
            initialPrompt();
        })
    })
};

// function to add department
function addNewDepartment() {
    // message to user \n provides a line break
    console.log('Adding Department\n');
    // SQL query to select all departments
    const query = `SELECT * FROM departments
    `;
    // grabs the response from the query and runs it through the console.table function
    db.query(query, function (err, res) {
        // if there is an error, throw it
        if (err) {
            throw err;
        }
        // returns the response to the console.table function and .map will return an array of objects based on the data in the query
        const departments = res.map(departments => {
            return {
                // SQL departments constructor (dep_name)
                name: departments.dep_name,
                value: departments.id
            }
        })
        // displays the departments to the user as a table
        console.table(res);
        // displays to the user the available departments to add.
        console.log('Departments Available\n');
        // runs the promptAdd function below
        promptAddNewDepartment(departments);
    }
    )
}

    // function for prompting choices to add department
    function promptAddNewDepartment() {
        //  prompts user based on SQL departments table constructor/columns using the departments table as a reference
        inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: "What is the name of the new department?"
            }
        ]).then(function (answers) {
            // displays the answers to the user in the console
            console.table(answers);
            // SQL query to add the new department based on the user's answers
            const query = `INSERT INTO departments (dep_name) VALUES (?)`;
            // grabs the response from the query and runs it through to the console.table function
            db.query(query, [answers.department], function (err, res) { // departments constructor (dep_name)
                // if there is an error, throw it
                if (err) {
                    throw err;
                }
                // displays the response to the user as a table
                console.table(res);
                // displays the name of the department added
                console.log(`${answers.department} added to database\n`);
                // runs the initialPrompt function
                initialPrompt();
            })
        })
    }

initialPrompt();