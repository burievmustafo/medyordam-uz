import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export function Layout() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-medical-600 font-bold text-xl hover:text-medical-700 transition-colors cursor-pointer"
                >
                    <Activity className="h-6 w-6" />
                    <span>{t('appName')}</span>
                </button>
                <div className="flex items-center gap-3">
                    <LanguageSelector />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        {t('logout')}
                    </button>
                </div>
            </nav>
            <main className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
