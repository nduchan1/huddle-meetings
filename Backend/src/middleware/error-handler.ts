import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../errors.js';

// Shape of the errors raised by the body parser (and other http-errors based middleware)
type StatusError = {
  status?: unknown;
  type?: unknown;
  message?: unknown;
};

// The body parser phrases its messages in lower case; present them like the rest of the API
function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json(err.body);
    return;
  }

  const { status, type, message } = (err ?? {}) as StatusError;

  if (status === 400 && type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Malformed JSON body' });
    return;
  }

  if (typeof status === 'number' && status >= 400 && status < 500) {
    const error = typeof message === 'string' && message.length > 0 ? capitalise(message) : 'Bad request';
    res.status(status).json({ error });
    return;
  }

  console.error('Unhandled error while processing a request', err);
  res.status(500).json({ error: 'Internal server error' });
};
