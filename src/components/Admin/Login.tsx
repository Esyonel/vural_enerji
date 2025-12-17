import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';

interface LoginProps {
    onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useData();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(email, password);

            if (result.success && result.user) {
                if (result.user.role === 'admin') {
                    onLogin();
                } else {
                    setError('Bu hesaba erişim yetkiniz yok (Admin değil).');
                }
            } else {
                setError(result.message || 'Giriş başarısız.');
            }
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden py-6 sm:py-12 bg-background-dark">
            {/* Background Pattern */}
            <div className="absolute inset-0 w-full h-full opacity-10" style={{
                backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f27f0d" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
            }}></div>

            <div className="relative w-full max-w-md px-4 mx-auto">
                <div className="bg-[#2c2219] border border-[#493622] shadow-2xl rounded-2xl p-8 sm:p-10 flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex items-center justify-center p-2 mb-2 bg-white/5 rounded-2xl">
                            <img
                                src="https://r2.erweima.ai/imgcatcher/6325988e-4b47-4950-932d-209e73b22292.png"
                                alt="Logo"
                                className="h-24 w-auto object-contain drop-shadow-lg"
                            />
                        </div>
                        <div>
                            <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Yönetici Girişi</h2>
                            <p className="text-[#cbad90] text-sm font-medium mt-1">Yönetim paneline erişmek için giriş yapın</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
                        <div className="space-y-2">
                            <label className="text-white text-sm font-semibold leading-normal" htmlFor="username">Kullanıcı Adı</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-[#cbad90]">
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                </span>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-login-accent/50 border border-[#684d31] bg-[#342618] focus:border-login-accent h-12 pl-11 pr-4 placeholder:text-[#cbad90]/60 text-base font-normal leading-normal transition-all"
                                    id="username"
                                    placeholder="admin"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-white text-sm font-semibold leading-normal" htmlFor="password">Şifre</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-[#cbad90]">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </span>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-login-accent/50 border border-[#684d31] bg-[#342618] focus:border-login-accent h-12 pl-11 pr-12 placeholder:text-[#cbad90]/60 text-base font-normal leading-normal transition-all"
                                    id="password"
                                    placeholder="******"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-bold">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-1">
                            <label className="inline-flex items-center cursor-pointer">
                                <input className="form-checkbox size-4 rounded border-[#684d31] text-login-accent focus:ring-login-accent bg-[#342618] cursor-pointer transition-colors" type="checkbox" />
                                <span className="ml-2 text-sm text-[#cbad90]">Beni hatırla</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-login-accent text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 active:scale-[0.98] transition-all duration-200 mt-2 shadow-lg shadow-login-accent/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">{isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-[#cbad90]/60">
                            © 2024 Vural Enerji. Tüm hakları saklıdır.
                            <br />
                            <span className="opacity-70">Güvenli Yönetim Paneli V.1.0</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};