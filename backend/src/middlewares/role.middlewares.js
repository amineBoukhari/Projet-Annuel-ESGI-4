const jwt = require('jsonwebtoken');

async function checkIfAdmin(req,res,next) {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }   
    const token  = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({error: 'Access denied' })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if(!decodedToken){
        return res.status(402).json({error: 'invalid token' })
    }

    console.log(decodedToken)




    next();
}

module.exports = checkIfAdmin ;