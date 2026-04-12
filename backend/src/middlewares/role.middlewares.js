const jwt = require('jsonwebtoken');
const { extractRole , extractPermissions} = require('../modules/auth/auth.service');


// Ici on a utilisé une "factory function " qui fait que créer la fonction middleware
function requireRole(...roles) {
  return (req, res, next) => {
    const role = extractRole(req.token);
    if (!roles.includes(role.name)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' , actualRole : role.name , roles : roles});
    }
   
    return next();
  };
}

function requirePermission(permission) {
  return (req, res, next) => {
    const role = extractRole(req.token );

    // Admin bypasses all permission checks
    if (role === 'Admin') return next();

    const permissions = extractPermissions(req.token );
    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: 'Forbidden: missing permission' });
    }
    return next();
  };
}

module.exports = { requireRole, requirePermission };