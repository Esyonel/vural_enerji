
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useData } from '../../services/dataProvider';

export const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useData();
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const handleLogout = () => {
        // First navigate to home to unmount protected routes
        navigate('/');
        // Then clear session state after a brief delay to ensure navigation logic completes
        setTimeout(() => {
            logout();
        }, 50);
    };

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between shadow-xl md:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-12 w-auto object-contain rounded-full"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold leading-tight tracking-tight dark:text-white">Vural Enerji</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Yönetim Paneli</p>
                            </div>
                        </div>
                        <button onClick={closeSidebar} className="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar">
                        <NavItem to="/admin" icon="dashboard" label="Kontrol Paneli" end onClick={closeSidebar} />
                        <NavItem to="/admin/quotes" icon="request_quote" label="Teklif Takip" onClick={closeSidebar} />
                        <NavItem to="/admin/products" icon="inventory_2" label="Ürün Yönetimi" onClick={closeSidebar} />
                        <NavItem to="/admin/media" icon="perm_media" label="Medya Kütüphanesi" onClick={closeSidebar} />
                        <NavItem to="/admin/categories" icon="category" label="Kategori Yönetimi" onClick={closeSidebar} />
                        <NavItem to="/admin/projects" icon="solar_power" label="Projeler" onClick={closeSidebar} />
                        <NavItem to="/admin/blog" icon="article" label="Blog Yazıları" onClick={closeSidebar} />
                        <NavItem to="/admin/career" icon="work" label="İş Başvuruları" onClick={closeSidebar} />
                        <NavItem to="/admin/contact-messages" icon="mail" label="İletişim Formu" onClick={closeSidebar} />
                        <NavItem to="/admin/content" icon="edit_note" label="İçerik Yönetimi" onClick={closeSidebar} />
                        <NavItem to="/admin/admins" icon="admin_panel_settings" label="Adminler" onClick={closeSidebar} />
                        <NavItem to="/admin/users" icon="group" label="Kullanıcı Yönetimi" onClick={closeSidebar} />
                        <NavItem to="/admin/settings" icon="settings" label="Ayarlar" onClick={closeSidebar} />

                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>


                    </nav>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-black/20">
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-sm shrink-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop")' }}></div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-semibold truncate dark:text-white">Vural Admin</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1">admin@vuralenerji.com</p>
                            <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 transition-colors text-xs font-bold">
                                <span className="material-symbols-outlined text-[14px]">logout</span>
                                <span>Güvenli Çıkış</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                <div className="md:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 z-10 shadow-sm">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-10 w-auto object-contain rounded-full"
                        />
                        <span className="font-bold dark:text-white">Vural Enerji</span>
                    </div>
                    <button onClick={toggleSidebar} className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, end, onClick }: any) => (
    <NavLink
        to={to}
        end={end}
        onClick={onClick}
        className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
            ? 'bg-primary/20 text-green-900 dark:text-primary font-medium shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
    >
        <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-sm">{label}</span>
    </NavLink>
);
