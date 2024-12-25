import { Router } from 'express';
import driverController from '../controllers/drivers/driver.controller.js';

const router = Router();

// User routes

router.get('/', driverController.getAll);

router.get('/by/:id', driverController.getAll);

router.post('/add', driverController.create);

router.post('/update/:id', driverController.update);

router.delete('/delete/:id', driverController.distroy);

export default router;
