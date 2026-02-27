const User = require('../user/user.model'); 
const authtService = require('../auth/auth.service');



async function register (req,res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role || "user";

    const existingUser = await User.findOne({where : {email :email}});
    if (existingUser){
        return res.status(400).json({error : "User with this email already exists"});
    }
    
    try {
        const hashedPassword = await authtService.hashPassword(password);
        await User.create({username, email, password: hashedPassword, role});
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
        const user = await User.findOne({where : {email :email}});
        if (!user){
            return res.status(400).json({error : "Invalid email or password"});
        }

        const isPasswordValid = await authtService.comparePasswords(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({error : "Invalid email or password"});
        }

        const token = await authtService.generateToken(user);

        // token must be stored in the client side (localStorage or cookies) and sent in the Authorization header for protected routes
        res.json({token});


    }catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({error: 'Failed to login user'});
    }
}

module.exports = {register, login}

