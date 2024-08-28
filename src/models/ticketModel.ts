import pool from './db';

export async function createTicket(title: string, description: string, type: string, venue: string, status: string, price: number, priority: string, dueDate: string, createdBy: number) {
  const result = await pool.query(
    'INSERT INTO tickets (title, description, type, venue, status, price, priority, dueDate, createdBy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [title, description, type, venue, status, price, priority, dueDate, createdBy]
  );
  return result.rows[0];
}

export async function getTicketById(ticketId: number) {
  const result = await pool.query(
    'SELECT * FROM tickets WHERE id = $1',
    [ticketId]
  );
  return result.rows[0];
}

export async function assignUserToTicket(ticketId: number, userId: number) {
  const result = await pool.query(
    'INSERT INTO ticket_assignments (ticketId, userId) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
    [ticketId, userId]
  );
  return result.rows[0];
}

export async function getTicketAssignments(ticketId: number) {
  const result = await pool.query(
    'SELECT u.id AS userId, u.name, u.email FROM ticket_assignments ta JOIN users u ON ta.userId = u.id WHERE ta.ticketId = $1',
    [ticketId]
  );
  return result.rows;
}
