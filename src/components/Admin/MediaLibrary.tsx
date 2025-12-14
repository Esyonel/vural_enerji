import React, { useRef, useState } from 'react';
import { useData } from '../../services/dataProvider';
import { compressImage } from '../../utils/mediaUtils';

export const MediaLibrary: React.FC = () => {
    const { mediaItems, addMediaItem, deleteMediaItem, categories } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [uploadCategory, setUploadCategory] = useState<string>('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            // Process sequentially to be safe with storage
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const compressedUrl = await compressImage(file, 800, 0.7);
                    await addMediaItem({
                        url: compressedUrl,
                        name: file.name,
                        type: 'image',
                        category: uploadCategory || undefined
                    });
                }
            }
        } catch (error) {
            console.error("Upload error", error);
            alert("Yükleme sırasında hata oluştu. Depolama alanı dolmuş olabilir.");
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const filteredItems = mediaItems.filter(item => {
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesType && matchesCategory;
    });

    const getCategoryName = (slug?: string) => {
        if (!slug) return '';
        return categories.find(c => c.slug === slug)?.name || slug;
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        // Show toast? simple alert for now
        alert("Bağlantı kopyalandı!");
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Medya Kütüphanesi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Görsellerinizi yönetin ve ürünlere ekleyin.</p>
                </div>
                <div className="flex gap-3 items-center">
                    {/* Filters */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm py-2"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm py-2"
                    >
                        <option value="all">Tüm Türler</option>
                        <option value="image">Görseller</option>
                        <option value="video">Videolar</option>
                    </select>

                    <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                    {/* Upload Controls */}
                    <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="rounded-lg border-primary/50 text-primary dark:bg-black/20 text-sm py-2 font-medium"
                    >
                        <option value="">Kategorisiz Yükle</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.slug}>{cat.name} için</option>
                        ))}
                    </select>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-black rounded-lg px-5 h-10 transition-colors shadow-sm font-bold disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">upload</span>
                        <span>{isUploading ? 'Yükleniyor...' : 'Yeni Yükle'}</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <div key={item.id} className="group relative aspect-square bg-slate-100 dark:bg-black/20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            {item.type === 'image' && (
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            )}

                            {/* Tags */}
                            {item.category && (
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                                    {getCategoryName(item.category)}
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                <span className="text-white text-xs truncate w-full text-center px-1">{item.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(item.url)}
                                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white"
                                        title="Bağlantıyı Kopyala"
                                    >
                                        <span className="material-symbols-outlined text-sm">link</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
                                                deleteMediaItem(item.id);
                                            }
                                        }}
                                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white"
                                        title="Sil"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                        <p>Henüz medya yüklenmemiş.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
