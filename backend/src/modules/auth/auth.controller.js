const User = require('../user/user.model'); 
const Role = require('../role/role.model');
const Permission = require('../permission/permission.model');
const authtService = require('../auth/auth.service');
const {extractRole , extractPermissions} = require('../auth/auth.service');



async function register (req,res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const roleId = req.body.role || 3; // default role is employee
    const restaurantId = req.body.restaurantId || null; 

    const existingUser = await User.findOne({where : {email :email}});
    if (existingUser){
        return res.status(400).json({error : "User with this email already exists"});
    }
    
    try {
        const hashedPassword = await authtService.hashPassword(password);
        await User.create({username, email, password: hashedPassword, roleId: roleId, restaurantId: restaurantId});
        res.status(201).json({message: "User registered successfully"});
    }catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({error: 'Failed to register user'});
    }


}

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

        const isPasswordValid = await authtService.comparePasswords(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({error : "Invalid email or password"});
        }
          console.log("Generating token for user:", user);
        const token = await authtService.generateToken(user);

        // token must be stored in the client side (localStorage or cookies) and sent in the Authorization header for protected routes
        return res.json({ user, token });


    }catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({error: 'Failed to login user'});
    }
}

module.exports = {register, login}

