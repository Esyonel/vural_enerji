import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataProvider';
import { SolarPackage, PackageProduct } from '../../types';

export const SolarPackages: React.FC = () => {
    const { products, mediaItems } = useData();
    const [packages, setPackages] = useState<SolarPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Partial<SolarPackage> | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<PackageProduct[]>([]);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/solar-packages');
            const data = await res.json();
            setPackages(data);
        } catch (e) {
            console.error('Failed to fetch packages:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (pkg: SolarPackage) => {
        const res = await fetch(`http://localhost:3001/api/solar-packages/${pkg.id}`);
        const data = await res.json();
        setEditingPackage(data);
        setSelectedProducts(data.products || []);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu paketi silmek istediğinizden emin misiniz?')) return;

        try {
            await fetch(`http://localhost:3001/api/solar-packages/${id}`, { method: 'DELETE' });
            fetchPackages();
        } catch (e) {
            console.error('Failed to delete package:', e);
        }
    };

    const handleSave = async () => {
        if (!editingPackage) return;

        const packageData = {
            ...editingPackage,
            products: selectedProducts
        };

        try {
            const url = editingPackage.id
                ? `http://localhost:3001/api/solar-packages/${editingPackage.id}`
                : 'http://localhost:3001/api/solar-packages';

            const method = editingPackage.id ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packageData)
            });

            setIsEditing(false);
            setEditingPackage(null);
            setSelectedProducts([]);
            fetchPackages();
        } catch (e) {
            console.error('Failed to save package:', e);
        }
    };

    const addProduct = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        setSelectedProducts([...selectedProducts, {
            productId,
            productName: product.name,
            quantity: 1,
            unitPrice: product.price
        }]);
    };

    const removeProduct = (index: number) => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, quantity: number) => {
        const updated = [...selectedProducts];
        updated[index].quantity = quantity;
        setSelectedProducts(updated);
    };

    const calculateTotalPrice = () => {
        return selectedProducts.reduce((sum, p) => sum + (p.unitPrice || 0) * p.quantity, 0);
    };

    if (isLoading) {
        return <div className="p-10 text-center">Yükleniyor...</div>;
    }

    return (
        <div className="flex flex-col gap-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center sticky top-0 bg-background-light dark:bg-background-dark z-10 py-4 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Solar Paketler</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Elektrik faturasına göre özel paketler oluşturun</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setEditingPackage({
                                name: '',
                                description: '',
                                minBill: 0,
                                maxBill: 0,
                                systemPower: '',
                                totalPrice: 0,
                                status: 'active',
                                createdDate: new Date().toISOString().split('T')[0]
                            });
                            setSelectedProducts([]);
                            setIsEditing(true);
                        }}
                        className="flex items-center gap-2 bg-primary hover:bg-green-600 text-black rounded-lg px-5 h-11 transition-colors shadow-sm font-bold"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span>Yeni Paket Oluştur</span>
                    </button>
                )}
            </div>

            {/* Package List */}
            {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">solar_power</span>
                            <p>Henüz paket oluşturulmamış.</p>
                            <p className="text-sm mt-2">Yeni paket oluşturmak için yukarıdaki butonu kullanın.</p>
                        </div>
                    ) : (
                        packages.map(pkg => (
                            <div key={pkg.id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                {pkg.imageUrl && (
                                    <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                                )}
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${pkg.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700'}`}>
                                        {pkg.status === 'active' ? 'Aktif' : 'Pasif'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{pkg.description}</p>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Fatura Aralığı:</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{pkg.minBill} - {pkg.maxBill} TL</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Sistem Gücü:</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{pkg.systemPower}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Toplam Fiyat:</span>
                                        <span className="font-bold text-primary">{pkg.totalPrice.toLocaleString('tr-TR')} TL</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(pkg)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pkg.id)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Editor Form */}
            {isEditing && editingPackage && (
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {editingPackage.id ? 'Paket Düzenle' : 'Yeni Paket Oluştur'}
                        </h3>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditingPackage(null);
                                setSelectedProducts([]);
                            }}
                            className="text-slate-500 hover:text-red-500"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paket Adı *</label>
                                <input
                                    type="text"
                                    value={editingPackage.name || ''}
                                    onChange={e => setEditingPackage({ ...editingPackage, name: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    placeholder="örn: Ev Tipi 1000 TL Fatura Paketi"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Açıklama</label>
                                <textarea
                                    value={editingPackage.description || ''}
                                    onChange={e => setEditingPackage({ ...editingPackage, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    placeholder="Paket hakkında kısa açıklama..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Fatura (TL) *</label>
                                    <input
                                        type="number"
                                        value={editingPackage.minBill || ''}
                                        onChange={e => setEditingPackage({ ...editingPackage, minBill: parseFloat(e.target.value) })}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Fatura (TL) *</label>
                                    <input
                                        type="number"
                                        value={editingPackage.maxBill || ''}
                                        onChange={e => setEditingPackage({ ...editingPackage, maxBill: parseFloat(e.target.value) })}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sistem Gücü *</label>
                                <input
                                    type="text"
                                    value={editingPackage.systemPower || ''}
                                    onChange={e => setEditingPackage({ ...editingPackage, systemPower: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    placeholder="örn: 5 kW"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Toplam Fiyat (TL) *</label>
                                    <input
                                        type="number"
                                        value={editingPackage.totalPrice || ''}
                                        onChange={e => setEditingPackage({ ...editingPackage, totalPrice: parseFloat(e.target.value) })}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Önerilen: {calculateTotalPrice().toLocaleString('tr-TR')} TL</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kurulum (TL)</label>
                                    <input
                                        type="number"
                                        value={editingPackage.installationCost || ''}
                                        onChange={e => setEditingPackage({ ...editingPackage, installationCost: parseFloat(e.target.value) })}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yıllık Tasarruf</label>
                                    <input
                                        type="text"
                                        value={editingPackage.savings || ''}
                                        onChange={e => setEditingPackage({ ...editingPackage, savings: e.target.value })}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                        placeholder="örn: ~12.000 TL"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Geri Ödeme Süresi</label>
                                    <input
                                        type="text"
                                        value={editingPackage.paybackPeriod || ''}
                                        onChange={e => setEditingPackage({ ...editingPackage, paybackPeriod: e.target.value })}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                        placeholder="örn: ~8 yıl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Görsel</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={editingPackage.imageUrl || ''}
                                        onChange={e => setEditingPackage({ ...editingPackage, imageUrl: e.target.value })}
                                        className="flex-1 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                        placeholder="Görsel URL'si"
                                    />
                                    <button
                                        onClick={() => setIsMediaPickerOpen(true)}
                                        className="px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                    >
                                        <span className="material-symbols-outlined">photo_library</span>
                                    </button>
                                </div>
                                {editingPackage.imageUrl && (
                                    <img src={editingPackage.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Durum</label>
                                <select
                                    value={editingPackage.status || 'active'}
                                    onChange={e => setEditingPackage({ ...editingPackage, status: e.target.value as 'active' | 'inactive' })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column - Products */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Paket İçeriği (Ürünler)</label>
                                <select
                                    onChange={e => {
                                        if (e.target.value) {
                                            addProduct(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 mb-3"
                                >
                                    <option value="">Ürün Ekle...</option>
                                    {products.filter(p => !selectedProducts.find(sp => sp.productId === p.id)).map(p => (
                                        <option key={p.id} value={p.id}>{p.name} - {p.price.toLocaleString('tr-TR')} TL</option>
                                    ))}
                                </select>

                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {selectedProducts.map((sp, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-black/20 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-slate-900 dark:text-white">{sp.productName}</p>
                                                <p className="text-xs text-slate-500">{(sp.unitPrice || 0).toLocaleString('tr-TR')} TL</p>
                                            </div>
                                            <input
                                                type="number"
                                                min="1"
                                                value={sp.quantity}
                                                onChange={e => updateQuantity(idx, parseInt(e.target.value))}
                                                className="w-16 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                                            />
                                            <button
                                                onClick={() => removeProduct(idx)}
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {selectedProducts.length > 0 && (
                                    <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span>Ürünler Toplamı:</span>
                                            <span className="text-primary">{calculateTotalPrice().toLocaleString('tr-TR')} TL</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditingPackage(null);
                                setSelectedProducts([]);
                            }}
                            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2 bg-primary text-black rounded-lg font-bold hover:bg-green-600 transition-colors"
                        >
                            Kaydet
                        </button>
                    </div>
                </div>
            )}

            {/* Media Picker Modal */}
            {isMediaPickerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsMediaPickerOpen(false)}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Medya Kütüphanesinden Seç</h3>
                            <button onClick={() => setIsMediaPickerOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {mediaItems.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <span className="material-symbols-outlined text-6xl mb-4 opacity-30">photo_library</span>
                                    <p>Medya kütüphanenizde henüz resim yok.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {mediaItems.filter(item => item.type === 'image').map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setEditingPackage({ ...editingPackage, imageUrl: item.url });
                                                setIsMediaPickerOpen(false);
                                            }}
                                            className="relative group aspect-video rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary hover:scale-105 transition-all"
                                        >
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
