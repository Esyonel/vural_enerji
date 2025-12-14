import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { Category } from '../../types';

export const Categories: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useData();
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        // Only auto-generate slug if creating new or if user hasn't manually edited slug logic (simplification: always sync for now)
        setSlug(generateSlug(val));
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setName(category.name);
        setSlug(category.slug);
        setError('');
    };

    const handleCancel = () => {
        setEditingId(null);
        setName('');
        setSlug('');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !slug) return;

        // Validation: Check for duplicate slugs
        const duplicate = categories.find(c => c.slug === slug && c.id !== editingId);
        if (duplicate) {
            setError('Bu kısa kod (slug) zaten kullanılıyor. Lütfen farklı bir isim deneyin.');
            return;
        }

        if (editingId) {
            await updateCategory(editingId, { name, slug });
            setEditingId(null);
        } else {
            await addCategory({ name, slug });
        }
        
        setName('');
        setSlug('');
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kategori Yönetimi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Ürünler için yeni kategori ekleyin veya mevcutları düzenleyin.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add/Edit Category Form */}
                <div className="lg:col-span-1">
                    <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm sticky top-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            {editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori Adı</label>
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={handleNameChange}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 focus:ring-primary focus:border-primary"
                                    placeholder="Örn: Güneş Paneli"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kısa Kod (Slug)</label>
                                <input 
                                    type="text" 
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-gray-100 dark:bg-black/40 text-slate-500 cursor-not-allowed"
                                    placeholder="gunes-paneli"
                                    readOnly
                                />
                                <p className="text-xs text-slate-500 mt-1">Sistem tarafından otomatik oluşturulur.</p>
                            </div>
                            
                            {error && (
                                <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2">
                                {editingId && (
                                    <button 
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-lg transition-colors"
                                    >
                                        İptal
                                    </button>
                                )}
                                <button 
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20"
                                >
                                    {editingId ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2">
                    <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kategori Adı</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kısa Kod</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {categories.map((category) => (
                                    <tr key={category.id} className={`transition-colors ${editingId === category.id ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(category)}
                                                    className="text-slate-400 hover:text-primary p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(window.confirm(`${category.name} kategorisini silmek istediğinize emin misiniz?`)) {
                                                            deleteCategory(category.id);
                                                        }
                                                    }}
                                                    className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            Henüz kategori eklenmemiş.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};