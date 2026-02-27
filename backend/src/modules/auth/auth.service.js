
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function comparePasswords(password , userPassword) {
    return await bcrypt.compare(password, userPassword);
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function generateToken(user) {
    const payload = {
        id : user.id,
        email : user.email,
        role : user.role
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : '1h'});
}


module.exports = {comparePasswords, hashPassword , generateToken}