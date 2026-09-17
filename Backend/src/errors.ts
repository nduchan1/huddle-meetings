export class HttpError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(status: number, body: Record<string, unknown>) {
    super(typeof body.error === 'string' ? body.error : `HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export function notFound(message: string): HttpError {
  return new HttpError(404, { error: message });
}

export function badRequest(message: string): HttpError {
  return new HttpError(400, { error: message });
}

export function validationError(fields: Record<string, string>): HttpError {
  return new HttpError(400, { error: 'Validation failed', fields });
}
