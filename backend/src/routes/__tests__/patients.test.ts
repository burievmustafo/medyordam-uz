import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { patientRoutes } from '../patients';
import { supabase } from '../../plugins/supabase';

// Mock Supabase
jest.mock('../../plugins/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('Patient Routes', () => {
    let app: FastifyInstance;

    beforeEach(async () => {
        app = Fastify();
        await app.register(patientRoutes, { prefix: '/patients' });
        await app.ready();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('GET /patients/:passportId', () => {
        it('should return patient when found', async () => {
            const mockPatient = {
                id: '123',
                passport_id: 'AB123456',
                full_name: 'Test Patient',
                birth_date: '1990-01-01',
                gender: 'male',
            };

            (supabase.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                            data: mockPatient,
                            error: null,
                        }),
                    }),
                }),
            });

            // Mock JWT verification
            app.addHook('onRequest', async (request) => {
                (request as any).user = { sub: 'doctor-id' };
            });

            const response = await app.inject({
                method: 'GET',
                url: '/patients/AB123456',
                headers: {
                    authorization: 'Bearer fake-token',
                },
            });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body)).toEqual(mockPatient);
        });

        it('should return 404 when patient not found', async () => {
            (supabase.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                            data: null,
                            error: { message: 'Not found' },
                        }),
                    }),
                }),
            });

            app.addHook('onRequest', async (request) => {
                (request as any).user = { sub: 'doctor-id' };
            });

            const response = await app.inject({
                method: 'GET',
                url: '/patients/INVALID',
                headers: {
                    authorization: 'Bearer fake-token',
                },
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('POST /patients/:id/diagnoses', () => {
        it('should prevent duplicate one-time disease diagnosis', async () => {
            const existingDiagnosis = {
                id: 'existing-id',
                diagnosis_name: 'measles',
                created_at: '2024-01-01',
            };

            // Mock existing diagnosis check
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        ilike: jest.fn().mockReturnValue({
                            single: jest.fn().mockResolvedValue({
                                data: existingDiagnosis,
                                error: null,
                            }),
                        }),
                    }),
                }),
            });

            app.addHook('onRequest', async (request) => {
                (request as any).user = { sub: 'doctor-id' };
            });

            const response = await app.inject({
                method: 'POST',
                url: '/patients/123/diagnoses',
                headers: {
                    authorization: 'Bearer fake-token',
                    'content-type': 'application/json',
                },
                payload: {
                    diagnosis_name: 'measles',
                    description: 'Test description',
                },
            });

            expect(response.statusCode).toBe(400);
            const body = JSON.parse(response.body);
            expect(body.code).toBe('REDUNDANT_DIAGNOSIS');
            expect(body.warning).toBe(true);
        });

        it('should allow adding new one-time disease diagnosis', async () => {
            const newDiagnosis = {
                id: 'new-id',
                patient_id: '123',
                diagnosis_name: 'measles',
                description: 'Test description',
                doctor_id: 'doctor-id',
                created_at: '2024-01-01',
            };

            // Mock no existing diagnosis
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        ilike: jest.fn().mockReturnValue({
                            single: jest.fn().mockResolvedValue({
                                data: null,
                                error: { code: 'PGRST116' }, // Not found
                            }),
                        }),
                    }),
                }),
            });

            // Mock insert
            (supabase.from as jest.Mock).mockReturnValueOnce({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                            data: newDiagnosis,
                            error: null,
                        }),
                    }),
                }),
            });

            app.addHook('onRequest', async (request) => {
                (request as any).user = { sub: 'doctor-id' };
            });

            const response = await app.inject({
                method: 'POST',
                url: '/patients/123/diagnoses',
                headers: {
                    authorization: 'Bearer fake-token',
                    'content-type': 'application/json',
                },
                payload: {
                    diagnosis_name: 'measles',
                    description: 'Test description',
                },
            });

            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body)).toEqual(newDiagnosis);
        });
    });
});

