const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes.js');
const flashcardRoutes = require('./routes/flashcard.routes.js');
const connectDB = require('./db');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
connectDB();

// Routes
app.use('/user', userRoutes);
app.use('/flashcard', flashcardRoutes);



const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
