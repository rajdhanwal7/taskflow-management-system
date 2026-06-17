import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import securityMiddleware from './src/middleware/security.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';
import taskRoutes from './src/routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
});

app.use(limiter);
app.use(express.json());
app.use(morgan('dev'));
securityMiddleware(app);

app.use('/api/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
