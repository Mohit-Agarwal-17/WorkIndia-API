import connection from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/jwt.js";
import crypto from 'crypto';

const generateApiKey = () => {
    return crypto.randomBytes(32).toString('hex');
}

const createAdmin = async (req, res) => {
  const { name, password, email } = req.body;

  const api_key = generateApiKey();
  console.log(api_key);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const find = `SELECT * FROM ADMIN WHERE NAME = ?`;
  connection.query(find, [name], (e, result) => {
    if (e) {
      res.status(400).json({ message: e.sqlMessage });
      return;
    } else if (result.length > 0) {
      res.status(400).json({ message: "Admin already exists" });
      return;
    } else {
      const query = `INSERT INTO ADMIN (NAME, EMAIL, PASSWORD, API_KEY) VALUES (?, ?, ?, ?)`;
      connection.query(query, [name, email, hashedPassword, api_key], (e, result) => {
        console.log(result);
        if (e) {
          res.status(400).json({ message: e.sqlMessage });
        } else {
          res.status(201).json({ status: "Account successfully created",
            status_code: 200,
            user_id: result.insertId,
            api_key: api_key
           });
        }
      });
    }
  });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const query = `select * from users where email = ?`;
  connection.query(query, [email], async (e, result) => {
    if (e) {
      console.error(e);
      res.status(400).json({ message: "An error occurred. Please try again later." });
      return;
    }

    if (result.length === 0) {
      return res.status(401).json({
        "status": "Incorrect email/password provided. Please retry",
        "status_code": 401
        });
    }
    const user = result[0];
    console.log('User Object:', user);

    if (!user.password) {
      return res.status(500).json({ message: 'Password field is missing' });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, result[0].password);
      if (!passwordMatch) {
        return res.status(401).json({
          "status": "Incorrect email/password provided. Please retry",
          "status_code": 401
          });
      }

      const token = generateToken(result[0].id);
      res.status(200).json({
        "status": "Login successful",
        "status_code": 200,
        "user_id": result[0].id,
        "access_token": token
        });
    } catch (bcryptError) {
      console.error(bcryptError);
      res.status(500).json({
        message:
          "An error occurred during authentication. Please try again later.",
      });
    }
  });
};


export { createAdmin, loginAdmin };