const jwt = require('jsonwebtoken');
const { extractRole , extractPermissions} = require('../modules/auth/auth.service');

async function checkIfAdmin(req,res,next) {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }  
     
    const token  = authHeader.split(' ')[1];
    const role = extractRole(token);
    const permissions = extractPermissions(token);

    if(role !== 'Admin' && role !== "admin") {
        console.log('Access denied. User role is not admin:', role);
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    console.log('Role:', role);
    console.log('Permissions:', permissions);

    next();
}

module.exports = checkIfAdmin ;