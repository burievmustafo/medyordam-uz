import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { supabase } from '../plugins/supabase';
import { UnauthorizedError, InternalServerError } from '../utils/errors';

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
                throw new UnauthorizedError('Invalid email or password');
            }

            if (!data.session) {
                throw new InternalServerError('Session could not be created');
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
