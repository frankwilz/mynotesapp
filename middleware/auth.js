const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).json({ msg: 'No token provided' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ msg: 'Invalid auth format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};
