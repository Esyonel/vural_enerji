import React, { useState } from 'react';
import { QuoteRequestModal } from './QuoteRequestModal';

// Average sun hours per day (approx annual avg) - Simplified data
const citySunData: Record<string, number> = {
    'Antalya': 5.5,
    'İzmir': 5.0,
    'Muğla': 5.2,
    'Adana': 5.1,
    'İstanbul': 3.8,
    'Ankara': 4.2,
    'Konya': 4.6,
    'Bursa': 4.0,
    'Trabzon': 3.2,
    'Diyarbakır': 5.3,
    'Gaziantep': 5.0,
    'Erzurum': 4.5
};

const TARIFF_RATES = {
    home: 2.8,    // Avg TL/kWh for residential
    business: 4.5 // Avg TL/kWh for commercial
};

export const SolarCalculator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [bill, setBill] = useState(1500);
    const [city, setCity] = useState('İstanbul');
    const [tariff, setTariff] = useState<'home' | 'business'>('home');
    const [result, setResult] = useState<any>(null);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const calculate = () => {
        const rate = TARIFF_RATES[tariff];
        const sunHours = citySunData[city] || 4.2;

        // 1. Calculate Usage
        const monthlyConsumptionKwh = bill / rate;
        const dailyConsumptionKwh = monthlyConsumptionKwh / 30;

        // 2. System Size (kWp)
        // Formula: Daily Usage / (Sun Hours * Efficiency)
        // Efficiency 0.8 to account for system losses, temp, angle etc.
        const systemSizeKw = (dailyConsumptionKwh / (sunHours * 0.8));

        // Round to nearest 0.5 kW logic or just 2 decimals
        const recommendedSize = Math.max(1, Math.ceil(systemSizeKw * 10) / 10);

        // 3. Panel Count (using 550W panels)
        const panelPowerW = 550;
        const panelCount = Math.ceil((recommendedSize * 1000) / panelPowerW);

        // 4. Investment Cost (Estimation)
        // Approx $800 - $1000 per kW depending on size. Smaller systems cost more per kW.
        // Let's use a dynamic price curve.
        // Exchange Rate assumption: 1 USD = 34 TL
        const exchangeRate = 34;
        let costPerKwUsd = 900;
        if (recommendedSize > 10) costPerKwUsd = 850;
        if (recommendedSize > 50) costPerKwUsd = 750;

        const totalCostUsd = recommendedSize * costPerKwUsd;
        const totalCostTl = totalCostUsd * exchangeRate;

        // 5. Payback (ROI)
        const annualGenerationKwh = recommendedSize * sunHours * 365 * 0.8;
        const annualSavingsTl = annualGenerationKwh * rate;
        const paybackMonths = Math.round((totalCostTl / annualSavingsTl) * 12);
        const paybackYears = (paybackMonths / 12).toFixed(1);

        // 6. Impact
        const co2Savings = annualGenerationKwh * 0.5; // kg CO2
        const treesSaved = Math.round(co2Savings / 20); // 1 tree approx 20kg CO2/year

        setResult({
            size: recommendedSize.toFixed(2),
            panels: panelCount,
            cost: totalCostTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
            paybackYears,
            monthlyProduction: Math.round(annualGenerationKwh / 12),
            co2: Math.round(co2Savings / 1000), // tonnes
            trees: treesSaved
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
            {!isQuoteModalOpen && (
                <div className="bg-white dark:bg-[#1a2e22] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col my-8" onClick={e => e.stopPropagation()}>
                    <div className="p-6 bg-primary/10 border-b border-primary/20 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">solar_power</span>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Güneş Enerjisi Hesaplama</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Şehrinize özel tasarruf analizi.</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {!result ? (
                            <div className="space-y-8">
                                {/* City & Tariff Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Konum (Şehir)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">location_on</span>
                                            <select
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                                            >
                                                {Object.keys(citySunData).map(c => <option key={c} value={c}>{c}</option>)}
                                                <option value="Diğer">Diğer</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Abone Tipi</label>
                                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-black/20 rounded-xl">
                                            <button
                                                onClick={() => setTariff('home')}
                                                className={`py-2 rounded-lg text-sm font-bold transition-all ${tariff === 'home' ? 'bg-white dark:bg-primary shadow-sm text-slate-900 dark:text-black' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                            >
                                                <span className="flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">home</span> Mesken</span>
                                            </button>
                                            <button
                                                onClick={() => setTariff('business')}
                                                className={`py-2 rounded-lg text-sm font-bold transition-all ${tariff === 'business' ? 'bg-white dark:bg-primary shadow-sm text-slate-900 dark:text-black' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                            >
                                                <span className="flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[18px]">storefront</span> Ticari</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bill Input */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                                        Aylık Ortalama Elektrik Faturası
                                    </label>
                                    <div className="relative mb-6">
                                        <input
                                            type="number"
                                            value={bill}
                                            onChange={(e) => setBill(Number(e.target.value))}
                                            className="w-full pl-6 pr-16 py-6 text-4xl font-black text-center rounded-2xl border-2 border-primary/20 bg-primary/5 focus:border-primary focus:ring-0 text-slate-900 dark:text-white"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">TL</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="500"
                                        max="50000"
                                        step="100"
                                        value={bill}
                                        onChange={(e) => setBill(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                                        <span>500 TL</span>
                                        <span>50.000 TL+</span>
                                    </div>
                                </div>

                                <button
                                    onClick={calculate}
                                    className="w-full py-4 bg-primary hover:bg-[#0fd630] text-black font-black text-lg rounded-xl shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">calculate</span>
                                    HESAPLA
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <ResultCard label="Gerekli Sistem" value={`${result.size} kW`} icon="solar_power" color="green" />
                                    <ResultCard label="Panel Sayısı" value={`${result.panels} Adet`} icon="grid_view" color="orange" />
                                    <ResultCard label="Amortisman" value={`${result.paybackYears} Yıl`} icon="savings" color="blue" />
                                    <ResultCard label="Tahmini Maliyet" value={`~${result.cost} TL`} icon="payments" color="red" />
                                </div>

                                <div className="bg-gradient-to-br from-slate-50 to-white dark:from-white/5 dark:to-white/10 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500">eco</span>
                                        Çevresel Etki ve Kazanımlar
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                                <span className="material-symbols-outlined">co2</span>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{result.co2} Ton</p>
                                                <p className="text-xs text-slate-500">Yıllık CO2 Tasarrufu</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                <span className="material-symbols-outlined">forest</span>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{result.trees} Ağaç</p>
                                                <p className="text-xs text-slate-500">Kurtarılan Ağaç</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 dark:text-slate-300">Yıllık Tahmini Üretim:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{(result.monthlyProduction * 12).toLocaleString()} kWh</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setResult(null)}
                                        className="flex-1 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl transition-colors"
                                    >
                                        Tekrar Hesapla
                                    </button>
                                    <button
                                        onClick={() => setIsQuoteModalOpen(true)}
                                        className="flex-[2] py-4 bg-primary hover:bg-[#0fd630] text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        Teklif Al
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isQuoteModalOpen && result && (
                <QuoteRequestModal
                    calculationData={{ ...result, city, tariff, bill }}
                    onClose={() => setIsQuoteModalOpen(false)}
                />
            )}
        </div>
    );
};

const ResultCard = ({ label, value, icon, color }: any) => {
    const colors: any = {
        green: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        orange: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
        blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        red: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    };

    return (
        <div className={`p-4 rounded-xl border ${colors[color]} text-center`}>
            <div className="mb-2 flex justify-center opacity-80"><span className="material-symbols-outlined">{icon}</span></div>
            <p className="text-xs opacity-80 mb-1 font-bold uppercase tracking-wide">{label}</p>
            <p className="text-lg md:text-xl font-black">{value}</p>
        </div>
    );
};
