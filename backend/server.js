const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Initialize dotenv to use your .env variables
dotenv.config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Database Connection
// This uses the MONGO_URI you set up in image_6b3b99.png
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully ✅');
    } catch (err) {
        console.error('Database connection failed ❌', err.message);
        process.exit(1);
    }
};

connectDB();

// 3. Routes
// These must match your file structure in image_6a4437.png
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Optional: Test Route
app.get('/', (req, res) => res.send('API Running'));

// 4. Server Listen
// This keeps the server running so it doesn't immediately exit
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});