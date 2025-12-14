
import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataProvider';
import { Feature, NewsItem, Partner } from '../../types';

export const ContentEditor: React.FC = () => {
    const { siteContent, updateSiteContent, isLoading } = useData();
    const [formData, setFormData] = useState(siteContent);
    const [isSaving, setIsSaving] = useState(false);
    const [newHeroImage, setNewHeroImage] = useState('');

    // News States
    const [newNews, setNewNews] = useState<Partial<NewsItem>>({ title: '', summary: '', category: 'general', sourceName: '', sourceUrl: '' });

    // Partner States
    const [newPartner, setNewPartner] = useState<Partial<Partner>>({ name: '', logoUrl: '', siteUrl: '#' });

    // Sync state when data is loaded from provider
    useEffect(() => {
        if (siteContent) {
            setFormData(siteContent);
        }
    }, [siteContent]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
        const updatedFeatures = [...(formData.features || [])];
        if (updatedFeatures[index]) {
            updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
            setFormData({ ...formData, features: updatedFeatures });
        }
    };

    const handleSocialChange = (index: number, value: string) => {
        const updatedSocials = [...(formData.socialLinks || [])];
        if (updatedSocials[index]) {
            updatedSocials[index] = { ...updatedSocials[index], url: value };
            setFormData({ ...formData, socialLinks: updatedSocials });
        }
    };

    // Hero Image Management
    const addHeroImage = () => {
        if (newHeroImage.trim()) {
            setFormData({
                ...formData,
                heroImages: [...(formData.heroImages || []), newHeroImage.trim()]
            });
            setNewHeroImage('');
        }
    };

    const removeHeroImage = (index: number) => {
        const updatedImages = formData.heroImages.filter((_, i) => i !== index);
        setFormData({ ...formData, heroImages: updatedImages });
    };

    // News Management
    const addNews = () => {
        if (newNews.title && newNews.summary) {
            const item: NewsItem = {
                id: Math.random().toString(36).substr(2, 9),
                title: newNews.title!,
                summary: newNews.summary!,
                content: newNews.summary!, // Default content as summary
                category: (newNews.category as any) || 'general',
                date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                sourceName: newNews.sourceName,
                sourceUrl: newNews.sourceUrl
            };
            setFormData({ ...formData, news: [item, ...(formData.news || [])] });
            setNewNews({ title: '', summary: '', category: 'general', sourceName: '', sourceUrl: '' });
        }
    };

    const removeNews = (id: string) => {
        setFormData({ ...formData, news: formData.news.filter(n => n.id !== id) });
    };

    // Partner Management
    const addPartner = () => {
        if (newPartner.name && newPartner.logoUrl) {
            const item: Partner = {
                id: Math.random().toString(36).substr(2, 9),
                name: newPartner.name,
                logoUrl: newPartner.logoUrl,
                siteUrl: newPartner.siteUrl || '#'
            };
            setFormData({ ...formData, partners: [...(formData.partners || []), item] });
            setNewPartner({ name: '', logoUrl: '', siteUrl: '#' });
        }
    };

    const removePartner = (id: string) => {
        setFormData({ ...formData, partners: formData.partners.filter(p => p.id !== id) });
    };

    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setFeedback(null);
        try {
            await updateSiteContent(formData);
            setFeedback({ type: 'success', message: 'Değişiklikler başarıyla kaydedildi!' });
            setTimeout(() => setFeedback(null), 3000);
        } catch (error) {
            console.error("Save failed:", error);
            setFeedback({ type: 'error', message: 'Kaydetme sırasında bir hata oluştu.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center text-slate-500">İçerik yükleniyor...</div>;
    }

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10 py-4 border-b border-gray-200 dark:border-gray-800 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">İçerik Yönetimi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Ana sayfa metinlerini, haberleri ve partnerleri düzenleyin.</p>
                </div>
                <div className="flex items-center gap-4">
                    {feedback && (
                        <div className={`text-sm font-bold px-3 py-1 rounded-full animate-fade-in ${feedback.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'
                            }`}>
                            {feedback.message}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-black rounded-lg px-5 h-11 transition-colors shadow-sm font-bold disabled:opacity-50 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined">save</span>
                        <span>{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detailed Pages Content */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">article</span>
                        Kurumsal Sayfalar (Hakkımızda, Vizyon & Misyon)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hakkımızda Yazısı</label>
                            <textarea name="aboutText" value={formData.aboutText || ''} onChange={handleChange} rows={5} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vizyon Yazısı</label>
                            <textarea name="visionText" value={formData.visionText || ''} onChange={handleChange} rows={5} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Misyon Yazısı</label>
                            <textarea name="missionText" value={formData.missionText || ''} onChange={handleChange} rows={5} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">view_carousel</span>
                        Ana Banner (Slider)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Başlık</label>
                            <input type="text" name="heroTitle" value={formData.heroTitle || ''} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alt Başlık</label>
                            <textarea name="heroSubtitle" value={formData.heroSubtitle || ''} onChange={handleChange} rows={3} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Buton Metni</label>
                            <input type="text" name="heroButtonText" value={formData.heroButtonText || ''} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Banner Resimleri</label>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                                {formData.heroImages?.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <img src={img} alt="Banner" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeHeroImage(idx)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newHeroImage}
                                    onChange={(e) => setNewHeroImage(e.target.value)}
                                    placeholder="Yeni resim URL'si yapıştırın..."
                                    className="flex-1 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                                />
                                <button
                                    onClick={addHeroImage}
                                    className="px-3 bg-slate-200 dark:bg-slate-700 hover:bg-primary hover:text-black dark:hover:text-black transition-colors rounded-lg"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Management */}
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">newspaper</span>
                        Haber Bülteni (Sektörel Gelişmeler)
                    </h3>

                    <div className="space-y-4 mb-6">
                        <h4 className="text-sm font-bold text-slate-500 uppercase">Yeni Haber Ekle</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <input
                                type="text"
                                placeholder="Haber Başlığı"
                                value={newNews.title}
                                onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                            />
                            <textarea
                                placeholder="Haber Özeti (Kısa)"
                                value={newNews.summary}
                                onChange={e => setNewNews({ ...newNews, summary: e.target.value })}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                                rows={2}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Kaynak Adı (örn: Enerji Bakanlığı)"
                                    value={newNews.sourceName}
                                    onChange={e => setNewNews({ ...newNews, sourceName: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Kaynak URL (örn: https://...)"
                                    value={newNews.sourceUrl}
                                    onChange={e => setNewNews({ ...newNews, sourceUrl: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={newNews.category}
                                    onChange={e => setNewNews({ ...newNews, category: e.target.value as any })}
                                    className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                                >
                                    <option value="general">Genel</option>
                                    <option value="solar">Güneş Enerjisi</option>
                                    <option value="wind">Rüzgar Enerjisi</option>
                                </select>
                                <button
                                    onClick={addNews}
                                    className="flex-1 bg-primary text-black font-bold rounded-lg text-sm hover:bg-green-500"
                                >
                                    Yayınla
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {formData.news?.map(item => (
                            <div key={item.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-black/10 flex justify-between items-start gap-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.category === 'solar' ? 'bg-orange-100 text-orange-800' :
                                            item.category === 'wind' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>{item.category}</span>
                                        <span className="text-xs text-slate-500">{item.date}</span>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-1">{item.summary}</p>
                                    {item.sourceName && <p className="text-[10px] text-primary mt-1">Kaynak: {item.sourceName}</p>}
                                </div>
                                <button onClick={() => removeNews(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partners Management */}
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">handshake</span>
                        Partnerlerimiz
                    </h3>

                    <div className="space-y-4 mb-6">
                        <h4 className="text-sm font-bold text-slate-500 uppercase">Yeni Partner Ekle</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Partner Adı"
                                value={newPartner.name}
                                onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                                className="col-span-2 w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Logo URL"
                                value={newPartner.logoUrl}
                                onChange={e => setNewPartner({ ...newPartner, logoUrl: e.target.value })}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Site URL"
                                value={newPartner.siteUrl}
                                onChange={e => setNewPartner({ ...newPartner, siteUrl: e.target.value })}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 text-sm"
                            />
                            <button
                                onClick={addPartner}
                                className="col-span-2 bg-primary text-black font-bold rounded-lg text-sm hover:bg-green-500 py-2"
                            >
                                Ekle
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {formData.partners?.map(partner => (
                            <div key={partner.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-black/10 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <img src={partner.logoUrl} alt={partner.name} className="h-8 w-8 object-contain rounded bg-white" />
                                    <span className="text-sm font-medium truncate dark:text-white">{partner.name}</span>
                                </div>
                                <button onClick={() => removePartner(partner.id)} className="text-red-500 hover:bg-red-50 p-1 rounded shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action (CTA) */}
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">call_to_action</span>
                        Alt Bilgi Kartı (CTA)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kart Başlığı</label>
                            <input type="text" name="ctaTitle" value={formData.ctaTitle || ''} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kart Metni</label>
                            <textarea name="ctaText" value={formData.ctaText || ''} onChange={handleChange} rows={3} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Buton Metni</label>
                                <input type="text" name="ctaButtonText" value={formData.ctaButtonText || ''} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Görsel URL</label>
                                <input type="text" name="ctaImageUrl" value={formData.ctaImageUrl || ''} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media & Contact */}
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">share</span>
                        İletişim & Sosyal Medya
                    </h3>
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adres</label>
                            <input type="text" name="contactAddress" value={formData.contactAddress || ''} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                                <input type="text" name="contactPhone" value={formData.contactPhone || ''} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input type="text" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        {formData.socialLinks?.map((social, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{social.platform}</label>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">{social.icon}</span>
                                    <input
                                        type="text"
                                        value={social.url}
                                        onChange={(e) => handleSocialChange(index, e.target.value)}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features (Full Width) */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">star</span>
                        Öne Çıkan Özellikler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {formData.features?.map((feature, index) => (
                            <div key={feature.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-black/10">
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">İkon (Material Symbol)</label>
                                    <input
                                        type="text"
                                        value={feature.icon}
                                        onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                                        className="w-full text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Başlık</label>
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        className="w-full text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 font-bold"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Açıklama</label>
                                    <textarea
                                        rows={3}
                                        value={feature.text}
                                        onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                                        className="w-full text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Renk</label>
                                    <select
                                        value={feature.color}
                                        onChange={(e) => handleFeatureChange(index, 'color', e.target.value as any)}
                                        className="w-full text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                    >
                                        <option value="green">Yeşil</option>
                                        <option value="orange">Turuncu</option>
                                        <option value="blue">Mavi</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
