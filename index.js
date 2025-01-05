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

            //select name from department table, this is possible with * because there is only one column.
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
                                choices: result.rows, //displays the data from department. 


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


            Promise.all([pool.query('SELECT title FROM role'),
            pool.query('SELECT CONCAT(first_name,\' \',last_name) AS manager FROM employee')

            ]).then(([query1, query2]) => { // //query1 and query2 both return objects.

                const employee_role = query1.rows.map((role) => role.title);
                const employee_manager = query2.rows.map((manager) => manager.manager);
                employee_manager.push('none');






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
                        choices: employee_role,  //employee_role contains new created array and the return values.

                    },

                    {
                        type: 'list',
                        name: 'employee_manager',
                        message: `Who is the employee's manager?`,
                        choices: employee_manager, //employee_manager contains new created array and the return values.


                    },



                ]
                ).then((employee) => {

                    pool.query(`SELECT id FROM role where title = ($1)`, [employee.employee_role], (err, resultID) => {

                        if (err) {
                            console.log(err);
                        }
                        else if (resultID) {
                            const role = resultID.rows[0].id;


                            if (employee.employee_manager === 'none') {
                                employee.employee_manager = null;

                                pool.query(`INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES($1,$2,$3,$4)`, [employee.employee_firstname, employee.employee_lastname, role, employee.employee_manager], (err, result) => {
                                    if (err) {
                                        console.log(`${employee.employee_firstname} ${employee.employee_lastname} already exists in ${err.table}`);
                                        menuActions();
                                    }
                                    else if (result) {
                                        console.log(`${result.rowCount} added to employee database!`);
                                        menuActions();
                                    }
                                });
                            }
                            else {






                                pool.query(`SELECT id FROM employee where CONCAT(first_name,' ',last_name) = ($1)`, [employee.employee_manager], (err, resultID) => {

                                    if (err) {
                                        console.log(console.log(`${employee.employee_firstname} ${employee.employee_lastname} already exists in ${err.table}`));
                                    }
                                    else if (resultID) {
                                        const manager = resultID.rows[0].id;




                                        pool.query(`INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES($1,$2,$3,$4)`, [employee.employee_firstname, employee.employee_lastname, role, manager], (err, result) => {
                                            if (err) {
                                                console.log(`${employee.employee_firstname} ${employee.employee_lastname} already exists in ${err.table}`);
                                                menuActions();
                                            }
                                            else if (result) {
                                                console.log(`${result.rowCount} added to employee database!`);
                                                menuActions();
                                            }
                                        }); // end of pool.query inner.
                                    }

                                }); //end of pool.query outer inner.
                            }
                        }  //end of else if (resultID)  


                    }); //end of pool.query outer



                }); //end of AddEmployeeModule
            }); //end of Promise.all    

        }// end of else if (answers.action === 'Add Employee')

        else if (answers.action === 'Update Employee Role') {

            const UpdateEmployeeRoleModule = inquirer.createPromptModule();
            Promise.all([pool.query('SELECT title FROM role'),
            pool.query('SELECT CONCAT(first_name,\' \',last_name) AS employee FROM employee')

            ]).then(([query1, query2]) => {  //query1 and query2 both return objects.




                UpdateEmployeeRoleModule([

                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee do you want to update?',
                        choices: query2.rows.map((employee) => employee.employee), //creates new array from query2 and returns the values.

                    },

                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role do you want to assign the selected employee?',
                        choices: query1.rows.map((role) => role.title),  //creates new array from query1 and returns the values.

                    },]).then((employee) => {

                        pool.query(`SELECT role_id FROM employee where CONCAT(first_name,' ',last_name) = ($1)`, [employee.employee], (err, resultID) => {
                            


                            if (err) {
                                console.log(err);
                            }
                            else if (resultID) {

                                  const employeeID = resultID.rows[0].role_id;



                                pool.query(`SELECT id FROM role where title = ($1)`, [employee.role], (err, resultID) => {

                                    
                                    const roleID = resultID.rows[0].id;

                                    //update pool.query 
                                    pool.query(`UPDATE employee set rol_id = ($1) WHERE role_id = ($2)`,[roleID,employeeID],(err, result) =>
                                    {
                                        if (err) {
                                            if(roleID === employeeID)
                                            console.log(`${employee.employee_firstname} ${employee.employee_lastname} role has not been changed in ${err.table}`);
                                            menuActions();
                                        }
                                        else if (result) {
                                            console.log(`Updated ${result.rowCount} role in employee's database!`);
                                            menuActions();
                                        }

                                    }); //end of pool.query inner
    
    
    
    
    
    
                                });// end of pool.query outer inner 
        




                            }
                       
                        }); //end of pool.query outer.



                    }); //end of UpdateEmployeeRoleModule


            }); //end of Promise.all 



        } //end of else if (answers.action === 'Update Employee Role')

        else if (answers.action === 'Quit') {


            pool.end();  //close connection.
            process.exit(); //exit application successfully.


        }
        else {
            menuActions(); //call menu again.

        }







    });

}

function init() {
    console.log('Welcome to Employee Tracker');
    menuActions();




}






init();
