import { config as loadEnv } from 'dotenv';

loadEnv({ quiet: true });

// Environment variables must be in place before the app (and its config) is evaluated,
// so the app is imported only after the .env file has been loaded.
const { default: app } = await import('./app.js');
const { config } = await import('./config.js');

app.listen(config.port, () => {
  console.log(`Huddle API listening on http://localhost:${config.port}`);
});
