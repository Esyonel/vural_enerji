import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataProvider';
import { Product } from '../../types';

interface CalculationResult {
    size: string;
    panels: number;
    cost: string;
    paybackYears?: string; // Updated from payback
    city?: string;
    tariff?: string;
    bill?: number;
}

interface QuoteRequestModalProps {
    product?: Product;
    calculationData?: CalculationResult;
    onClose: () => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ product, calculationData, onClose }) => {
    const { addQuote } = useData();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    // Determine initial message based on props
    const getInitialMessage = () => {
        if (product) {
            return `Merhaba, ${product.name} (SKU: ${product.sku}) ürünü için fiyat teklifi almak istiyorum.`;
        }
        if (calculationData) {
            const tariffLabel = calculationData.tariff === 'business' ? 'Ticari' : 'Mesken';
            return `Merhaba, Solar Hesaplayıcı sonucuma göre fiyat teklifi almak istiyorum.\n\n` +
                `Konum: ${calculationData.city}\n` +
                `Abone Tipi: ${tariffLabel}\n` +
                `Ort. Fatura: ${calculationData.bill} TL\n` +
                `-------------------\n` +
                `Önerilen Sistem: ${calculationData.size} kW\n` +
                `Panel Sayısı: ${calculationData.panels} Adet\n` +
                `Tahmini Maliyet: ${calculationData.cost} TL\n` +
                `Amortisman: ${calculationData.paybackYears} Yıl`;
        }
        return 'Merhaba, fiyat teklifi almak istiyorum.';
    };

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        phone: '',
        email: '',
        message: getInitialMessage(),
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        await addQuote({
            customerName: formData.name,
            companyName: formData.company,
            phone: formData.phone,
            email: formData.email,
            message: formData.message,
            notes: formData.notes,
            productName: product ? product.name : (calculationData ? `Solar Sistem (${calculationData.size} kW)` : 'Genel Teklif'),
            productSku: product ? product.sku : (calculationData ? 'SOLAR-CALC' : '-')
        });

        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-[#1a2e22] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/10 p-8 text-center animate-fade-in-up">
                    <div className="size-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-5xl">check_circle</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Talebiniz Alındı!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Fiyat teklifi isteğiniz başarıyla tarafımıza ulaştı. Satış ekibimiz en kısa sürede sizinle iletişime geçecektir.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full h-12 bg-primary hover:bg-green-600 text-black font-bold rounded-xl transition-colors shadow-lg"
                    >
                        Tamam
                    </button>
                </div>
            </div>
        );
    }

    const title = product ? 'Fiyat Teklifi Al' : 'Sistem Teklifi Al';
    const subTitle = product ? `Ürün: ${product.name}` : (calculationData ? `${calculationData.size} kW Güneş Enerjisi Sistemi` : '');
    const imageUrl = product ? product.imageUrl : 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=3264&auto=format&fit=crop';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-[#1a2e22] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-primary/10 border-b border-primary/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">request_quote</span>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{subTitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-8 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="size-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{product ? product.name : 'Güneş Enerjisi Sistemi'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{product ? product.sku : (calculationData ? `${calculationData.size} kW Kurulum` : '')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ad Soyad <span className="text-red-500">*</span></label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Firma Adı</label>
                                <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full h-11 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Telefon <span className="text-red-500">*</span></label>
                                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full h-11 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-posta <span className="text-red-500">*</span></label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full h-11 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mesajınız</label>
                                <textarea rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full p-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"></textarea>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ek Notlar (Opsiyonel)</label>
                                <textarea rows={2} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full p-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" placeholder="Varsa eklemek istediğiniz teknik detaylar veya özel notlar..."></textarea>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-12 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="flex-[2] h-12 bg-primary hover:bg-green-600 text-black font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <span className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        <span>Teklif İste</span>
                                        <span className="material-symbols-outlined text-[20px]">send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
