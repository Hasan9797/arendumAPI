import { Router } from 'express';
import driverController from '../controllers/drivers/driver.controller.js';

const router = Router();

// User routes

router.get('/', driverController.getAll);

router.get('/:id', driverController.getById);

router.post('/create', driverController.create);

router.put('/update/:id', driverController.update);

router.delete('/delete/:id', driverController.distroy);

export default router;
