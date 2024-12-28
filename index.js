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

    menuModule(prompt).then((answers) => {

        if (answers.action === 'View All Departments') {
            pool.query('SELECT * FROM department', (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    const header = Object.keys(result.rows[0]).join('\t');

                    console.table(`\n${header}\n--\t-----------`);

                    for (let i = 0; i < result.rows.length; i++) {
                        const rowdata = Object.values(result.rows[i]);
                        console.log(rowdata.join('\t'));
                    }

                    
                    
                    


                }







            });

            init();


        }
        else if (answers.action === 'Quit') {


            process.exit();


        }







    });


}


//actions


//prompt menu
init();
