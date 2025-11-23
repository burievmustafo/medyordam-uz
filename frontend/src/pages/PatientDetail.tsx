import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Patient, Diagnosis, Immunization } from '../types/shared';
import { AlertTriangle, Plus, Syringe, FileText, User, Calendar, Activity, ArrowLeft, Search, Printer } from 'lucide-react';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { SEO } from '../components/SEO';

export function PatientDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addSearch } = useRecentSearches();

    const [patient, setPatient] = useState<Patient | null>(null);
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [immunizations, setImmunizations] = useState<Immunization[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Quick search state
    const [quickSearchId, setQuickSearchId] = useState('');
    const [quickSearching, setQuickSearching] = useState(false);

    // Form state
    const [newDiagnosis, setNewDiagnosis] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [warning, setWarning] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const [patientRes, diagnosesRes, immunizationsRes] = await Promise.all([
                supabase.from('patients').select('*').eq('id', id).single(),
                supabase.from('diagnoses').select('*, doctors(full_name)').eq('patient_id', id).order('created_at', { ascending: false }),
                supabase.from('immunizations').select('*').eq('patient_id', id)
            ]);

            if (patientRes.data) {
                setPatient(patientRes.data);
                // Add to recent searches
                addSearch(patientRes.data.passport_id, patientRes.data.full_name);
            }
            if (diagnosesRes.data) setDiagnoses(diagnosesRes.data);
            if (immunizationsRes.data) setImmunizations(immunizationsRes.data);
            setLoading(false);
        };

        fetchData();

        // Realtime Subscription
        const channel = supabase
            .channel('diagnoses_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'diagnoses',
                    filter: `patient_id=eq.${id}`,
                },
                async (payload) => {
                    // Fetch the full record to get doctor name if needed, or just append
                    // For simplicity, let's re-fetch or append. 
                    // To get doctor name we need a join, so re-fetching is safer or we can just append payload.new
                    const { data } = await supabase
                        .from('diagnoses')
                        .select('*, doctors(full_name)')
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        setDiagnoses((prev) => [data, ...prev]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const handleAddDiagnosis = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setWarning(null);

        // Rule Engine Check (Client-side for immediate feedback, also enforced on backend)
        const oneTimeDiseases = ['measles', 'mumps', 'chickenpox'];
        if (oneTimeDiseases.includes(newDiagnosis.name.toLowerCase())) {
            const exists = diagnoses.some(d => d.diagnosis_name.toLowerCase() === newDiagnosis.name.toLowerCase());
            if (exists) {
                setWarning('Repeated test not required: Patient already has this diagnosis.');
                setSubmitting(false);
                return; // Block submission or allow with warning? Requirement says "show warning". 
                // If it's just a warning, we might want to let them proceed if they insist, but "Prevent Redundant Tests" implies blocking or strong warning.
                // Let's block for now to be safe, or ask for confirmation. 
                // For this MVP, let's show warning and stop.
            }
        }

        const { error } = await supabase.from('diagnoses').insert({
            patient_id: id,
            diagnosis_name: newDiagnosis.name,
            description: newDiagnosis.description,
            doctor_id: (await supabase.auth.getUser()).data.user?.id
        });

        if (error) {
            // Check if it's a redundant diagnosis warning from backend
            if (error.code === 'REDUNDANT_DIAGNOSIS' || error.message?.includes('one-time disease')) {
                setWarning(error.message || 'Repeated test not required: Patient already has this diagnosis.');
            } else {
                alert('Error adding diagnosis: ' + error.message);
            }
        } else {
            setShowAddModal(false);
            setNewDiagnosis({ name: '', description: '' });
            setWarning(null);
        }
        setSubmitting(false);
    };

    const handleQuickSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setQuickSearching(true);

        const { data, error } = await supabase
            .from('patients')
            .select('id')
            .eq('passport_id', quickSearchId)
            .single();

        if (error || !data) {
            alert('Patient not found');
            setQuickSearching(false);
            return;
        }

        navigate(`/patients/${data.id}`);
        setQuickSearchId('');
        setQuickSearching(false);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-600">
                    <div className="h-10 w-32 bg-slate-200 animate-pulse rounded"></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="h-8 w-48 bg-slate-200 animate-pulse rounded mb-4"></div>
                    <div className="h-4 w-64 bg-slate-200 animate-pulse rounded"></div>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                </button>
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <p className="text-red-600 font-semibold text-lg">Patient not found</p>
                    <p className="text-red-500 text-sm mt-2">The patient with this ID does not exist in the system.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SEO
                title={patient.full_name}
                description={`Medical history and records for ${patient.full_name}`}
            />
            {/* Breadcrumb & Back Button with Quick Search */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Search
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-600 text-sm">Patient Details</span>
                </div>

                {/* Quick Search */}
                <form onSubmit={handleQuickSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            value={quickSearchId}
                            onChange={(e) => setQuickSearchId(e.target.value)}
                            placeholder="Quick search by ID..."
                            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none text-sm w-56"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={quickSearching || !quickSearchId}
                        className="bg-medical-600 text-white px-4 py-2 rounded-lg hover:bg-medical-700 transition-colors text-sm disabled:opacity-50"
                    >
                        {quickSearching ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {/* Patient Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{patient.full_name}</h1>
                    <div className="flex gap-6 text-slate-500 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="capitalize">{patient.gender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(patient.birth_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>ID: {patient.passport_id}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 no-print">
                    <button
                        onClick={() => window.print()}
                        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 border border-slate-300"
                        title="Print patient record"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-medical-600 text-white px-4 py-2 rounded-lg hover:bg-medical-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Add Diagnosis
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Medical History */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-medical-600" />
                        Medical History
                    </h2>
                    <div className="space-y-4">
                        {diagnoses.length === 0 ? (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">No diagnoses recorded</p>
                                <p className="text-slate-400 text-sm mt-1">Medical history will appear here</p>
                            </div>
                        ) : (
                            diagnoses.map((diagnosis) => (
                                <div key={diagnosis.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-medical-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-slate-900">{diagnosis.diagnosis_name}</h3>
                                        <span className="text-xs text-slate-400">
                                            {new Date(diagnosis.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-3">{diagnosis.description}</p>
                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        Dr. {(diagnosis as any).doctors?.full_name || 'Unknown'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Immunizations */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Syringe className="h-5 w-5 text-medical-600" />
                        Immunizations
                    </h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        {immunizations.length === 0 ? (
                            <div className="text-center py-6">
                                <Syringe className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm">No immunizations recorded</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {immunizations.map((imm) => (
                                    <li key={imm.id} className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-slate-700">{imm.disease_name}</span>
                                        <span className="text-slate-400">{new Date(imm.date).getFullYear()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Diagnosis Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Add New Diagnosis</h2>

                        {warning && (
                            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg mb-4 text-sm flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                {warning}
                            </div>
                        )}

                        <form onSubmit={handleAddDiagnosis} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis Name</label>
                                <input
                                    type="text"
                                    value={newDiagnosis.name}
                                    onChange={(e) => setNewDiagnosis({ ...newDiagnosis, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none"
                                    placeholder="e.g. Influenza"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={newDiagnosis.description}
                                    onChange={(e) => setNewDiagnosis({ ...newDiagnosis, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 outline-none h-24 resize-none"
                                    placeholder="Clinical notes..."
                                    required
                                />
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setWarning(null); }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Diagnosis'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
