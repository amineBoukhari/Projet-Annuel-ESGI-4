const jwt = require('jsonwebtoken');

async function checkIfAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(403).json({ error: 'Token expired' });
        return res.status(403).json({ error: 'Invalid token' });
    }

    if (!decoded || !decoded.role) return res.status(403).json({ error: 'Invalid token' });
    if (decoded.role !== 'Admin' && decoded.role !== 'Owner') return res.status(403).json({ error: 'Insufficient permissions' });

    req.user = decoded;
    next();
}

module.exports = checkIfAdmin;