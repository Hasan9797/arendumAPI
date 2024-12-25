import { verifyToken } from '../utils/auth.util.js';

export const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Access denied, no token provided' });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorization = (allowedRoles) => {
  return (req, res, next) => {
    authentication(req, res, () => {
      if (!req.user.role || !allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: 'Access denied: Invalid or missing role' });
      }
      next();
    });
  };
};
