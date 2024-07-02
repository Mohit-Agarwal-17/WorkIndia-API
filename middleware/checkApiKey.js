import connection from "../config/db.js";

const checkApiKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
        return res.status(403).json({ error: 'Forbidden: No API Key Provided' });
    }

    const query = 'SELECT * FROM admin WHERE api_key = ?';
    connection.query(query, [apiKey], (e, results) => {
        if (e) {
            return res.status(500).json({ error: 'Server Error' });
        }

        if (results.length === 0) {
            return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
        }

        req.admin = results[0]; 
        next();
    });
}

export default checkApiKey;
