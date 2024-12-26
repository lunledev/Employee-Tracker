import { pool, connectToDb } from './connection.js';
await connectToDb();

import inquirer from 'inquirer'; 



const prompt =[

{

    type:'',
    name:'',
    message: 'What would you like to do?',
    choices: [


    ],

}



];



/*
What would you like to do?
View All Employees
Add Employee
Update Employee Role
View All Roles
Add Role
View All Departments
Add Department
Quit
*/

function init()
{
    console.log('Welcome to Employee Tracker');

    const menuModule = inquirer.createPromptModule();

    menuModule(prompt).then())=>{



    });


}


//actions


//prompt menu
init();
