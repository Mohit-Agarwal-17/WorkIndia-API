import express from 'express';
import { createAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/signup', createAdmin);

export default router;
