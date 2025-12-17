import React from 'react';
import { useData } from '../../services/dataProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const Dashboard: React.FC = () => {
    const { products, orders, isLoading } = useData();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-40 w-full bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

    // Mock data for charts
    const trafficData = [
        { name: 'Oca', visits: 4000 },
        { name: 'Şub', visits: 3000 },
        { name: 'Mar', visits: 2000 },
        { name: 'Nis', visits: 2780 },
        { name: 'May', visits: 1890 },
        { name: 'Haz', visits: 2390 },
        { name: 'Tem', visits: 3490 },
    ];

    const stockData = [
        { name: 'Paneller', stock: 85, fill: '#13ec37' },
        { name: 'İnvertörler', stock: 45, fill: '#ff8800' },
        { name: 'Bataryalar', stock: 12, fill: '#ef4444' },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Genel Bakış</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Sistem durumunu ve performans raporlarını görüntüleyin.</p>
                </div>
                {/* Search removed for brevity/cleanup */}
            </div>

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white min-h-[160px] flex flex-col justify-center" style={{ backgroundImage: 'linear-gradient(90deg, rgba(16, 34, 23, 0.95) 0%, rgba(13, 242, 108, 0.1) 100%)' }}>
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
                <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Site Trafiği Analizi</h3>
                            <p className="text-xs text-slate-500 mt-1">Son 6 aylık ziyaretçi verileri</p>
                        </div>
                    </div>
                    {/* Recharts Area Chart */}
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#13ec37" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#13ec37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#13ec37' }}
                                />
                                <Area type="monotone" dataKey="visits" stroke="#13ec37" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stock Status with Bar Chart */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Stok Durumu</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stockData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }} />
                                <Bar dataKey="stock" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <button className="w-full mt-4 py-2 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                        Detaylı Rapor
                    </button>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
    <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors">
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