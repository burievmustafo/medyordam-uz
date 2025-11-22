import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { supabase } from '../plugins/supabase';

export async function authRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/login',
        {
            schema: {
                body: z.object({
                    email: z.string().email(),
                    password: z.string(),
                }),
                response: {
                    200: z.object({
                        token: z.string(),
                        user: z.object({
                            id: z.string(),
                            email: z.string(),
                        }),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { email, password } = request.body;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return reply.status(401).send({
                    message: 'Invalid credentials',
                    error: error.message,
                } as any);
            }

            if (!data.session) {
                return reply.status(500).send({ message: 'Session not created' } as any);
            }

            return {
                token: data.session.access_token,
                user: {
                    id: data.user.id,
                    email: data.user.email!,
                },
            };
        }
    );
}
