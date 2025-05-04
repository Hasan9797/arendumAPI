import {
  verifyToken,
  getBlockedAccessToken,
} from '../helpers/jwtTokenHelper.js';
import { responseError } from '../helpers/responseHelper.js';

export const authentication = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token) {
      throw new Error('Access denied, no token provided', 401);
    }

    const decode = verifyToken(token);

    //const isBlocked = await getBlockedAccessToken(decode.id);

    //if (isBlocked) {
      //throw new Error('Access denied, token is blocked', 401);
    //}

    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json(responseError(error.message, 401));
  }
};

export const authorization = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      await authentication(req, res, async () => {
        if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
          return res
            .status(403)
            .json(responseError('Access denied: Invalid or missing role', 403));
        }
        next();
      });
    } catch (error) {
      res.status(401).json(responseError(error.message, 401));
    }
  };
};
