const User = require('../user/user.model'); 
const Role = require('../role/role.model');
const Permission = require('../permission/permission.model');
const authService = require('../auth/auth.service');

async function login (req,res) {
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
                }
            ]
            }
        ]
        });
        if (!user){
            return res.status(400).json({error : "Invalid email or password"});
        }

        const isPasswordValid = await authService.comparePasswords(
          password,
          user.password
        );
        if (!isPasswordValid){
            return res.status(400).json({error : "Invalid email or password"});
        }

        if(user.mustChangePassword) {
            return res.json({mustChangePassword : true});
            // Lucas should redirect the user to a change password page and then call the change password endpoint
        }

        const token = await authService.generateToken(user);

        // token must be stored in the client side (localStorage or cookies) and sent in the Authorization header for protected routes
        return res.json({token, user : user});


    }catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({error: error.message});
    }
}

async function changePassword(req, res) {
    console.log(req.user)
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isOldPasswordValid = await authtService.comparePasswords(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({ error: 'Invalid old password' });
        }

        const hashedNewPassword = await authtService.hashPassword(newPassword);
        user.password = hashedNewPassword;
        user.mustChangePassword = false; // reset the flag after changing password
        await user.save();

        return res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {login, changePassword}
