const express = require('express');
const userCtrl = require('../controllers/user');
const router = express.Router();
router.post('/signup', userCtrl.signUp);





module.exports = router;