import connection from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/jwt.js";


const createUser = async (req, res) => {
  const { name, password, email } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const find = `SELECT * FROM USERS WHERE NAME = ?`;
  connection.query(find, [name], (e, result) => {
    if (e) {
      res.status(400).json({ message: e.sqlMessage });
      return;
    } else if (result.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    } else {
      const query = `INSERT INTO USERS (NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)`;
      connection.query(query, [name, email, hashedPassword], (e, result) => {
        console.log(result);
        if (e) {
          res.status(400).json({ message: e.sqlMessage });
        } else {
          res.status(201).json({ status: "Account successfully created",
            status_code: 200,
            user_id: result.insertId
           });
        }
      });
    }
  });
};

const loginUser = async (req, res) => {
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

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM USERS WHERE ID = ?`;
  connection.query(query, [id], (e, result) => {
    if (e) {
      res.status(400).json({ message: e.sqlMessage });
      return;
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  });
};

const getUsers = async (req, res) => {
  const query = `SELECT * FROM USERS`;
  connection.query(query, (e, result) => {
    if (e) {
      res.status(400).json({ message: e.sqlMessage });
      return;
    } else {
      res.status(200).json(result);
    }
  });
};

export { createUser, loginUser, deleteUser, getUsers };