// initial modules
const mysql = require('mysql2');
require('dotenv').config();

// connect to database
const db = mysql.createConnection({
    // location of database
    host: 'localhost',
    // username
    user: process.env.DB_USER,
    // password
    password: process.env.DB_PASSWORD,
    // database name
    database: "employee_data"
},
console.log('Connected to database')
);

module.exports = db;