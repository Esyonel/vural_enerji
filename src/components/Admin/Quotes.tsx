import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { QuoteRequest } from '../../types';

export const Quotes: React.FC = () => {
    const { quotes, updateQuoteStatus, deleteQuote } = useData();
    const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

    const handleStatusChange = async (id: string, status: QuoteRequest['status']) => {
        await updateQuoteStatus(id, status);
        if (selectedQuote && selectedQuote.id === id) {
            setSelectedQuote({ ...selectedQuote, status });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Teklif Takip</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gelen fiyat taleplerini görüntüleyin ve yönetin.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                        {quotes.filter(q => q.status === 'new').length} Yeni
                    </span>
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30">
                        {quotes.filter(q => q.status === 'offered').length} Teklif Verildi
                    </span>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Müşteri</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ürün</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {quotes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                                        Henüz bir teklif talebi bulunmuyor.
                                    </td>
                                </tr>
                            ) : (
                                quotes.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white">{quote.customerName}</span>
                                                <span className="text-xs text-slate-500">{quote.companyName || 'Bireysel'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-900 dark:text-white">{quote.productName}</span>
                                                <span className="text-xs text-slate-500">{quote.productSku}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {quote.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <QuoteStatusBadge status={quote.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedQuote(quote)}
                                                className="bg-primary/10 text-primary hover:bg-primary hover:text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                            >
                                                Görüntüle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quote Detail Modal */}
            {selectedQuote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedQuote(null)}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Teklif Detayı #{selectedQuote.id}</h3>
                            <button onClick={() => setSelectedQuote(null)} className="text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Müşteri Bilgileri</h4>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                                            <span className="font-bold">{selectedQuote.customerName}</span>
                                        </p>
                                        <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-[18px] text-primary">domain</span>
                                            <span>{selectedQuote.companyName || '-'}</span>
                                        </p>
                                        <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-[18px] text-primary">phone</span>
                                            <span>{selectedQuote.phone}</span>
                                        </p>
                                        <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                                            <span>{selectedQuote.email}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Talep Edilen Ürün</h4>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedQuote.productName}</p>
                                        <p className="text-xs text-slate-500">{selectedQuote.productSku}</p>
                                        <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                                            <p className="text-xs text-slate-400">Talep Tarihi: {selectedQuote.date}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Müşteri Mesajı</h4>
                                <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 italic">
                                    "{selectedQuote.message}"
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Durum Değiştir:</span>
                                    <select 
                                        value={selectedQuote.status}
                                        onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value as any)}
                                        className="text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-black/20"
                                    >
                                        <option value="new">Yeni</option>
                                        <option value="offered">Teklif Verildi</option>
                                        <option value="accepted">Onaylandı</option>
                                        <option value="rejected">Reddedildi</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleStatusChange(selectedQuote.id, 'offered')}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Teklif Verildi Olarak İşaretle
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(window.confirm('Bu talebi silmek istediğinize emin misiniz?')) {
                                                deleteQuote(selectedQuote.id);
                                                setSelectedQuote(null);
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const QuoteStatusBadge = ({ status }: { status: string }) => {
    const config: any = {
        new: { color: 'blue', label: 'Yeni Talep', icon: 'new_releases' },
        offered: { color: 'orange', label: 'Teklif Verildi', icon: 'send' },
        accepted: { color: 'green', label: 'Onaylandı', icon: 'check_circle' },
        rejected: { color: 'red', label: 'Reddedildi', icon: 'cancel' }
    };
    const { color, label, icon } = config[status] || config.new;
    
    const classes = status === 'new'
        ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
        : status === 'offered'
        ? 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30'
        : status === 'accepted'
        ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
        : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30';

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${classes}`}>
            <span className="material-symbols-outlined text-[14px]">{icon}</span>
            {label}
        </span>
    );
};