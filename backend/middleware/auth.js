const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next(); // CRITICAL: This moves the request to the next function
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};