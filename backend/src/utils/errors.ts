/**
 * Custom Error Classes for the application
 */

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true,
        public code?: string
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    public warning?: boolean;
    public existing_diagnosis?: any;

    constructor(message: string, code?: string, warning?: boolean, existing_diagnosis?: any) {
        super(400, message, true, code);
        this.warning = warning;
        this.existing_diagnosis = existing_diagnosis;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(404, message, true, 'NOT_FOUND');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(401, message, true, 'UNAUTHORIZED');
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(403, message, true, 'FORBIDDEN');
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class ConflictError extends AppError {
    constructor(message: string, code?: string) {
        super(409, message, true, code);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(500, message, false, 'INTERNAL_ERROR');
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

/**
 * Format error response for client
 */
export function formatErrorResponse(error: any) {
    // Don't expose internal errors to client
    if (error instanceof AppError && error.isOperational) {
        const response: any = {
            error: error.message,
            statusCode: error.statusCode,
            code: error.code,
        };

        // Add warning flag and existing diagnosis for ValidationError
        if (error instanceof ValidationError) {
            if (error.warning) {
                response.warning = true;
            }
            if (error.existing_diagnosis) {
                response.existing_diagnosis = error.existing_diagnosis;
            }
        }

        return response;
    }

    // For non-operational errors, return generic message
    return {
        error: 'Internal server error',
        statusCode: 500,
        code: 'INTERNAL_ERROR',
    };
}

/**
 * Check if error is from Supabase and format appropriately
 */
export function handleSupabaseError(error: any): AppError {
    if (!error) {
        return new InternalServerError('Unknown error occurred');
    }

    // Supabase error structure
    if (error.code) {
        switch (error.code) {
            case 'PGRST116': // Not found
                return new NotFoundError('Resource not found');
            case '23505': // Unique violation
                return new ConflictError('Resource already exists', 'DUPLICATE_ENTRY');
            case '23503': // Foreign key violation
                return new ValidationError('Invalid reference', 'FOREIGN_KEY_VIOLATION');
            case '23502': // Not null violation
                return new ValidationError('Required field is missing', 'NOT_NULL_VIOLATION');
            default:
                return new InternalServerError('Database error occurred');
        }
    }

    // If it's already an AppError, return as is
    if (error instanceof AppError) {
        return error;
    }

    // Generic error
    return new InternalServerError(error.message || 'An error occurred');
}

