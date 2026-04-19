const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware to read JSON (Crucial for Auth!)
app.use(express.json());

// MongoDB Connection Logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully ✅');
    } catch (err) {
        console.error('Database Connection Failed ❌', err.message);
        process.exit(1); // Exit process with failure
    }
};

// Call the connection function
connectDB();

// Main route for testing
app.get('/', (req, res) => {
    res.send("API is running...");
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/login', require('./routes/login'));

// Use PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));