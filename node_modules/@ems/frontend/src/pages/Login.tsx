import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Activity } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-medical-50 p-3 rounded-full mb-4">
                        <Activity className="h-8 w-8 text-medical-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Doctor Login</h1>
                    <p className="text-slate-500">Access emergency patient records</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-medical-600 text-white py-2 rounded-lg hover:bg-medical-700 transition-colors font-medium disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
