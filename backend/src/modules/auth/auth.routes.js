const router = require("express").Router();
const authController = require("./auth.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

//router.post("/register",authController.register);
router.post("/login", authController.login);
router.post("/changePassword", authMiddleware, authController.changePassword);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
