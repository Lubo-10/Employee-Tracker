INSERT INTO departments (dep_name)
VALUES 
('Engineer'),
('Design Team'),
('Customer Service'),
('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Principal Engineer', 300000.00, 1),
('Senior Engineer', 200000.00, 1),
('Junior Engineer', 100000.00, 1),
('Lead Designer', 200000.00, 2),
('Graphic Designer', 100000.00, 2),
('UI/UX Designer', 100000.00, 2),
('Sales Rep', 50000.00, 3),
('Support Specialist', 100000.00, 3),
('HR Manager', 100000.00, 4),
('HR Recruiter', 100000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager)
VALUES 
('John', 'Doe', 1, 1, true),
('Jane', 'Doe', 2, 1, false),
('Bill', 'Jones', 3, 1, false),
('Mary', 'Smith', 4, 1, false),
('Zack', 'Tune', 5, 1, false),
('Sally', 'Rodriguez', 6, 1, false),
('Alex', 'Macky', 7, 1, false),
('Deliah', 'Filler', 8, 1, false),
('Lewis', 'Clark', 9, 1, false),
('George', 'Washington', 10, 1, false);


