const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // 1. Import CORS

dotenv.config();

const app = express();

// 2. Middleware setup
app.use(cors()); // Enable CORS for all origins (or configure as needed)
app.use(express.json());

// MongoDB Connection (Keep your existing logic here)
// ...

// 3. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/login', require('./routes/login'));

// Server Listen (Keep existing logic)
// ...