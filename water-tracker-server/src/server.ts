import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import waterLogRoutes from './routes/waterLog.routes';

dotenv.config();

// Connect to the database
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5000;

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.send('Water Tracker API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/water', waterLogRoutes);
// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`Access at: http://localhost:${PORT}`);
});