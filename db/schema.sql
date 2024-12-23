\c postgres;

drop database if exists employee_tracker_db;

create database employee_tracker_db;

\c employee_tracker_db;

drop table if exists department;

create table department(
id serial primary key,
name varchar(30) unique not null


);

drop table if exists role cascade;

create table role(
id serial primary key,
title varchar(30) unique not null,
salary decimal not null,
department_id integer not null,
foreign key(department_id)
references department(id)
 on delete cascade
);


drop table if exists employee cascade;
create table employee(
id serial primary key,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id integer not null,
foreign key(role_id) 
references role(id)
on delete cascade,
manager_id integer, 
foreign key(manager_id)
references employee(id)
on delete set null

);
