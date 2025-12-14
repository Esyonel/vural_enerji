
import React, { useState, useRef } from 'react';
import { useData } from '../../services/dataProvider';
import { Product } from '../../types';
import { compressImage } from '../../utils/mediaUtils';

export const Products: React.FC = () => {
    const { products, categories, deleteProduct, addProduct, updateProduct, mediaItems, addMediaItem } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const multipleFileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Media Selector State
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
    const [mediaSelectorTarget, setMediaSelectorTarget] = useState<'main' | 'gallery'>('main');
    const [mediaFilter, setMediaFilter] = useState<string>('all');
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

    // Initial form state
    const initialFormState: Omit<Product, 'id'> = {
        name: '',
        sku: '',
        category: categories.length > 0 ? categories[0].slug : 'solar',
        price: 0,
        stock: 0,
        status: 'active',
        stockStatus: 'outstock', // Default, but calculated automatically
        imageUrl: '',
        images: [],
        videoUrl: '',
        specs: [],
        detailedSpecs: '',
        isNew: false
    };

    const [formData, setFormData] = useState<Omit<Product, 'id'>>(initialFormState);

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            // Destructure to remove ID for form data compatibility
            const { id, ...rest } = product;
            setFormData(rest);
        } else {
            setEditingProduct(null);
            setFormData({
                ...initialFormState,
                category: categories.length > 0 ? categories[0].slug : ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    // Handle specs array input via textarea (split by newline)
    const handleSpecsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const specsArray = e.target.value.split('\n').filter(line => line.trim() !== '');
        setFormData({ ...formData, specs: specsArray });
    };

    // Handle standard text updates
    const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const imagesArray = e.target.value.split('\n').filter(line => line.trim() !== '');
        setFormData({ ...formData, images: imagesArray });
    };

    // Handle Main Image Upload
    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const compressedUrl = await compressImage(file);
            setFormData(prev => ({ ...prev, imageUrl: compressedUrl }));

            // Auto-save to Media Library
            await addMediaItem({
                url: compressedUrl,
                name: file.name,
                type: 'image',
                category: formData.category
            });
        } catch (error) {
            console.error("Image upload failed", error);
            alert("Resim yüklenirken hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    // Handle Gallery Upload (Multiple)
    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(file => compressImage(file));
            const newImageUrls = await Promise.all(uploadPromises);

            // Append new images to existing list
            const existingImages = formData.images || [];
            setFormData(prev => ({ ...prev, images: [...existingImages, ...newImageUrls] }));

            // Auto-save to Media Library
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = newImageUrls[i]; // corresponding url
                await addMediaItem({
                    url: url,
                    name: file.name,
                    type: 'image',
                    category: formData.category
                });
            }
        } catch (error) {
            console.error("Gallery upload failed", error);
            alert("Galeri resimleri yüklenirken hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    // Rich Text Editor Helpers
    const insertFormatting = (tag: string, endTag?: string) => {
        if (!textAreaRef.current) return;

        const start = textAreaRef.current.selectionStart;
        const end = textAreaRef.current.selectionEnd;
        const text = formData.detailedSpecs || '';
        const selection = text.substring(start, end);

        let newText;
        if (endTag) {
            // Wrap selection (e.g., <b>text</b>)
            newText = text.substring(0, start) + tag + selection + endTag + text.substring(end);
        } else {
            // Insert at cursor (e.g., <br/>)
            newText = text.substring(0, start) + tag + text.substring(end);
        }

        setFormData({ ...formData, detailedSpecs: newText });

        // Restore focus is a bit tricky with React state updates re-rendering, 
        // but for a simple tool, user usually keeps typing.
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        // Note: stockStatus is calculated automatically in dataProvider based on stock quantity
        if (editingProduct) {
            await updateProduct(editingProduct.id, formData);
        } else {
            await addProduct(formData);
        }
        handleCloseModal();
    };

    // Helper to get category name from slug
    const getCategoryName = (slug: string) => {
        return categories.find(c => c.slug === slug)?.name || slug;
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ürün Yönetimi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Tüm ürünlerinizi buradan yönetin.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-black rounded-lg px-5 h-11 transition-colors shadow-sm font-bold"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span>Yeni Ürün Ekle</span>
                </button>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ürün Adı</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stok Seviyesi</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 bg-center bg-cover border border-slate-200 dark:border-slate-700" style={{ backgroundImage: `url('${product.imageUrl}')` }}></div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{product.name}</span>
                                                <span className="text-xs text-slate-500">{product.sku}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                                            {getCategoryName(product.category)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StockLevelBar stock={product.stock} status={product.stockStatus} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={product.stockStatus} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button onClick={() => deleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Sil">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleCloseModal}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ürün Adı</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU (Stok Kodu)</label>
                                    <input required type="text" name="sku" value={formData.sku} onChange={handleFormChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                                    <select name="category" value={formData.category} onChange={handleFormChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20">
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fiyat (TL)</label>
                                    <input required type="number" name="price" value={formData.price} onChange={handleFormChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stok Adedi</label>
                                    <input required type="number" name="stock" value={formData.stock} onChange={handleFormChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                    <p className="text-xs text-slate-500 mt-1">Stok durumu adede göre otomatik güncellenir.</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Görsel URL</label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-lg text-sm font-bold text-slate-700 dark:text-gray-200 transition-colors flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">upload</span>
                                                Bilgisayardan Seç
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMediaSelectorTarget('main');
                                                    setMediaFilter(formData.category || 'all');
                                                    setSelectedMedia([]);
                                                    setIsMediaSelectorOpen(true);
                                                }}
                                                className="px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-lg text-sm font-bold text-slate-700 dark:text-gray-200 transition-colors flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">perm_media</span>
                                                Galeriden Seç
                                            </button>
                                            <span className="text-xs text-slate-400">veya URL:</span>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} className="flex-1 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" placeholder="https://..." />
                                            {formData.imageUrl && (
                                                <div className="size-10 rounded-lg bg-cover bg-center border border-slate-300 dark:border-slate-600 flex-shrink-0" style={{ backgroundImage: `url('${formData.imageUrl}')` }}></div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleMainImageUpload}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Video URL (Youtube/Vimeo)
                                    </label>
                                    <input
                                        type="text"
                                        name="videoUrl"
                                        value={formData.videoUrl || ''}
                                        onChange={handleFormChange}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Ek Ürün Görselleri
                                    </label>

                                    <div className="flex gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => multipleFileInputRef.current?.click()}
                                            className="flex-1 h-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors">add_photo_alternate</span>
                                            <span className="text-sm text-slate-500 font-medium">Bilgisayardan Yükle</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMediaSelectorTarget('gallery');
                                                setSelectedMedia([]);
                                                setIsMediaSelectorOpen(true);
                                            }}
                                            className="flex-1 h-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors">perm_media</span>
                                            <span className="text-sm text-slate-500 font-medium">Galeriden Seç</span>
                                        </button>
                                        <input
                                            type="file"
                                            ref={multipleFileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryUpload}
                                        />
                                    </div>

                                    {/* Preview Gallery Images (List View) */}
                                    {formData.images && formData.images.length > 0 && (
                                        <div className="flex flex-col gap-3 mb-4">
                                            {formData.images.map((url, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-slate-700 group animate-fade-in-up">
                                                    <div className="h-20 w-28 rounded-lg bg-cover bg-center shrink-0 border border-slate-300 dark:border-slate-600 transition-transform group-hover:scale-105" style={{ backgroundImage: `url('${url}')` }}></div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-bold text-slate-500">Görsel #{idx + 1}</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={url}
                                                            onChange={(e) => {
                                                                const newImages = [...(formData.images || [])];
                                                                newImages[idx] = e.target.value;
                                                                setFormData({ ...formData, images: newImages });
                                                            }}
                                                            className="w-full text-sm bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-primary transition-all"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = [...(formData.images || [])];
                                                            newImages.splice(idx, 1);
                                                            setFormData({ ...formData, images: newImages });
                                                        }}
                                                        className="size-10 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors shrink-0"
                                                        title="Görseli Kaldır"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="text-xs text-slate-500 mb-1">veya URL listesi olarak düzenle:</div>
                                    <textarea
                                        name="imagesInput"
                                        value={formData.images?.join('\n') || ''}
                                        onChange={handleImagesChange}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 font-mono text-xs opacity-60 hover:opacity-100 transition-opacity"
                                        rows={3}
                                        placeholder="https://..."
                                    ></textarea>
                                    <p className="text-xs mt-1 text-slate-500">
                                        Şu an {formData.images?.length || 0} görsel eklendi.
                                    </p>
                                </div>

                                <div className="col-span-2 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                                    <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">list</span>
                                        Teknik Özellikler (Liste)
                                    </label>
                                    <p className="text-xs text-slate-500 mb-2">Her satıra bir özellik yazınız. (Örn: 25 Yıl Garanti, %21 Verimlilik)</p>
                                    <textarea
                                        name="specsInput"
                                        value={formData.specs?.join('\n') || ''}
                                        onChange={handleSpecsChange}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 font-mono text-sm"
                                        rows={4}
                                        placeholder="Özellik 1&#10;Özellik 2&#10;Özellik 3"
                                    ></textarea>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                        Detaylı Ürün Açıklaması (HTML Editör)
                                    </label>
                                    <p className="text-xs text-slate-500 mb-2">Metin biçimlendirme araçlarını kullanarak detaylı açıklama ekleyebilirsiniz.</p>

                                    {/* Rich Text Toolbar */}
                                    <div className="flex flex-wrap items-center gap-1 mb-2 p-2 bg-slate-100 dark:bg-black/30 rounded-t-lg border border-slate-300 dark:border-slate-700 border-b-0">
                                        <button type="button" onClick={() => insertFormatting('<b>', '</b>')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-slate-700 dark:text-slate-300 font-bold" title="Kalın">B</button>
                                        <button type="button" onClick={() => insertFormatting('<i>', '</i>')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-slate-700 dark:text-slate-300 italic" title="İtalik">I</button>
                                        <button type="button" onClick={() => insertFormatting('<u>', '</u>')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-slate-700 dark:text-slate-300 underline" title="Altı Çizili">U</button>
                                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                        <button type="button" onClick={() => insertFormatting('<h3>', '</h3>')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-slate-700 dark:text-slate-300 font-bold text-sm" title="Başlık">H3</button>
                                        <button type="button" onClick={() => insertFormatting('<p>', '</p>')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-slate-700 dark:text-slate-300 text-sm" title="Paragraf">P</button>
                                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                        <button type="button" onClick={() => insertFormatting('<ul><li>', '</li></ul>')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-slate-700 dark:text-slate-300" title="Liste">
                                            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                                        </button>
                                        <button type="button" onClick={() => insertFormatting('<li>', '</li>')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-slate-700 dark:text-slate-300 flex items-center gap-1 text-xs" title="Liste Öğesi">
                                            <span className="material-symbols-outlined text-[14px]">add</span> Madde
                                        </button>
                                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                        <button type="button" onClick={() => insertFormatting('<br/>')} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded text-slate-700 dark:text-slate-300 text-xs font-bold" title="Satır Başı">BR</button>
                                    </div>

                                    <textarea
                                        ref={textAreaRef}
                                        name="detailedSpecs"
                                        value={formData.detailedSpecs || ''}
                                        onChange={handleFormChange}
                                        className="w-full rounded-b-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 font-mono text-sm min-h-[200px]"
                                        placeholder="Ürün açıklaması..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                                    İptal
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary hover:bg-green-600 text-black font-bold transition-colors shadow-lg shadow-primary/20">
                                    {editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Media Selector Modal */}
            {isMediaSelectorOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsMediaSelectorOpen(false)}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {mediaSelectorTarget === 'main' ? 'Ana Görsel Seç' : 'Galeriye Görsel Ekle'}
                                </h3>
                                <p className="text-xs text-slate-500">Medyayı seçmek için üzerine tıklayın.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (selectedMedia.length === 0) return;

                                        if (mediaSelectorTarget === 'main') {
                                            // Select first one (should be only one)
                                            const item = mediaItems.find(m => m.id === selectedMedia[0]);
                                            if (item) setFormData({ ...formData, imageUrl: item.url });
                                        } else {
                                            // Append all
                                            const urls = selectedMedia.map(id => mediaItems.find(m => m.id === id)?.url).filter(Boolean) as string[];
                                            const existing = formData.images || [];
                                            setFormData({ ...formData, images: [...existing, ...urls] });
                                        }
                                        setIsMediaSelectorOpen(false);
                                    }}
                                    disabled={selectedMedia.length === 0}
                                    className="px-4 py-2 bg-primary text-black rounded-lg font-bold text-sm disabled:opacity-50"
                                >
                                    Seçilenleri Ekle ({selectedMedia.length})
                                </button>
                                <button onClick={() => setIsMediaSelectorOpen(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-black/10">
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {mediaItems.filter(m => m.type === 'image').map(item => {
                                    const isSelected = selectedMedia.includes(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                if (mediaSelectorTarget === 'main') {
                                                    // Single selection
                                                    setSelectedMedia([item.id]);
                                                } else {
                                                    // Multiple selection
                                                    if (isSelected) {
                                                        setSelectedMedia(prev => prev.filter(id => id !== item.id));
                                                    } else {
                                                        setSelectedMedia(prev => [...prev, item.id]);
                                                    }
                                                }
                                            }}
                                            className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer relative group transition-all ${isSelected ? 'border-primary ring-4 ring-primary/20 scale-95' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                        >
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-1 shadow-md">
                                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-[10px] truncate block">{item.name}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {mediaItems.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                                    <span className="material-symbols-outlined text-5xl mb-2">image_not_supported</span>
                                    <p>Medya Kütüphanesi boş.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StockLevelBar = ({ stock, status }: { stock: number, status: string }) => {
    // Assuming 50 is a "full" reference point for visual representation, clamping to 100%
    const percentage = Math.min(100, Math.max(5, (stock / 50) * 100));

    let barColor = 'bg-green-500';
    if (status === 'outstock') barColor = 'bg-red-500';
    else if (status === 'lowstock') barColor = 'bg-yellow-500';

    return (
        <div className="flex flex-col gap-1.5 w-32">
            <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">{stock} Adet</span>
                <span className={`text-[10px] font-bold ${status === 'outstock' ? 'text-red-500' : status === 'lowstock' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {Math.round(percentage)}%
                </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${barColor} transition-all duration-500 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const config: any = {
        instock: { color: 'green', label: 'Stokta Var' },
        lowstock: { color: 'yellow', label: 'Kritik Stok' },
        outstock: { color: 'red', label: 'Stok Yok' }
    };
    const { label } = config[status] || config.instock;

    // Tailwind dynamic classes need full names usually, mapping strictly:
    const classes = status === 'instock'
        ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        : status === 'lowstock'
            ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
            : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';

    const dotColor = status === 'instock' ? 'bg-green-600' : status === 'lowstock' ? 'bg-yellow-600' : 'bg-red-600';

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${classes}`}>
            <span className={`size-1.5 rounded-full ${dotColor}`}></span>
            {label}
        </span>
    );
};
