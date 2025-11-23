import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
import { patientRoutes } from './routes/patients';
import { authRoutes } from './routes/auth';
import { AppError, formatErrorResponse, handleSupabaseError } from './utils/errors';

dotenv.config();

const server = Fastify({
    logger: true,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(cors, {
    origin: '*',
});

server.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
});

server.register(swagger, {
    openapi: {
        info: {
            title: 'Emergency Medical System API',
            description: 'API for Emergency Medical Patient History System',
            version: '1.0.0',
        },
        servers: [],
    },
    transform: jsonSchemaTransform,
});

server.register(swaggerUi, {
    routePrefix: '/documentation',
});

server.register(authRoutes, { prefix: '/auth' });
server.register(patientRoutes, { prefix: '/patients' });

// Global error handler
server.setErrorHandler((error, request, reply) => {
    // Log full error for debugging
    server.log.error({
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method,
    });

    // Handle AppError instances
    if (error instanceof AppError) {
        const response = formatErrorResponse(error);
        return reply.status(error.statusCode).send(response);
    }

    // Handle validation errors from Zod
    if (error.validation) {
        return reply.status(400).send({
            error: 'Validation error',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
            details: error.validation,
        });
    }

    // Handle JWT errors
    if (error.statusCode === 401) {
        return reply.status(401).send({
            error: 'Unauthorized',
            statusCode: 401,
            code: 'UNAUTHORIZED',
        });
    }

    // Generic error response
    const response = formatErrorResponse(error);
    return reply.status(500).send(response);
});

const start = async () => {
    try {
        await server.listen({ port: parseInt(process.env.PORT || '3000'), host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
