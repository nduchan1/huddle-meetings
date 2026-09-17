export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001'

export const NETWORK_ERROR_MESSAGE = 'Could not reach the server. Is the API running?'

export class ApiError extends Error {
  status: number
  fields?: Record<string, string>

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

type ErrorBody = {
  error?: unknown
  fields?: unknown
}

function isRecordOfStrings(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every((item) => typeof item === 'string')
  )
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (text.length === 0) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return undefined
  }
}

function toApiError(status: number, body: unknown): ApiError {
  const data = (typeof body === 'object' && body !== null ? body : {}) as ErrorBody
  const message = typeof data.error === 'string' ? data.error : `Request failed with status ${status}`
  const fields = isRecordOfStrings(data.fields) ? data.fields : undefined
  return new ApiError(message, status, fields)
}

/** Performs a JSON request against the API and resolves with the parsed body (undefined for 204). */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0)
  }

  const data = await readBody(response)
  if (!response.ok) throw toApiError(response.status, data)
  return data as T
}

/** Human-readable message for any error thrown by the API layer. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong. Please try again.'
}
