const jwt = require('jsonwebtoken');
console.log('Auth middleware loaded');

async function checkAuth (req,res,next) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({error : "Access denied. Token not found"});
    }

    try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decodedToken){
        return res.status(403).json({error :decodedToken});
    }
    req.user = decodedToken;
    req.token = token;
    }catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({error : "Token expired"});
        }

        return res.status(403).json({error : error.decodedToken});
    }
    
    next();
}


module.exports = checkAuth ;