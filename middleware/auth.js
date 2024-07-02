import {verifyToken } from './jwt.js';

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).send('Unauthorized');
    }
    const token = authHeader.split(' ')[1];
    try{
        const user = verifyToken(token);
        req.user = user;
        next();
    }catch(e){
        return res.status(401).send('Unauthorized');
    }
};

export default protect;