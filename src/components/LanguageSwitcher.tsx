
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Languages configuration
const languages = [
    { code: 'tr', name: 'Türkçe', flag: 'fi fi-tr' },
    { code: 'en', name: 'English', flag: 'fi fi-gb' }, // Using GB flag for English
    { code: 'ru', name: 'Русский', flag: 'fi fi-ru' },
    { code: 'kz', name: 'Қазақша', flag: 'fi fi-kz' },
    { code: 'de', name: 'Deutsch', flag: 'fi fi-de' },
    { code: 'it', name: 'Italiano', flag: 'fi fi-it' },
    { code: 'es', name: 'Español', flag: 'fi fi-es' },
];

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10"
            >
                <span className={currentLang.flag}></span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 hidden sm:block">{currentLang.code.toUpperCase()}</span>
                <span className="material-symbols-outlined text-[18px] text-gray-500">expand_more</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1a2e22] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 animate-fade-in">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${i18n.language === lang.code
                                        ? 'bg-primary/10 text-primary font-bold'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className={lang.flag}></span>
                                <span>{lang.name}</span>
                                {i18n.language === lang.code && (
                                    <span className="material-symbols-outlined text-[16px] ml-auto">check</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
