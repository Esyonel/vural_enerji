
import React, { useState } from 'react';

export const SolarCalculator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [bill, setBill] = useState(1000);
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        // Simple logic: 1000 TL bill ~= 250 kWh usage (approx 4 TL/kWh)
        // System needed: Usage / 30 days / 5 sun hours * 1.3 (efficiency factor)
        const rate = 3.5; // TL per kWh
        const monthlyKwh = bill / rate;
        const dailyKwh = monthlyKwh / 30;
        const systemSizeKw = (dailyKwh / 4.5) * 1.2; // 4.5 sun hours avg
        const panels = Math.ceil((systemSizeKw * 1000) / 550); // 550W panels
        const cost = Math.round(systemSizeKw * 800 * 30); // Approx cost in TL (800 USD/kW * 30 rate)
        const payback = Math.round(cost / bill);

        setResult({
            size: systemSizeKw.toFixed(2),
            panels,
            cost: cost.toLocaleString('tr-TR'),
            payback
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-[#1a2e22] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10" onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">solar_power</span>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Solar Hesaplama</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">İhtiyacınızı saniyeler içinde öğrenin.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-8">
                    {!result ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Aylık Elektrik Faturası (TL)
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={bill} 
                                        onChange={(e) => setBill(Number(e.target.value))}
                                        className="w-full pl-4 pr-12 py-4 text-2xl font-bold rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">TL</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="200" 
                                    max="10000" 
                                    step="100" 
                                    value={bill} 
                                    onChange={(e) => setBill(Number(e.target.value))}
                                    className="w-full mt-4 accent-primary"
                                />
                            </div>
                            <button 
                                onClick={calculate}
                                className="w-full py-4 bg-primary hover:bg-green-600 text-black font-bold text-lg rounded-xl shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02]"
                            >
                                Hesapla
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 text-center">
                                    <p className="text-sm text-green-800 dark:text-green-300 mb-1">Gerekli Sistem</p>
                                    <p className="text-2xl font-black text-green-900 dark:text-primary">{result.size} kW</p>
                                </div>
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800 text-center">
                                    <p className="text-sm text-orange-800 dark:text-orange-300 mb-1">Panel Sayısı</p>
                                    <p className="text-2xl font-black text-orange-900 dark:text-orange-500">{result.panels} Adet</p>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-600 dark:text-slate-400">Tahmini Maliyet</span>
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">~{result.cost} TL</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 dark:text-slate-400">Amortisman Süresi</span>
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">{result.payback} Ay</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setResult(null)}
                                className="w-full py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold rounded-xl transition-colors"
                            >
                                Tekrar Hesapla
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
