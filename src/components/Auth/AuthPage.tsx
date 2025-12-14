
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../services/dataProvider';

export const AuthPage: React.FC = () => {
    const { login, register } = useData();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    if (result.user?.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/profile');
                    }
                } else {
                    setError(result.message || 'Giriş başarısız.');
                }
            } else {
                if (!formData.name) {
                    setError('İsim alanı zorunludur.');
                    setIsLoading(false);
                    return;
                }
                const result = await register(formData.name, formData.email, formData.password);
                if (result.success) {
                    navigate('/profile');
                } else {
                    setError(result.message || 'Kayıt başarısız.');
                }
            }
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=3174&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background-dark"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 mb-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-16 w-auto object-contain rounded-full"
                        />
                    </div>
                    <h2 className="text-3xl font-black text-white font-display">Vural Enerji</h2>
                    <p className="text-gray-400 mt-2">Geleceğin enerjisine katılın.</p>
                </div>

                <div className="bg-[#1a2e22]/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="flex gap-4 mb-8 p-1 bg-black/20 rounded-xl">
                        <button
                            onClick={() => { setIsLogin(true); setError(''); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-primary text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Giriş Yap
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-primary text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Kayıt Ol
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Ad Soyad</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                                {isLogin ? 'E-posta veya Kullanıcı Adı' : 'E-posta'}
                            </label>
                            <input
                                type={isLogin ? "text" : "email"}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                                placeholder={isLogin ? "ornek@email.com veya admin" : "ornek@email.com"}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Şifre</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                                placeholder="******"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-primary hover:bg-green-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 mt-4 flex items-center justify-center gap-2"
                        >
                            {isLoading && <span className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>}
                            {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
