import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../helpers/jwt-token.helper.js';

import { ROLE_NAME } from '../../enums/user/user-role.enum.js';
import { updateOrCreateUserToken } from '../../repositories/user-token.repo.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

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

    const accessToken = generateAccessToken(payload);

    // const refreshToken = generateRefreshToken(payload);

    // const userToken = {
    //   token: refreshToken,
    //   userId: user.id,
    //   expire: '7d',
    // };

    // await updateOrCreateUserToken(userToken);

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      role: {
        number: user.role,
        name: ROLE_NAME[user.role],
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
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
    const decoded = jwt.verify(userRefreshToken, JWT_REFRESH_SECRET);

    const useruserRefreshToken = await prisma.userToken.findFirst({
      where: { token: userRefreshToken },
    });

    if (!useruserRefreshToken) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    return res
      .status(200)
      .json({ message: 'Token refreshed', accessToken: newAccessToken });
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

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default { login, refreshToken, logout };
