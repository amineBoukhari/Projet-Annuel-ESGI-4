const express = require("express");
const router = express.Router();
const { requireRole } = require("../../middlewares/role.middlewares");
const permissionController = require("./permission.controller");

router.get(
  "/getAll",
  requireRole("Admin"),
  permissionController.getAllPermissions,
);
router.get(
  "/get/:id",
  requireRole("Admin"),
  permissionController.getPermissionById,
);
router.post(
  "/create",
  requireRole("Admin"),
  permissionController.createPermission,
);
router.put(
  "/update/:id",
  requireRole("Admin"),
  permissionController.updatePermission,
);
router.delete(
  "/delete/:id",
  requireRole("Admin"),
  permissionController.deletePermission,
);

module.exports = router;
