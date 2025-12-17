import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SEO } from '../SEO';

import { SolarPackage } from '../../types';

export default function SolarPackageDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState<SolarPackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                console.log('Fetching package with ID:', id);
                const response = await fetch(`/api/solar-packages/${id}`);
                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Package not found (${response.status})`);
                }

                const data = await response.json();
                console.log('Package data:', data);
                setPkg(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching package:', error);
                setError(error instanceof Error ? error.message : 'Failed to load package');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPackage();
        } else {
            setLoading(false);
            setError('No package ID provided');
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error || !pkg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
                <div className="text-center max-w-md">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Paket Bulunamadı</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'İstediğiniz paket bulunamadı.'}</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
            <SEO
                title={`${pkg.name} - Solar Paket Detayı | Vural Enerji`}
                description={pkg.description || `${pkg.name} solar enerji paketi detayları. ${pkg.systemPower} sistem gücü.`}
                keywords={`${pkg.name}, solar paket, güneş enerjisi, ${pkg.systemPower}`}
            />

            {/* Header */}
            <div className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors mb-4">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Ana Sayfaya Dön
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                        {pkg.name}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Image & Quick Info */}
                    <div>
                        {pkg.imageUrl && (
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
                                <img
                                    src={pkg.imageUrl}
                                    alt={pkg.name}
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold uppercase shadow-lg">
                                        Popüler
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-orange-500 text-3xl">bolt</span>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Sistem Gücü</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{pkg.systemPower}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-orange-500 text-3xl">solar_power</span>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Panel Sayısı</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{pkg.panelCount || 0} Adet</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-orange-500 text-3xl">savings</span>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Yıllık Tasarruf</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{pkg.savings ? pkg.savings.toLocaleString('tr-TR') : 0} ₺</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-orange-500 text-3xl">schedule</span>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Geri Ödeme</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{pkg.paybackPeriod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div>
                        {/* Description */}
                        {pkg.description && (
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 mb-6">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-500">description</span>
                                    Açıklama
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {pkg.description}
                                </p>
                            </div>
                        )}

                        {/* Bill Range */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 mb-6">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">receipt_long</span>
                                Fatura Aralığı
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                <span className="font-bold text-orange-500">{pkg.minBill?.toLocaleString('tr-TR')} ₺</span>
                                {' - '}
                                <span className="font-bold text-orange-500">{pkg.maxBill?.toLocaleString('tr-TR')} ₺</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Bu paket, aylık elektrik faturası bu aralıkta olan işletmeler için uygundur.
                            </p>
                        </div>

                        {/* Package Contents */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 mb-6">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">inventory_2</span>
                                Paket İçeriği
                            </h2>
                            <div className="space-y-3">
                                {pkg.products && pkg.products.map((product, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-orange-500 text-2xl">check_circle</span>
                                            <p className="text-base font-medium text-slate-900 dark:text-white">
                                                {product.productName}
                                            </p>
                                        </div>
                                        <span className="text-lg font-bold text-orange-500">
                                            {product.quantity} Adet
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                            to="/"
                            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 hover:-translate-y-1"
                        >
                            <span className="material-symbols-outlined text-2xl">request_quote</span>
                            Fiyat Teklifi İste
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
