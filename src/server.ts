import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import { connectToDatabase } from './utils/database';
import config from './config/config';
import Routes from './routes/routes';
import path from 'path';
import { securityMiddleware } from './middlewares/security';
import compression from 'compression';
import logger from './utils/logger';

const app = express();

// Trust proxy if behind a reverse proxy (e.g., Nginx)
app.set('trust proxy', 1);

// Logging
if (config.NODE_ENV === 'local') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    })
  );
}

// Compression middleware
app.use(compression());

// Body parsers

// Limit JSON body to 1MB
app.use(express.json({ limit: '1mb' }));

// Limit URL-encoded body to 1MB
app.use(express.urlencoded({ limit: '1mb', extended: true }));


// Static files
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Security middleware
app.use(securityMiddleware);

// Routes
app.use('/api', Routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  logger.info('Root route accessed');
  res.send('Backend is running securely!');
});

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server after DB connection
connectToDatabase().then(() => {
  app.listen(config.PORT, () => {
    logger.info(`Server running on http://localhost:${config.PORT}`);
  });
});

export default app;
