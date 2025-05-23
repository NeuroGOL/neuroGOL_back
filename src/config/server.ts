import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.routes';
import userRoutes from '../routes/user.routes';
import roleRoutes from '../routes/role.routes';
import playerRoutes from '../routes/player.routes';
import reportRoutes from '../routes/report.routes';
import declarationRoutes from '../routes/declaration.routes';
import nlpAnalysisRoutes from '../routes/nlp_analysis.routes'; 
import { errorHandler } from '../middleware/errorHandler';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/declarations', declarationRoutes); 
app.use('/api/reports', reportRoutes);
app.use('/api/nlp', nlpAnalysisRoutes); 

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
