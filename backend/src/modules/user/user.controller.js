const User = require('./user.model');

async function createUser(req, res) { 
    console.log("Creating user with data:", req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    try {
        const newUser = await User.create({username : name, email : email, password :password, roleId: role});
        res.status(201).json({message: "User created successfully"});

    }catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({error: 'Failed to create user'});

    }

}

async function getUSerWithId(req, res) {
    

}

async function getAllUsers (req, res) {

    const users = await User.findAll()
    if(!users || users.length == 0) {
        res.status(200).json({message : "no user was found"})
    }
    res.status(200).json(users);
}


async function deleteUser (req, res) {

}


async function deleteUser (req, res) {

}

async function updateUser (req, res) {
    const userId = req.params.id;
    const keyToUpdate = req.body.key;
    const newValue = req.body.value;
     try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({error : "User not found"});
        }
        user[keyToUpdate] = newValue;
        await user.save();
        res.status(200).json(user);
     } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({error: 'Failed to update user'});
     }
}


module.exports = {createUser, getUSerWithId, getAllUsers, updateUser, deleteUser}