import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../models/userModel';
import bcrypt from 'bcryptjs';

export async function registerUser(req: Request, res: Response) {
  const { name, email, type, password } = req.body;
  
  if (type !== 'customer' && type !== 'admin') {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  try {
    const user = await createUser(name, email, type, password);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
