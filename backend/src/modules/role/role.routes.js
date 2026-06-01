const express = require("express");
const router = express.Router();
const { requireRole } = require("../../middlewares/role.middlewares");
const roleController = require("./role.controller");

router.get("/getAll", requireRole("Admin", "Owner", "Manager"), roleController.getAllRoles);
router.get("/get/:id", requireRole("Admin", "Owner", "Manager"), roleController.getRoleById);
router.get("/getWithPermissions/:id", requireRole("Admin"), roleController.getRoleWithPermissions);
router.put("/updatePermissions/:id", requireRole("Admin"), roleController.updateRolePermissions);

module.exports = router;
