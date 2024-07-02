import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
import createUserSchema from '../models/user.model.js';
import createAdminSchema from '../models/admin.model.js';
import createNoteSchema from '../models/note.model.js';

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((e) => {
    if(e) {
        console.log("Error in connecting to database: ", e);
        return;
    } else {
        console.log(`MYSQL Connected`.cyan.underline);
        createUserSchema();
        createAdminSchema();
        createNoteSchema();
    }
});

export default connection;