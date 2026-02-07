const express = require('express');
const router = express.Router();

const userController = require('./user.controller');


router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUSerWithId);
router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;