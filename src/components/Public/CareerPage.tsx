
import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';

export const CareerPage: React.FC = () => {
    const { addJobApplication, openPositions } = useData();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        linkedinUrl: '',
        coverLetter: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        await addJobApplication(formData);
        setStatus('success');
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20 pt-10">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <span className="text-primary font-bold tracking-wider uppercase mb-2 block">Kariyer</span>
                        <h1 className="text-4xl md:text-5xl font-black font-display mb-6">Bizimle Geleceği İnşa Edin</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Vural Enerji olarak, yenilikçi ve tutkulu yetenekleri aramıza katmaktan heyecan duyuyoruz. Sürdürülebilir bir dünya için enerjinizi bizimle birleştirin.
                        </p>

                        <div className="space-y-6">
                            <div className="p-6 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5">
                                <h3 className="font-bold text-lg mb-4">Açık Pozisyonlar</h3>
                                {openPositions.filter(p => p.isActive).length === 0 ? (
                                    <p className="text-gray-500 text-sm">Şu anda açık pozisyon bulunmamaktadır.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {openPositions.filter(p => p.isActive).map((pos) => (
                                            <div key={pos.id} className="border-b border-gray-100 dark:border-white/5 last:border-0 pb-4 last:pb-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{pos.title}</h4>
                                                    <span className="text-[10px] bg-primary/10 text-primary-dark px-2 py-1 rounded font-bold uppercase">{pos.type}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2">{pos.location}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{pos.description}</p>
                                                <button onClick={() => setFormData({ ...formData, position: pos.title })} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                                                    Başvur
                                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5">
                        {status === 'success' ? (
                            <div className="text-center py-10">
                                <div className="size-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Başvurunuz Alındı!</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Başvurunuz İnsan Kaynakları departmanımıza iletilmiştir. Değerlendirme sonucunda sizinle iletişime geçilecektir.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <h3 className="text-2xl font-bold mb-6">Genel Başvuru Formu</h3>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Ad Soyad</label>
                                    <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full h-12 rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Email</label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Telefon</label>
                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full h-12 rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Başvurulan Pozisyon</label>
                                    <input required type="text" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} className="w-full h-12 rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" placeholder="Örn: Saha Mühendisi" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">LinkedIn Profili / Portfolyo URL</label>
                                    <input type="text" value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} className="w-full h-12 rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Ön Yazı / Hakkınızda</label>
                                    <textarea required rows={4} value={formData.coverLetter} onChange={e => setFormData({ ...formData, coverLetter: e.target.value })} className="w-full rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" placeholder="Kendinizden ve tecrübelerinizden kısaca bahsedin..."></textarea>
                                </div>

                                <button type="submit" disabled={status === 'submitting'} className="w-full h-14 bg-primary hover:bg-green-600 text-black font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 text-lg">
                                    {status === 'submitting' ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
