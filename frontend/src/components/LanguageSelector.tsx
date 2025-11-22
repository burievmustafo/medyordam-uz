import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages = [
    { code: 'uz', name: 'O\'zbekcha', flag: 'UZ', short: 'UZ' },
    { code: 'ru', name: 'Русский', flag: 'RU', short: 'RU' },
    { code: 'en', name: 'English', flag: 'EN', short: 'EN' },
];

export function LanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Change language"
            >
                <Globe className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                    {currentLanguage.short}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${i18n.language === lang.code ? 'bg-slate-50' : ''
                                }`}
                        >
                            <span className="font-semibold text-slate-600 w-8">{lang.flag}</span>
                            <span className="font-medium text-slate-900 flex-1">{lang.name}</span>
                            <span className="text-xs text-slate-400">({lang.short})</span>
                            {i18n.language === lang.code && (
                                <span className="text-medical-600">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
