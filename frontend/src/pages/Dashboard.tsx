import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';

export function Dashboard() {
    const [passportId, setPassportId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { recentSearches, addSearch, clearSearches, removeSearch } = useRecentSearches();
    const { t } = useTranslation();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await searchPatient(passportId);
    };

    const searchPatient = async (searchPassportId: string) => {
        setLoading(true);
        setError(null);

        const { data, error: searchError } = await supabase
            .from('patients')
            .select('id, full_name')
            .eq('passport_id', searchPassportId)
            .single();

        if (searchError || !data) {
            setError(t('patientNotFound'));
            setLoading(false);
            return;
        }

        // Add to recent searches
        addSearch(searchPassportId, data.full_name);

        navigate(`/patients/${data.id}`);
    };

    const handleRecentSearchClick = (searchPassportId: string) => {
        setPassportId(searchPassportId);
        searchPatient(searchPassportId);
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 sm:mt-12 md:mt-20">
            <SEO title={t('patientSearch')} />
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{t('patientSearch')}</h1>
                <p className="text-sm sm:text-base text-slate-500">{t('enterPassportId')}</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            type="text"
                            value={passportId}
                            onChange={(e) => setPassportId(e.target.value)}
                            placeholder={t('passportIdPlaceholder')}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none transition-all text-base sm:text-lg"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-medical-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-medical-700 active:bg-medical-800 transition-colors font-medium text-base sm:text-lg disabled:opacity-50 shadow-sm w-full sm:w-auto"
                    >
                        {loading ? t('searching') : t('search')}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center text-sm sm:text-base">
                        {error}
                    </div>
                )}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
                <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900">{t('recentSearches')}</h2>
                        </div>
                        <button
                            onClick={clearSearches}
                            className="flex items-center gap-1 text-slate-500 hover:text-red-600 active:text-red-700 transition-colors text-xs sm:text-sm px-2 py-1 rounded hover:bg-red-50"
                            title="Clear history"
                        >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">{t('clear')}</span>
                        </button>
                    </div>
                    <div className="space-y-2">
                        {recentSearches.map((search) => (
                            <div
                                key={search.passportId}
                                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-medical-300 hover:bg-medical-50 active:bg-medical-100 transition-all group"
                            >
                                <button
                                    onClick={() => handleRecentSearchClick(search.passportId)}
                                    className="flex-1 flex items-center gap-3 text-left"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900 text-sm sm:text-base truncate">{search.patientName}</p>
                                        <p className="text-xs sm:text-sm text-slate-500">ID: {search.passportId}</p>
                                    </div>
                                    <span className="text-xs text-slate-400 hidden sm:inline">
                                        {new Date(search.searchedAt).toLocaleDateString()}
                                    </span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSearch(search.passportId);
                                    }}
                                    className="ml-2 p-2 text-slate-400 hover:text-red-600 active:text-red-700 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-lg hover:bg-red-50"
                                    title="Remove from history"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
