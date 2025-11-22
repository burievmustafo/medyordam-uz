import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PatientDetail } from './pages/PatientDetail';
import { Layout } from './components/Layout';

function App() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {!session ? (
                    <Route path="*" element={<Login />} />
                ) : (
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/patients/:id" element={<PatientDetail />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
