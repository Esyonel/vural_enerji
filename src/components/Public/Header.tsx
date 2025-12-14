
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../services/dataProvider';
import { SolarCalculator } from './SolarCalculator';

export const Header: React.FC = () => {
    const { currentUser } = useData();
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (id: string) => {
        setIsMobileMenuOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
            // Small timeout to allow navigation to complete before scrolling
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const offset = 100; // Adjust for fixed header
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }, 300);
        } else {
            const element = document.getElementById(id);
            if (element) {
                const offset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300 bg-white/80 backdrop-blur-xl border-b border-gray-100 dark:bg-background-dark/80 dark:border-white/5">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24">
                        <Link to="/" className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img
                                src="/logo.png"
                                alt="Vural Enerji Logo"
                                className="h-14 w-auto object-contain drop-shadow-sm rounded-full"
                            />
                            <h2 className="text-slate-900 dark:text-white text-2xl font-bold font-display tracking-tight hidden sm:block">Vural Enerji</h2>
                        </Link>

                        {/* Desktop Menu */}
                        <nav className="hidden xl:flex items-center gap-6 xl:gap-8">
                            <button onClick={() => handleNavigation('products')} className="text-sm font-semibold hover:text-primary transition-colors">Ürünler</button>
                            <Link to="/about" className="text-sm font-semibold hover:text-primary transition-colors">Hakkımızda</Link>
                            <Link to="/vision-mission" className="text-sm font-semibold hover:text-primary transition-colors">Vizyon & Misyon</Link>
                            <Link to="/blog" className="text-sm font-semibold hover:text-primary transition-colors">Blog</Link>
                            <Link to="/career" className="text-sm font-semibold hover:text-primary transition-colors">Kariyer</Link>
                            <Link to="/contact" className="text-sm font-semibold hover:text-primary transition-colors">Bize Ulaşın</Link>
                            <button
                                onClick={() => setIsCalculatorOpen(true)}
                                className="text-white bg-accent px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20"
                            >
                                Solar Hesaplama
                                <span className="material-symbols-outlined text-[18px]">calculate</span>
                            </button>
                        </nav>

                        <div className="flex items-center gap-4">
                            {currentUser ? (
                                <Link to={currentUser.role === 'admin' ? "/admin" : "/profile"} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors group">
                                    <div className="size-6 rounded-full overflow-hidden bg-gray-200">
                                        <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors flex items-center">
                                        {currentUser.role === 'admin' ? (
                                            <span className="material-symbols-outlined text-green-600 dark:text-green-500 text-[24px]">security</span>
                                        ) : 'Profilim'}
                                    </span>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="hidden sm:flex items-center justify-center px-5 py-2 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary hover:text-black border border-primary/20 transition-all text-sm">
                                        Giriş Yap
                                    </Link>
                                    {/* Shield Icon for Admin Entrance */}
                                    <Link to="/login" className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Yönetici Girişi">
                                        <span className="material-symbols-outlined">security</span>
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                className="xl:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="xl:hidden bg-white dark:bg-[#1a2e22] border-t border-gray-100 dark:border-white/5 animate-fade-in-up">
                        <nav className="flex flex-col p-4 gap-2">
                            <button onClick={() => handleNavigation('products')} className="text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-black/20 font-semibold">Ürünler</button>
                            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-black/20 font-semibold">Hakkımızda</Link>
                            <Link to="/vision-mission" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-black/20 font-semibold">Vizyon & Misyon</Link>
                            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-black/20 font-semibold">Blog</Link>
                            <Link to="/career" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-black/20 font-semibold">Kariyer</Link>
                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-black/20 font-semibold">Bize Ulaşın</Link>
                            <button
                                onClick={() => { setIsCalculatorOpen(true); setIsMobileMenuOpen(false); }}
                                className="text-left px-4 py-3 rounded-xl bg-accent/10 text-accent font-bold"
                            >
                                Solar Hesaplama
                            </button>
                            {!currentUser && (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-black/20 font-semibold text-primary">
                                    Giriş Yap
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {isCalculatorOpen && <SolarCalculator onClose={() => setIsCalculatorOpen(false)} />}
        </>
    );
};
