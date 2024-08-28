import { Request, Response } from 'express';
import { createTicket, getTicketById, assignUserToTicket, getTicketAssignments } from '../models/ticketModel';
import { findUserById } from '../models/userModel';

interface CustomRequest extends Request {
  user?: { userId: number; type: string };
}

export async function createTicketHandler(req: CustomRequest, res: Response) {
  const { title, description, type, venue, status, price, priority, dueDate } = req.body;
  const createdBy = req.user?.userId;

  // Validate input data
  if (!createdBy) return res.status(401).json({ message: 'Unauthorized' });

  const validStatuses = ['open', 'in-progress', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  if (new Date(dueDate) <= new Date()) {
    return res.status(400).json({ message: 'Due date must be in the future' });
  }

  try {
    const ticket = await createTicket(title, description, type, venue, status, price, priority, dueDate, createdBy);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function assignUserHandler(req: CustomRequest, res: Response) {
  const ticketId = parseInt(req.params.ticketId);
  const { userId } = req.body;

  // Check for required user
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  // Validate input data
  if (isNaN(ticketId)) return res.status(400).json({ message: 'Invalid ticket ID' });

  try {
    // Check if ticket exists
    const ticket = await getTicketById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Check if ticket is closed
    if (ticket.status === 'closed') {
      return res.status(400).json({ message: 'Cannot assign users to a closed ticket' });
    }

    // Check if user is already assigned
    const assignments = await getTicketAssignments(ticketId);
    if (assignments.some(a => a.userId === userId)) {
      return res.status(400).json({ message: 'User already assigned' });
    }

    // Check if user exists and is not an admin
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.type === 'admin') {
      return res.status(400).json({ message: 'Cannot assign admin to a ticket' });
    }

    // Assign user
    await assignUserToTicket(ticketId, userId);
    res.json({ message: 'User assigned successfully' });
  } catch (error) {
    console.error('Error assigning user to ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
