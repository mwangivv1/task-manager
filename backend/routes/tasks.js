const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route    POST api/auth/register
// @desc     Register a user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Simple Validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username, email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/auth/login
// @desc     Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ 
                token, 
                user: { id: user.id, username: user.username, email: user.email } 
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/auth/user
// @desc     Get logged in user data
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/tasks/comment/:id
// @desc     Add a comment to a task
// @access   Private
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        const newComment = {
            text: req.body.text,
            user: req.user.id, // From the auth middleware
            createdAt: new Date()
        };

        // Use $push to add the comment to the array and $unshift to put it at the top
        task.comments.unshift(newComment);

        await task.save();
        res.json(task.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/tasks
// @desc     Create a new task
// @access   Private
router.post('/', auth, async (req, res) => {
    const { title, description, status } = req.body;

    // 1. Validation
    if (!title) {
        return res.status(400).json({ msg: 'Please include a title' });
    }

    try {
        // 2. Create the new task document
        const newTask = new Task({
            title,
            description,
            status,
            creator: req.user.id // This satisfies your 'required: true' schema field
        });

        // 3. Save to MongoDB Atlas
        const task = await newTask.save();
        
        // 4. Send the new task back to React
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/tasks
// @desc     Get all tasks
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find().populate('creator', 'username').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route    PUT api/tasks/:id
// @desc     Update task status
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Update the status
        task.status = status;
        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/tasks/:id
// @desc     Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Check if the user is the creator (Security check)
        if (task.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await task.deleteOne();
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;