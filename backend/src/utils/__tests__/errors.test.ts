import { describe, it, expect } from '@jest/globals';
import {
    AppError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    InternalServerError,
    formatErrorResponse,
    handleSupabaseError,
} from '../errors';

describe('Error Classes', () => {
    describe('AppError', () => {
        it('should create error with correct properties', () => {
            const error = new AppError(400, 'Test error', true, 'TEST_CODE');
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe('Test error');
            expect(error.isOperational).toBe(true);
            expect(error.code).toBe('TEST_CODE');
        });
    });

    describe('ValidationError', () => {
        it('should create validation error with warning flag', () => {
            const error = new ValidationError(
                'Test validation error',
                'VALIDATION_CODE',
                true,
                { id: '123' }
            );
            expect(error.statusCode).toBe(400);
            expect(error.warning).toBe(true);
            expect(error.existing_diagnosis).toEqual({ id: '123' });
        });
    });

    describe('NotFoundError', () => {
        it('should create not found error with default message', () => {
            const error = new NotFoundError();
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Resource not found');
            expect(error.code).toBe('NOT_FOUND');
        });
    });

    describe('formatErrorResponse', () => {
        it('should format operational error correctly', () => {
            const error = new ValidationError('Test error', 'TEST_CODE', true, { id: '123' });
            const response = formatErrorResponse(error);
            expect(response).toEqual({
                error: 'Test error',
                statusCode: 400,
                code: 'TEST_CODE',
                warning: true,
                existing_diagnosis: { id: '123' },
            });
        });

        it('should format non-operational error generically', () => {
            const error = new InternalServerError('Internal error');
            const response = formatErrorResponse(error);
            expect(response).toEqual({
                error: 'Internal server error',
                statusCode: 500,
                code: 'INTERNAL_ERROR',
            });
        });
    });

    describe('handleSupabaseError', () => {
        it('should handle PGRST116 (not found) error', () => {
            const supabaseError = { code: 'PGRST116' };
            const error = handleSupabaseError(supabaseError);
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.statusCode).toBe(404);
        });

        it('should handle 23505 (unique violation) error', () => {
            const supabaseError = { code: '23505' };
            const error = handleSupabaseError(supabaseError);
            expect(error).toBeInstanceOf(ConflictError);
            expect(error.statusCode).toBe(409);
            expect(error.code).toBe('DUPLICATE_ENTRY');
        });

        it('should handle 23503 (foreign key violation) error', () => {
            const supabaseError = { code: '23503' };
            const error = handleSupabaseError(supabaseError);
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.statusCode).toBe(400);
            expect(error.code).toBe('FOREIGN_KEY_VIOLATION');
        });

        it('should handle unknown error', () => {
            const supabaseError = { code: 'UNKNOWN', message: 'Test error' };
            const error = handleSupabaseError(supabaseError);
            expect(error).toBeInstanceOf(InternalServerError);
            expect(error.statusCode).toBe(500);
        });
    });
});

