import connection from '../config/db.js';

const createUserSchema = () => {
    const query = `create table if not exists users(
    id int auto_increment primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    password text not null)`;

    connection.query(query, (e, results) => {
        {
            if(e) {
                console.log("Error creating table: ", e);
                return;
            } else {
                console.log("User Table created successfully");
            }
        }
    });
}

export default createUserSchema;