const express = require('express');
const router = express.Router();

const userController = require('./user.controller');


router.post('/createUser', userController.createUser);
router.get('/get/:id', userController.getUSerWithId);
router.get('/getAll', userController.getAllUsers);
router.delete('/delete/:id', userController.deleteUser);
router.put('/update/:id', userController.updateUser);

module.exports = router;