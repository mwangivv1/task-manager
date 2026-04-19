const express = require('express');
const app = express();

// Middleware to read JSON (Crucial for Auth!)
app.use(express.json());

// Main route for testing
app.get('/', (req, res) => {
    res.send("API is running...");
});

// Existing Registration Route
app.use('/api/auth', require('./routes/auth'));

// New Login Route
app.use('/api/login', require('./routes/login'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));