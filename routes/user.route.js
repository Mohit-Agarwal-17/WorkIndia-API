import express from 'express';
import { createUser, loginUser, deleteUser, getUsers } from '../controllers/user.controller.js';

const router = express.Router();  

router.post('/signup', createUser);
router.get('/all', getUsers);
router.post('/login', loginUser);
router.delete('/delete/:id', deleteUser);

export default router;