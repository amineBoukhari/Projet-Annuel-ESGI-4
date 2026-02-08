const User = require('./user.model');

async function createUser(req, res) { 
    console.log("Creating user with data:", req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const newUser = await User.create({username : name, email : email, password :password});
        res.status(201).json({message: "User created successfully"});

    }catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({error: 'Failed to create user'});

    }

}

async function getUSerWithId(req, res) {
    

}

async function getAllUsers (req, res) {

    res.status(200).json({message : "Get all users"});
}

async function updateUser (req, res) {

}

async function deleteUser (req, res) {

}


module.exports = {createUser, getUSerWithId, getAllUsers, updateUser, deleteUser}