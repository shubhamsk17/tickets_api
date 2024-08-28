import { Router } from 'express';
import { registerUser } from '../controllers/userController';

const router = Router();
router.get('/users', registerUser);
router.post('/users', registerUser);

export default router;