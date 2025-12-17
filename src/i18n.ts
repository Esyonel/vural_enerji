
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import tr from './locales/tr.json';
import en from './locales/en.json';
import ru from './locales/ru.json';
import kz from './locales/kz.json';
import de from './locales/de.json';
import it from './locales/it.json';
import es from './locales/es.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            tr: { translation: tr },
            en: { translation: en },
            ru: { translation: ru },
            kz: { translation: kz },
            de: { translation: de },
            it: { translation: it },
            es: { translation: es }
        },
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
