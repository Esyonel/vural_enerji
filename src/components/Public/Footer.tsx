import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../services/dataProvider';

const SocialLink: React.FC<{ icon: string, url: string }> = ({ icon, url }) => {
    let finalUrl = url;
    if (!finalUrl.startsWith('http') && finalUrl !== '#') {
        finalUrl = `https://${finalUrl}`;
    }

    return (
        <a href={finalUrl} target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black transition-all cursor-pointer">
            <span className="material-symbols-outlined">{icon}</span>
        </a>
    );
};

export const Footer: React.FC = () => {
    const { siteContent } = useData();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setMessage(data.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.message || 'Bir hata oluştu.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Bağlantı hatası.');
        }
    };

    return (
        <footer className="bg-white dark:bg-[#0c180e] border-t border-gray-200 dark:border-white/5 pt-16 pb-8 mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Newsletter Section */}
                <div className="bg-primary/5 dark:bg-primary/5 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-3">
                            <span className="material-symbols-outlined text-[20px]">mail</span>
                            <span>E-Bülten</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-display mb-3">
                            Gelişmeleri Kaçırmayın!
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Sektördeki yenilikler, kampanya ve duyurulardan haberdar olmak için bültenimize abone olun.
                        </p>
                    </div>
                    <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            required
                            placeholder="E-posta adresiniz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-6 py-4 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-80"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${status === 'success'
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-primary text-black hover:bg-[#0fd630] hover:-translate-y-1'
                                }`}
                        >
                            {status === 'loading' ? 'İşleniyor...' : status === 'success' ? 'Abone Olundu!' : 'Abone Ol'}
                            {status === 'idle' && <span className="material-symbols-outlined">send</span>}
                            {status === 'success' && <span className="material-symbols-outlined">check</span>}
                        </button>
                    </form>
                </div>
                {message && status !== 'idle' && (
                    <div className={`mb-8 text-center text-sm font-bold ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <img
                                src="/logo.png"
                                alt="Vural Enerji Logo"
                                className="h-10 w-auto object-contain rounded-full"
                            />
                            <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">Vural Enerji</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">
                            {siteContent.aboutText}
                        </p>
                        <div className="flex gap-4">
                            {siteContent.socialLinks.map((social: any, i: number) => (
                                <SocialLink key={i} icon={social.icon} url={social.url} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Kurumsal</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="/about" className="hover:text-primary transition-colors block">Hakkımızda</Link></li>
                            <li><Link to="/vision-mission" className="hover:text-primary transition-colors block">Vizyon & Misyon</Link></li>
                            <li><Link to="/career" className="hover:text-primary transition-colors block">Kariyer</Link></li>
                            <li><Link to="/blog" className="hover:text-primary transition-colors block">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-6">İletişim</h4>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                                <span>{siteContent.contactAddress}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">phone_in_talk</span>
                                <span className="font-semibold text-slate-900 dark:text-gray-200">{siteContent.contactPhone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">mail</span>
                                <span>{siteContent.contactEmail}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">© 2024 Vural Enerji. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a className="hover:text-primary transition-colors cursor-pointer">Gizlilik Politikası</a>
                        <a className="hover:text-primary transition-colors cursor-pointer">Kullanım Şartları</a>
                        <a className="hover:text-primary transition-colors cursor-pointer">Çerez Politikası</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
