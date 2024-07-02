import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const verifyToken = (token) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        throw new Error('Invalid token');
    }
};



export {generateToken, verifyToken};