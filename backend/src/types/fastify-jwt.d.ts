import '@fastify/jwt';

declare module 'fastify' {
    interface FastifyRequest {
        jwtVerify(): Promise<void>;
        user: {
            sub: string;
            [key: string]: any;
        };
    }
}
