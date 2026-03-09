const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 6;

function validateRegisterCredentials(username, password) {
  if (!username || !password) return 'Missing fields';
  if (username.length < USERNAME_MIN_LENGTH) {
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters`;
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  return null;
}

// register
router.post('/register', async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();
    const validationError = validateRegisterCredentials(username, password);
    if (validationError) return res.status(400).json({ msg: validationError });
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ msg: 'Username taken' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user._id, username: user.username }});
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ msg: 'Username taken' });
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();
    if (!username || !password) return res.status(400).json({ msg: 'Missing fields' });
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user._id, username: user.username }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
