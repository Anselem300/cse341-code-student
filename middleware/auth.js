const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies['token'];
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token && req.cookies && req.cookies.token) token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error('JWT verify failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
