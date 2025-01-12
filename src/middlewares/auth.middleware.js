import { verifyToken } from '../helpers/jwt-token.helper.js';
import { responseError } from '../helpers/response.helper.js';

export const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new Error('Access denied, no token provided', 403);
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json(responseError(error.message, 401));
  }
};

export const authorization = (allowedRoles) => {
  return (req, res, next) => {
    authentication(req, res, () => {
      if (!req.user.role || !allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json(responseError('Access denied: Invalid or missing role', 403));
      }
      next();
    });
  };
};
