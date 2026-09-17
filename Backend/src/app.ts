import cors from 'cors';
import express, { type Express } from 'express';
import { config } from './config.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { healthRouter } from './routes/health.routes.js';
import { meetingsRouter } from './routes/meetings.routes.js';
import { teamsRouter } from './routes/teams.routes.js';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/', (_req, res) => {
    res.json({ name: 'Huddle API', health: '/api/health' });
  });

  app.use('/api/health', healthRouter);
  app.use('/api/teams', teamsRouter);
  app.use('/api/meetings', meetingsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

export default app;
