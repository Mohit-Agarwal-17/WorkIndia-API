import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
const app = express();
import connection from './config/db.js';
dotenv.config();
const port = process.env.PORT || 5000;
import userRoute from './routes/user.route.js'
import adminRoute from './routes/admin.route.js'
import shortRoute from './routes/short.route.js'
app.use(express.json());

app.use('/users', userRoute);
app.use('/admin', adminRoute);
app.use('/shorts', shortRoute);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})