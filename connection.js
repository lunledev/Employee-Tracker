import dotenv from 'dotenv'; //packag needed to read info env file.
dotenv.config();

import pg from 'pg'; //package needed to connect to database.

const { Pool } = pg; // connect package to Pool.

//create Pool object and store in pool for a connection.
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
});

//function to test connection to database.
const connectToDb = async() =>{
    try{
    await pool.connect();
    console.log('connect to database.');
    }
    catch(err)
    {
        console.error('cannot connect to database: ', err);
        process.exit(1);
    }
};
export {pool, connectToDb}; //allows for file to be imported.



