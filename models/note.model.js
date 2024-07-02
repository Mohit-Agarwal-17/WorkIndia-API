import connection from '../config/db.js';

const createNoteSchema = () => {
    const query = `CREATE TABLE IF NOT EXISTS NOTES(
      ID INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(255) NOT NULL, 
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      content TEXT NOT NULL,
      actual_content_link TEXT,
      image TEXT,
      upvote INT DEFAULT 0,
      downvote INT DEFAULT 0)`;
  
    connection.query(query, (e, result) => {
      {
        if (e) {
          console.log("Error creating table: ", e);
          return;
        } else {
          console.log("Note Table created successfully");
  
        }
      }
    });
  };

export default createNoteSchema;