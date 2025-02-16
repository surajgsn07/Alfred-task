const express = require('express');
const { register, login, getUser } = require('../controllers/user.controller.js');
const { default: authMiddleware } = require('../middleware/auth.js');

const router = express.Router();

router.post('/register',register);
router.post('/login', login);
router.get("/getUser", authMiddleware,getUser);

module.exports = router;
