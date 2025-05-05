import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-access-key';
function errorThrow() {
  const error = new Error('Test Error');
  error.code = 400;
  throw error;
}

function getError() {
  try {
    errorThrow();
  } catch (error) {
    console.log(error.message, error.code);
  }
}

// getError();
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicGhvbmUiOiI5OTg5OTgyMzIzNjMiLCJyb2xlIjo0LCJpYXQiOjE3NDY0MjY5MzksImV4cCI6MTc0NjQzMDUzOX0.FPQB0c6yOJ8FHtOFpRQiUDrU4H7APmZAsyFlRdzxYPM";

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const decode = verifyToken(token);

console.log(decode);
