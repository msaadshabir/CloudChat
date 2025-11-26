import { NextResponse } from 'next/server';

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string, 
    statusCode: number = 500, 
    code?: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      { 
        error: error.message, 
        code: error.code,
        details: error.details 
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message;
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

// Common error responses
export const ErrorResponses = {
  unauthorized: () => 
    NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
  
  forbidden: () => 
    NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
  
  notFound: (resource: string = 'Resource') => 
    NextResponse.json({ error: `${resource} not found` }, { status: 404 }),
  
  badRequest: (message: string = 'Invalid request') => 
    NextResponse.json({ error: message }, { status: 400 }),
  
  validationError: (details: Record<string, string[]>) => 
    NextResponse.json(
      { error: 'Validation failed', details }, 
      { status: 400 }
    ),
  
  rateLimit: () => 
    NextResponse.json(
      { error: 'Too many requests. Please try again later.' }, 
      { status: 429 }
    ),
  
  serverError: (message?: string) => 
    NextResponse.json(
      { error: message || 'Internal server error' }, 
      { status: 500 }
    ),
};
