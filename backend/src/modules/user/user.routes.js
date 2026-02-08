const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth.middleware');

const userController = require('./user.controller');


router.post('/createUser', userController.createUser);
router.get('/get/:id', userController.getUSerWithId);
router.get('/getAll', userController.getAllUsers);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;