insert into department (name) values ('Sales');
insert into department (name) values ('Engineering');
insert into department (name) values ('Finance');
insert into department (name) values ('Legal');


insert into role (title, salary, department_id) values ('Sales Lead', 100000, 1);
insert into role (title, salary, department_id) values ('Salesperson', 80000, 1);
insert into role (title, salary, department_id) values ('Lead Engineer', 150000, 2);
insert into role (title, salary, department_id) values ('Software Engineer', 120000, 2);
insert into role (title, salary, department_id) values ('Accountant Manager', 160000, 3);  
insert into role (title, salary, department_id) values ('Accountant', 125000, 3); 
insert into role (title, salary, department_id) values ('Legal Team Lead', 250000, 4);
insert into role (title, salary, department_id) values ('Lawyer', 190000, 4);


insert into employee (first_name, last_name, role_id, manager_id) values ('John', 'Doe', 1, NULL);  
insert into employee (first_name, last_name, role_id, manager_id) values ('Mike', 'Chan', 2, 1);
insert into employee (first_name, last_name, role_id, manager_id) values ('Ashley', 'Rodriguez', 3, NULL);
insert into employee (first_name, last_name, role_id, manager_id) values ('Kevin', 'Tupik', 4, 3);
insert into employee (first_name, last_name, role_id, manager_id) values ('Kunal', 'Singh', 5, NULL);
insert into employee (first_name, last_name, role_id, manager_id) values ('Malia', 'Brown', 6, 5);
insert into employee (first_name, last_name, role_id, manager_id) values ('Sarah', 'Lourd', 7, NULL);
insert into employee (first_name, last_name, role_id, manager_id) values ('Tom', 'Allen', 8, 7);



