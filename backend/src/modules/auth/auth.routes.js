const router = require('express').Router();
const authController = require('./auth.controller');


//router.post("/register",authController.register);
router.post("/login",authController.login);
router.post("/changePassword", authController.changePassword);

module.exports = router;