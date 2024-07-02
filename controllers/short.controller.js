import connection from "../config/db.js";
const Short = {
    
    async getNotes() {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM notes order by publish_date, upvote desc";
                connection.query(query, (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });
            return result;
        } catch (e) {
            console.log(e);
        }
    },
    async create(category, title, author, publish_date, content, actual_content_link, image, upvote, downvote) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = `INSERT INTO notes (category, title, author, publish_date, content, actual_content_link, image, upvote, downvote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                connection.query(query, [category, title, author, publish_date, content, actual_content_link, image, upvote, downvote], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });
            return result;
        } catch (e) {
            console.error(e);
        }
    },
    async updateNoteById(noteId, title) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = "UPDATE notes SET title = ?WHERE id = ?";
                connection.query(query, [title, noteId], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });

            return result;
        } catch (e) {
            console.log(e);
        }
    },
    async deleteNoteById(noteId) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = "DELETE FROM notes WHERE id = ?";
                connection.query(query, [noteId], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    },
    async getFilteredNotes(filters) {
        try {
            const { category, publish_date, upvote} = filters;
            let query = 'SELECT * FROM notes WHERE 1=1';
            const params = [];

            if (category) {
                query += ' AND category = ?';
                params.push(category);
            }

            if (publish_date) {
                query += ' AND publish_date >= ?';
                params.push(publish_date);
            }

            if (upvote) {
                query += ' AND upvote >= ?';
                params.push(upvote);
            }

            const result = await new Promise((resolve, reject) => {
                connection.query(query, params, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });

            const enhancedResult = result.map(short => ({
                ...short,
                contains_category: category ? short.category === category : false,
                contains_publish_date: publish_date ? short.publish_date >= publish_date : false,
                contains_upvote: upvote ? short.upvote >= upvote : false,
            }));

            return enhancedResult;
        } catch (e) {
            console.error(e);
        }
    },
    async searchNotes(filters) {
        try {
            const { title, keyword, author } = filters;
            let query = 'SELECT * FROM notes WHERE 1=1';
            const params = [];
            let contains_title = false;
            if (title) {
                contains_title = true;
                query += ' AND title LIKE ?';
                params.push(`%${title}%`);
            }

            if (keyword) {
                query += ' AND (title LIKE ? OR content LIKE ?)';
                params.push(`%${keyword}%`, `%${keyword}%`);
            }

            if (author) {
                query += ' AND author LIKE ?';
                params.push(`%${author}%`);
            }

            const result = await new Promise((resolve, reject) => {
                connection.query(query, params, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });


            const enhancedResult = result.map(short => ({
                ...short,
                contains_title: title ? short.title.includes(title) : false,
                contains_keyword: keyword ? (
                    short.title.includes(keyword) || short.content.includes(keyword)
                ) : false,
                contains_author: author ? short.author.includes(author) : false
            }));

            return enhancedResult;
        } catch (e) {
            console.error(e);
        }
    }

};

export default Short;