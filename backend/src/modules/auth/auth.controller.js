const User = require("../user/user.model");
const Role = require("../role/role.model");
const Permission = require("../permission/permission.model");
const authService = require("../auth/auth.service");
const cookieManager = require("../../utils/cookieManager");

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      where: { email: email },
      include: [
        {
          model: Role,
          as: "role",
          include: [
            {
              model: Permission,
              as: "permissions",
            },
          ],
        },
      ],
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await authService.comparePasswords(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = await authService.generateToken(user);
    cookieManager.generateCookie(res, token);

    const cleanUser = {
      id: user.id,
      username: user.username,
      email: user.email
    }

    return res.json({
      user: cleanUser,
      mustChangePassword: user.mustChangePassword,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function changePassword(req, res) {
  const { id, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isOldPasswordValid = await authService.comparePasswords(
      oldPassword,
      user.password
    );
    if (!isOldPasswordValid) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    const hashedNewPassword = await authService.hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.mustChangePassword = false; // reset the flag after changing password
    await user.save();

    const token = await authService.generateToken(user);

    return res.json({
      newToken: token,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function logout(req, res) {
  try {
    cookieManager.clearCookie(res);

    return res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Failed to logout" });
  }
}

module.exports = { login, changePassword, logout };
