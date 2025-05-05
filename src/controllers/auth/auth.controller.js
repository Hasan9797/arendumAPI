import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../../helpers/jwtTokenHelper.js';
import {
  getUserTokenByUserId,
  updateUserToken,
  updateOrCreateUserToken,
} from '../../repositories/userToken.repo.js';
import { ROLE_NAME } from '../../enums/user/userRoleEnum.js';
import { blockUserAccessToken } from '../../helpers/jwtTokenHelper.js';

// Login
const login = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'phoneNumber are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { login: login },
    });

    if (!user) {
      return res.status(401).json({ message: 'Login or password invalid' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid login or password' });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload, '1d');

    await updateOrCreateUserToken({
      userId: user.id,
      accessToken,
      refreshToken: null,
    });

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      role: {
        number: user.role,
        name: ROLE_NAME[user.role],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const userRefreshToken = req.body.refreshToken || null;

  if (!userRefreshToken) {
    return res
      .status(403)
      .json({ message: 'Access denied, no userRefreshToken provided' });
  }

  try {
    const decoded = verifyToken(userRefreshToken);

    const currentRefreshToken = await getUserTokenByUserId(decoded.id);

    if (!currentRefreshToken) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      phone: decoded?.phone ?? null,
      role: decoded.role,
    });

    const newRefreshToken = generateRefreshToken({
      id: decoded.id,
      phone: decoded?.phone ?? null,
      role: decoded.role,
    });

    await updateOrCreateUserToken({
      userId: decoded.id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    return res
      .status(200)
      .json({
        message: 'Refreshed access token',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    // Tokenni dekod qilish
    const decoded = verifyToken(token);
    const userId = decoded.id;

    // Tokenni blocked qilish
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    if (ttl > 0) {
      await blockUserAccessToken(token, ttl);
    }

    // UserToken modelidan user_id ga mos tokenni o'chirish
    await updateUserToken({
      userId,
      accessToken: null,
      refreshToken: null,
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export default { login, refreshToken, logout };
