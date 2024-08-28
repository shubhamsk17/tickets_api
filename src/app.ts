import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';

const app = express();

app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', ticketRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
