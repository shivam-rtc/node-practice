const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verify = require('../utils/verifyToken')
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/userList', verify, userController.user);

module.exports = router;