const express = require("express");
const router = express.Router();
const { requireRole } = require("../../middlewares/role.middlewares");

const userController = require("./user.controller");
const checkAuth = require("../../middlewares/auth.middleware");

router.post(
  "/createUser",
  requireRole("Admin", "Owner", "Manager"),
  userController.createUser,
);
router.post(
  "/createOwner",
  requireRole("Admin", "Owner"),
  userController.createUser,
);
router.post(
  "/createManager",
  requireRole("Admin", "Owner"),
  userController.createUser,
);
router.post(
  "/createEmployee",
  requireRole("Admin", "Owner", "Manager"),
  userController.createUser,
);

router.get("/get/:id", userController.getUSerWithId);
router.get("/getMe", checkAuth, userController.getMyProfile); // Verifier que c'est bien le bon user
router.get(
  "/getAll",
  requireRole("Admin", "Owner", "Manager"),
  userController.getAllUsers,
);
router.delete(
  "/delete/:id",
  requireRole("Admin", "Owner", "Manager"),
  userController.deleteUser,
);
router.put("/update/:id", checkAuth, userController.updateUser);
router.put(
  "/updateRole/:id",
  requireRole("Admin", "Owner", "Manager"),
  userController.updateRole,
);

module.exports = router;
