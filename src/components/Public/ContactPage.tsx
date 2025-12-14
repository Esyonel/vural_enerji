
import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { Link } from 'react-router-dom';
import { SEO } from '../SEO';

export const ContactPage: React.FC = () => {
    const { siteContent, addContactMessage } = useData();
    const [status, setStatus] = useState<'idle' | 'success'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addContactMessage(formData);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20 pt-10">
            <SEO
                title="İletişim - Bize Ulaşın"
                description="Vural Enerji iletişim bilgileri. Adres, telefon ve e-posta üzerinden bize ulaşabilir, fiyat teklifi alabilirsiniz."
            />
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase mb-2 block">İletişim</span>
                    <h1 className="text-4xl md:text-5xl font-black font-display mb-6">Bize Ulaşın</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                        Projeleriniz için teklif almak, teknik destek istemek veya sadece tanışmak için bize yazın.
                    </p>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center order-2 md:order-1">
                        {status === 'success' ? (
                            <div className="text-center">
                                <div className="size-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Mesajınız Alındı!</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">
                                    En kısa sürede size dönüş yapacağız.
                                </p>
                                <button onClick={() => setStatus('idle')} className="text-primary font-bold hover:underline">Yeni Mesaj Gönder</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">İletişim Formu</h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Adınız Soyadınız</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" placeholder="Ad Soyad" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-posta Adresiniz</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" placeholder="ornek@email.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mesajınız</label>
                                    <textarea rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary" placeholder="Nasıl yardımcı olabiliriz?" required></textarea>
                                </div>
                                <button type="submit" className="w-full h-12 bg-primary hover:bg-green-600 text-black font-bold rounded-xl transition-colors shadow-lg shadow-primary/20">
                                    Gönder
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="md:w-1/2 bg-gray-900 relative order-1 md:order-2 flex flex-col">
                        {/* Map Section */}
                        <div className="w-full h-[300px] md:h-[400px] filter grayscale hover:grayscale-0 transition-all duration-500">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3184.225577609756!2d36.24285731475726!3d37.06587447989396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152dd70a3592381f%3A0x6b4c8030200878e0!2sR%C4%B1zaiye%2C%2010058.%20Sk.%20No%3A29%2C%2080000%20Osmaniye%20Merkez%2FOsmaniye!5e0!3m2!1str!2str!4v1684700000000!5m2!1str!2str"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                title="Konum"
                            ></iframe>
                        </div>

                        {/* Contact Info Overlay */}
                        <div className="flex-1 p-10 md:p-12 flex flex-col justify-center text-white bg-black/50 backdrop-blur-sm relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90 -z-10"></div>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary p-3 rounded-full text-black shadow-[0_0_15px_rgba(19,236,55,0.5)]">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Merkez Ofis</h4>
                                        <p className="text-gray-300 leading-relaxed max-w-xs">{siteContent.contactAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary p-3 rounded-full text-black shadow-[0_0_15px_rgba(19,236,55,0.5)]">
                                        <span className="material-symbols-outlined">phone_in_talk</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Telefon</h4>
                                        <p className="text-gray-300">{siteContent.contactPhone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary p-3 rounded-full text-black shadow-[0_0_15px_rgba(19,236,55,0.5)]">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">E-posta</h4>
                                        <p className="text-gray-300">{siteContent.contactEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
