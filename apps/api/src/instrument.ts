import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { version } from '../package.json';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

Sentry.init({
  dsn: 'https://dd677aad87b449d135ccd1f9da5a4476@o210079.ingest.us.sentry.io/4508768698826752',
  integrations: [nodeProfilingIntegration()],
  release: version,
  environment: process.env.NODE_ENV,
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
