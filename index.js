import { pool, connectToDb } from './connection.js';
await connectToDb();

import inquirer from 'inquirer';



const prompt = [

    {

        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit',
        ],

    },



];


function init() {
    console.log('Welcome to Employee Tracker');

    const menuModule = inquirer.createPromptModule();

    menuModule(prompt).then((answers)=> {

        if(answers.action ==='View All Employees')
        {
            pool.query(`SELECT * `);

           //console.log();
           //console.table();
        }
        else if(answers.action==='Quit')
        {
            pool.end();
            process.exit();
            
        }



    });


}


//actions


//prompt menu
init();
