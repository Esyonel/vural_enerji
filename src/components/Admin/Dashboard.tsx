import React from 'react';
import { useData } from '../../services/dataProvider';

export const Dashboard: React.FC = () => {
    const { products, orders, isLoading } = useData();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-40 w-full bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Genel Bakış</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Sistem durumunu ve performans raporlarını görüntüleyin.</p>
                </div>
                <div className="w-full md:w-96">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        </div>
                        <input className="block w-full pl-10 pr-4 py-2.5 rounded-xl border-none ring-1 ring-slate-200 dark:ring-slate-700 bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary shadow-sm text-sm transition-all" placeholder="Talep, ürün veya müşteri arayın..." type="text"/>
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white min-h-[160px] flex flex-col justify-center" style={{backgroundImage: 'linear-gradient(90deg, rgba(16, 34, 23, 0.95) 0%, rgba(13, 242, 108, 0.1) 100%)'}}>
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=3174&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 px-8 py-6 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold mb-3 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>SİSTEM AKTİF</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Hoş geldin, Vural Admin 👋</h2>
                    <p className="text-slate-300 text-sm md:text-base opacity-90">Bugün ürün görüntülemelerinde %12 artış var. Bekleyen 45 yeni fiyat talebi onayınızı bekliyor.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="group" color="blue" label="Toplam Ziyaretçi" value="12,340" change="+12%" />
                <StatCard icon="mark_email_unread" color="orange" label="Bekleyen Talepler" value="45" change="+5%" />
                <StatCard icon="inventory_2" color="purple" label="Toplam Stok" value={totalStock.toString()} change="+2%" />
                <StatCard icon="thumb_up" color="green" label="Memnuniyet" value="%98" change="+1%" />
            </div>

            {/* Chart and Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Site Trafiği Analizi</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-3xl font-bold tracking-tight">12,340</p>
                                <span className="text-sm font-medium text-primary flex items-center bg-primary/10 px-2 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> 15%
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Son 30 gün verileri</p>
                        </div>
                    </div>
                    {/* Simplified Chart Visual */}
                    <div className="relative w-full h-[250px] mt-4 flex items-end justify-between px-2 gap-2">
                        {[40, 60, 45, 70, 50, 80, 65, 85, 90, 75, 60, 95].map((h, i) => (
                            <div key={i} className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-all relative group" style={{height: `${h}%`}}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {h * 10}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Status */}
                <div className="flex flex-col gap-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Stok Durumu</h3>
                        <div className="flex flex-col gap-5">
                            <StockBar label="Güneş Panelleri" value={85} color="bg-primary" />
                            <StockBar label="İnvertörler" value={45} color="bg-orange-500" />
                            <StockBar label="Batarya Üniteleri" value={12} color="bg-red-500" />
                        </div>
                        <button className="w-full mt-6 py-2 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                            Detaylı Rapor
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Son Teklif Talepleri</h3>
                    <a className="text-sm font-medium text-primary hover:underline cursor-pointer">Tümünü Gör</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Talep No</th>
                                <th className="px-6 py-4">Müşteri</th>
                                <th className="px-6 py-4">Ürün</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {orders.map((order, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{order.id}</td>
                                    <td className="px-6 py-4">{order.customer}</td>
                                    <td className="px-6 py-4">{order.product}</td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, color, label, value, change }: any) => (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg text-${color}-600 dark:text-${color}-400 bg-${color}-50 dark:bg-${color}-900/20`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className="flex items-center text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{change}</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
    </div>
);

const StockBar = ({ label, value, color }: any) => (
    <div>
        <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
            <span className={`font-semibold ${value < 20 ? 'text-red-500' : 'text-primary'}`}>{value}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const colors: any = {
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };
    const labels: any = {
        completed: 'Tamamlandı',
        pending: 'Bekliyor',
        processing: 'İşlemde'
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
            <span className={`size-1.5 rounded-full mr-1.5 ${status === 'completed' ? 'bg-green-500' : status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
            {labels[status]}
        </span>
    );
};