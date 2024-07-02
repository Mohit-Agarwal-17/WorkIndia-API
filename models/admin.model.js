import connection from '../config/db.js';

const createAdminSchema = () => {
    const query = `create table if not exists admin(
    id int auto_increment primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    password text not null,
    api_key varchar(255) not null)`;

    connection.query(query, (e, results) => {
        {
            if(e) {
                console.log("Error creating table: ", e);
                return;
            } else {
                console.log("Admin Table created successfully");
            }
        }
    });
}

export default createAdminSchema;