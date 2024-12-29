import { Router } from 'express';

import driverAuthController from '../controllers/auth/driver.auth.controller.js';
import clientAuthController from '../controllers/auth/client.auth.controller.js';

import authController from '../controllers/auth/auth.controller.js';

const router = Router();

// Admin Auth
router.post('/login', authController.login);

// Driver Auth
router.post('/driver/login', driverAuthController.login);
router.post('/driver/verify-code', driverAuthController.verifySmsCode);

// Client Auth
router.post('/client/login', clientAuthController.login);
router.post('/client/verify-code', clientAuthController.verifySmsCode);

// Refresh Token and Logout for All users
router.post('/refresh-token', authController.refreshToken);
router.get('/logout', authController.logout);

export default router;
