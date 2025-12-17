import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataProvider';
import { SolarPackage, PackageProduct, Product } from '../../types';

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
            </div>

            {/* Package List */}
            {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            {pkg.imageUrl && (
                                <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                            )}
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${pkg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
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
                    ))}
                </div>
            )}

            {/* Editor Form - Will continue in next part */}
        </div>
    );
};
