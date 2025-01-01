import { pool, connectToDb } from './connection.js';
await connectToDb();

import inquirer from 'inquirer';
import Table from 'cli-table3'; //for table display to console.


const prompt = [

    {

        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Role',
            'Quit',
        ],

    },



];

function displayTable(result) {
    const header = Object.keys(result.rows[0]);

    const table = new Table({ head: header, style: { head: ['green'], border: ['white'] } });

    for (let i = 0; i < result.rows.length; i++) {
        let rowdata = Object.values(result.rows[i]);
        table.push(rowdata);
    }

    console.log(table.toString());


}

function menuActions() {
    const menuModule = inquirer.createPromptModule();


    menuModule(prompt).then((answers) => {
        //actions
        if (answers.action === 'View All Departments') {

            pool.query('SELECT * FROM department', (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    displayTable(result);
                    menuActions();
                }

            });


        }
        else if (answers.action === 'View All Roles') {
            pool.query(`SELECT role.id, role.title, department.name AS department, role.salary 
                FROM role INNER JOIN department ON role.department_id = department.id`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    displayTable(result);
                    menuActions();
                }

            });
        }


        else if (answers.action === 'View All Employees') {
            pool.query(` SELECT employee.id,employee.first_name,employee.last_name, 
                role.title, department.name AS department, role.salary,
                CONCAT(manager.first_name,' ',manager.last_name) AS manager
                FROM employee
                INNER JOIN role ON role.id =  employee.role_id
                INNER JOIN department ON role.department_id = department.id
                LEFT OUTER JOIN employee AS manager ON employee.manager_id = manager.id`, (err, result) => {

                if (err) {
                    console.log(err);
                }
                else if (result) {
                    displayTable(result);
                    menuActions();
                }
            });
        }
        else if (answers.action === 'Add Department') {

            const AddDepartmentModule = inquirer.createPromptModule();

            AddDepartmentModule(
                [
                    {

                        type: 'input',
                        name: 'department',
                        message: 'What is the name of the department?',

                    },

                ]

            ).then((department_name) => {

                pool.query(`INSERT INTO department(name) VALUES($1)`, [department_name.department], (err, result) => {
                    if (err) {

                        console.log(`${department_name.department} already exists in ${err.table}`);
                        menuActions();
                    }
                    else if (result) {
                        console.log(`${result.rowCount} added to department database!`);
                        menuActions();

                    }
                });

            });
        }
        else if (answers.action === 'Add Role') {

            const AddRoleModule = inquirer.createPromptModule();

            //select name from department table
            pool.query('SELECT * FROM department', (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    AddRoleModule(
                        [
                            {
                                type: 'input',
                                name: 'role_name',
                                message: 'What is the name of the role?',

                            },

                            {
                                type: 'input',
                                name: 'role_salary',
                                message: 'What is the salary of the role?',

                            },

                            {

                                type: 'list',
                                name: 'role_department',
                                message: 'Which department does the role belong to?',
                                choices: result.rows,


                            },

                        ]


                    ).then((role) => {


                        pool.query(`SELECT id FROM department where name = ($1)`, [role.role_department], (err, resultID) => {


                            if (err) {
                                console.log(err);
                            }
                            else if (resultID) {
                                const department = resultID.rows[0].id;

                                pool.query(`INSERT INTO role(title,salary,department_id) VALUES($1,$2,$3)`, [role.role_name, role.role_salary, department], (err, result) => {
                                    if (err) {
                                        console.log(`${role.role_department} already exists in ${err.table}`);
                                        menuActions();
                                    }
                                    else if (result) {
                                        console.log(`${result.rowCount} added to role database!`);
                                        menuActions();
                                    }
                                });
                            }
                        });

                    }); //end of AddRoleModule    

                } //end of else if (result)

            }); //end of pool.query outer

        } //end of else if (answers.action === 'Add Role')

        else if (answers.action === 'Add Employee') {

            const AddEmployeeModule = inquirer.createPromptModule();


            pool.query('SELECT ro',[],(err, result) =>{

                if (err) {
                    console.log(err);
                }
                else if (result) {


                    AddEmployeeModule([

                        {
                            type: 'input',
                            name: 'employee_firstname',
                            message: `What is the employee's first name?`,
        
        
                        },
                        {
                            type: 'input',
                            name: 'employee_lastname',
                            message: `What is the employee's last name?`,
        
        
                        },
        
                        {
                            type: 'list',
                            name: 'employee_role',
                            message: `What is the employee's role?`,
                            choice: [],
        
        
                        },
        
                        {
                            type: 'list',
                            name: 'employee_manager',
                            message: `Who is the employee's manager?`,
                            choice: ['none',],
        
        
                        },
        
        
        
                    ]
                    ).then((employee) => {
        
        
        
                    });//end of AddEmployeeModule



            }


          





        });






        }// end of else if (answers.action === 'Add Employee')

        // else if (answers.action === 'Update Employee Role'){

        // }

        else if (answers.action === 'Quit') {


            pool.end();
            process.exit();


        }
        else {
            menuActions();

        }







    });

}

function init() {
    console.log('Welcome to Employee Tracker');
    menuActions();




}






init();
