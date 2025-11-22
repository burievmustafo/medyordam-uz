export type Gender = 'male' | 'female' | 'other';

export interface Patient {
    id: string;
    passport_id: string;
    full_name: string;
    birth_date: string;
    gender: Gender;
    recorded_at: string;
}

export interface Diagnosis {
    id: string;
    patient_id: string;
    diagnosis_name: string;
    description: string;
    created_at: string;
    doctor_id: string;
}

export interface Immunization {
    id: string;
    patient_id: string;
    disease_name: string;
    vaccinated: boolean;
    date: string;
}

export interface Doctor {
    id: string;
    full_name: string;
    email: string;
    role: 'doctor' | 'admin';
}
