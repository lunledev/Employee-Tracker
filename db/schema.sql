\c postgres;

DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;
\c employee_tracker_db;

DROP TABLE IF EXISTS department CASCADE;

CREATE TABLE department(
id SERIAL PRIMARY KEY,
name VARCHAR(30) UNIQUE NOT NULL


);

DROP TABLE IF EXISTS role CASCADE;

create table role(
id SERIAL PRIMARY KEY,
title VARCHAR(30) UNIQUE NOT NULL,
salary DECIMAL NOT NULL,
department_id INTEGER NOT NULL,
FOREIGN KEY(department_id)
REFERENCES department(id)
 ON DELETE CASCADE
);


DROP TABLE IF EXISTS employee CASCADE;
CREATE TABLE  employee(
id SERIAL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL,
FOREIGN KEY(role_id) 
REFERENCES role(id)
ON DELETE CASCADE,
manager_id INTEGER, 
FOREIGN KEY (manager_id)
REFERENCES employee(id)
ON DELETE SET NULL

);
