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
            <nav className="bg-white border-b border-slate-200 px-3 sm:px-4 py-3 flex justify-between items-center shadow-sm">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 sm:gap-2 text-medical-600 font-bold text-base sm:text-xl hover:text-medical-700 transition-colors cursor-pointer"
                >
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="hidden xs:inline sm:inline">{t('appName')}</span>
                    <span className="inline xs:hidden sm:hidden">EMS</span>
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                    <LanguageSelector />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 sm:gap-2 text-slate-600 hover:text-slate-900 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-slate-100 active:bg-slate-200"
                        title={t('logout')}
                    >
                        <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">{t('logout')}</span>
                    </button>
                </div>
            </nav>
            <main className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
