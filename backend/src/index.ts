import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
import { patientRoutes } from './routes/patients';
import { authRoutes } from './routes/auth';

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

const start = async () => {
    try {
        await server.listen({ port: parseInt(process.env.PORT || '3000'), host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
