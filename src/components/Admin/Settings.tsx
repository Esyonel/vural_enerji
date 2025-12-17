import React, { useState } from 'react';

export const Settings: React.FC = () => {
    // Initialize from localStorage if available
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('vural_settings');
        const savedKey = localStorage.getItem('gemini_api_key');

        const defaults = {
            siteName: 'Vural Enerji',
            maintenanceMode: false,
            emailNotifications: true,
            allowRegistration: true,
            darkModeDefault: false,
            apiKey: savedKey || '',
            contactEmail: 'info@vuralenerji.com'
        };

        if (savedSettings) {
            return { ...defaults, ...JSON.parse(savedSettings), apiKey: savedKey || JSON.parse(savedSettings).apiKey || '' };
        }
        return defaults;
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        // Save API Key to localStorage for the service to use
        if (settings.apiKey) {
            localStorage.setItem('gemini_api_key', settings.apiKey);
        }

        // Save other settings to localStorage as well for persistence
        localStorage.setItem('vural_settings', JSON.stringify(settings));

        alert('Ayarlar başarıyla kaydedildi!');
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Genel Ayarlar</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <p>Sistem konfigürasyonunu ve tercihlerini yönetin.</p>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <p>Sürüm: <span className="font-mono text-primary font-bold">v1.0.0</span></p>
                </div>
            </div>

            {/* General Settings */}
            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">tune</span>
                    Site Yapılandırması
                </h3>
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site Adı</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">İletişim E-posta</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toggles */}
            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">toggle_on</span>
                    Sistem Tercihleri
                </h3>
                <div className="space-y-6">
                    <ToggleItem
                        label="Bakım Modu"
                        description="Siteyi ziyaretçilere kapatır ve bakım sayfası gösterir."
                        checked={settings.maintenanceMode}
                        onChange={() => toggle('maintenanceMode')}
                        icon="construction"
                    />
                    <ToggleItem
                        label="E-posta Bildirimleri"
                        description="Yeni sipariş ve mesajlarda yöneticiye e-posta gönder."
                        checked={settings.emailNotifications}
                        onChange={() => toggle('emailNotifications')}
                        icon="mail"
                    />
                    <ToggleItem
                        label="Yeni Üyelik Alımı"
                        description="Kullanıcıların siteye kayıt olmasına izin ver."
                        checked={settings.allowRegistration}
                        onChange={() => toggle('allowRegistration')}
                        icon="person_add"
                    />
                    <ToggleItem
                        label="Varsayılan Karanlık Mod"
                        description="Ziyaretçiler için site varsayılan olarak karanlık modda açılır."
                        checked={settings.darkModeDefault}
                        onChange={() => toggle('darkModeDefault')}
                        icon="dark_mode"
                    />
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">key</span>
                    API Anahtarları (Korumalı)
                </h3>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gemini API Key</label>
                    <div className="flex gap-2">
                        <input
                            type="password"
                            name="apiKey"
                            value={settings.apiKey}
                            onChange={handleChange}
                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-slate-900 dark:text-white"
                            placeholder="API Anahtarınızı buraya girin..."
                        />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                            Bu anahtar tarayıcınızda yerel olarak saklanır.
                        </p>
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:text-green-600 hover:underline flex items-center gap-1 font-medium transition-colors"
                        >
                            API Anahtarı Al
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-primary hover:bg-green-600 text-black font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
                >
                    Ayarları Kaydet
                </button>
            </div>
        </div>
    );
};

const ToggleItem = ({ label, description, checked, onChange, icon }: any) => (
    <div className="flex items-center justify-between">
        <div className="flex gap-4">
            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
                <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
        <button
            onClick={onChange}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
            <span className={`inline-block size-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);