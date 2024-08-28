import { Request, Response } from 'express';
import { findUserByEmail } from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = 'X84M5fCx+tRc^pg7ke9Wsb';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, type: user.type }, secret, { expiresIn: '1h' });
  res.json({ token });
}
