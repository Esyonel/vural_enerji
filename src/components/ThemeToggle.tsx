import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'light' ? t('Switch to Dark Mode') : t('Switch to Light Mode')}
            title={theme === 'light' ? 'Koyu Mod' : 'Açık Mod'}
        >
            {theme === 'light' ? (
                // Sun Icon (Material Symbols)
                <span className="material-symbols-outlined text-yellow-600 block">light_mode</span>
            ) : (
                // Moon Icon (Material Symbols)
                <span className="material-symbols-outlined text-blue-300 block">dark_mode</span>
            )}
        </button>
    );
};
