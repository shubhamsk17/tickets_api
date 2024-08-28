import { Pool } from 'pg';

const pool = new Pool({
    user: 'testsh',
    host: 'localhost',
    database: 'ticket_management',
    password: 'root',
    port: 5432,
  });
  
  export default pool;