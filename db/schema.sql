
-- initial schema to drop and create
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

-- creates the department table with the following columns: id and department name
CREATE TABLE departments (
    -- primary key makes it unique
id INTEGER AUTO_INCREMENT PRIMARY KEY,
-- only 30 characters allowed
dep_name VARCHAR(60)
);

--  creates the roles table with the following columns: id, title, salary, and department id
CREATE TABLE roles (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(60),
--  decimal values are allowe to be 10 digits long with 2 decimal places ex: 1234.56
salary DECIMAL(10,2),
department_id INTEGER,
CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- creates the employee table with the following columns: id, first name, last name, role id, and manager id
CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(60),
    last_name VARCHAR(60),
    -- can be null if no manager
    manager_id INTEGER,  
    -- foreign key constraint to the roles table
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL,
    role_id INTEGER,
    is_manager BOOLEAN NOT NULL, -- if manager is true, then the employee is a manager
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);