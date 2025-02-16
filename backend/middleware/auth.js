const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');

const authMiddleware = async(req, res, next) => {
  const token = req.body["Authorization"] || req.header('Authorization').split(' ')[1];
  

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(403).json({ message: 'Invalid or Expired Token' });
    }

    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};

exports.default =  authMiddleware;
