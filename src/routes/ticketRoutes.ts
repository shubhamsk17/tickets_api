import { Router } from 'express';
import { createTicketHandler, assignUserHandler } from '../controllers/ticketController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
router.post('/ticket', authenticateToken, createTicketHandler);
router.post('/tickets/:ticketId/assign', authenticateToken, assignUserHandler);

export default router;