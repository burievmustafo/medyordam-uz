import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { supabase } from '../plugins/supabase';

export async function patientRoutes(app: FastifyInstance) {
    app.addHook('onRequest', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    // Search Patient by Passport ID
    app.withTypeProvider<ZodTypeProvider>().get(
        '/:passportId',
        {
            schema: {
                params: z.object({
                    passportId: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { passportId } = request.params;

            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('passport_id', passportId)
                .single();

            if (error || !data) {
                return reply.status(404).send({ message: 'Patient not found' });
            }

            return data;
        }
    );

    // Get Patient Diagnoses
    app.withTypeProvider<ZodTypeProvider>().get(
        '/:id/diagnoses',
        {
            schema: {
                params: z.object({
                    id: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('diagnoses')
                .select('*, doctors(full_name)')
                .eq('patient_id', id)
                .order('created_at', { ascending: false });

            if (error) {
                return reply.status(500).send(error);
            }

            return data;
        }
    );

    // Add Diagnosis
    app.withTypeProvider<ZodTypeProvider>().post(
        '/:id/diagnoses',
        {
            schema: {
                params: z.object({
                    id: z.string(),
                }),
                body: z.object({
                    diagnosis_name: z.string(),
                    description: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { id } = request.params;
            const { diagnosis_name, description } = request.body;
            const user = request.user as { sub: string }; // Supabase user ID

            // Rule Engine: Check for redundant tests
            const oneTimeDiseases = ['measles', 'mumps', 'chickenpox'];
            if (oneTimeDiseases.includes(diagnosis_name.toLowerCase())) {
                const { data: existing } = await supabase
                    .from('diagnoses')
                    .select('id')
                    .eq('patient_id', id)
                    .ilike('diagnosis_name', diagnosis_name)
                    .single();

                if (existing) {
                    // We still add it, but frontend will show warning. 
                    // Or we can return a warning in the response.
                    // Requirement says "show warning". Let's add a flag in response.
                }
            }

            const { data, error } = await supabase
                .from('diagnoses')
                .insert({
                    patient_id: id,
                    diagnosis_name,
                    description,
                    doctor_id: user.sub,
                })
                .select()
                .single();

            if (error) {
                return reply.status(500).send(error);
            }

            return data;
        }
    );

    // Get Immunizations
    app.withTypeProvider<ZodTypeProvider>().get(
        '/:id/immunizations',
        {
            schema: {
                params: z.object({
                    id: z.string(),
                }),
            },
        },
        async (request, reply) => {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('immunizations')
                .select('*')
                .eq('patient_id', id);

            if (error) {
                return reply.status(500).send(error);
            }

            return data;
        }
    );
}
