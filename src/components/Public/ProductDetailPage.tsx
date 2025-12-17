
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../services/dataProvider';
import { Product } from '../../types';
import { ProductCard } from './Home';
import { QuoteRequestModal } from './QuoteRequestModal';
import { SEO } from '../SEO';

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products } = useData();
    const [product, setProduct] = useState<Product | null>(null);
    const [quoteProduct, setQuoteProduct] = useState<Product | null>(null); // For the modal

    // Media Logic State (Moved up to fix Hook Rule)
    const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);

    // Scroll to top when ID changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (products.length > 0 && id) {
            const found = products.find(p => p.id === id);
            if (found) {
                setProduct(found);
            } else {
                navigate('/'); // Redirect if not found
            }
        }
    }, [id, products, navigate]);

    // Effect to reset active media when product changes (Moved up)
    useEffect(() => {
        if (product) {
            setActiveMedia({ type: 'image', url: product.imageUrl });
        }
    }, [product]);

    if (!product) return null;

    // Navigation Logic
    const currentIndex = products.findIndex(p => p.id === product.id);
    const prevProduct = products[currentIndex - 1] || products[products.length - 1];
    const nextProduct = products[currentIndex + 1] || products[0];

    // Similar Products Logic (Same category, exclude current)
    const similarProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const statusColor =
        product.stockStatus === 'instock' ? 'bg-green-500' :
            product.stockStatus === 'lowstock' ? 'bg-yellow-500' : 'bg-red-500';

    const statusText =
        product.stockStatus === 'instock' ? 'Stokta Var' :
            product.stockStatus === 'lowstock' ? 'Kritik Stok' : 'Tükendi';



    const mediaList = [
        { type: 'image', url: product.imageUrl },
        ...(product.images || []).map(url => ({ type: 'image', url })),
        ...(product.videoUrl ? [{ type: 'video', url: product.videoUrl }] : [])
    ];

    const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('vimeo.com')) {
            const videoId = url.split('/').pop();
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return url; // Fallback or direct mp4
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20 pt-10">
            <SEO
                title={product.name}
                description={product.detailedSpecs ? product.detailedSpecs.substring(0, 160) : `${product.name} - En uygun fiyat ve Vural Enerji güvencesiyle hemen inceleyin.`}
                image={product.imageUrl}
                type="product"
                schema={{
                    "@context": "https://schema.org/",
                    "@type": "Product",
                    "name": product.name,
                    "image": product.imageUrl,
                    "description": product.detailedSpecs || product.name,
                    "sku": product.sku,
                    "offers": {
                        "@type": "Offer",
                        "url": window.location.href,
                        "priceCurrency": "TRY",
                        "price": product.price,
                        "availability": product.stockStatus === 'instock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                        "seller": {
                            "@type": "Organization",
                            "name": "Vural Enerji"
                        }
                    }
                }}
            />
            <div className="max-w-[1400px] mx-auto">

                {/* Top Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Ürünlere Dön
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            to={`/product/${prevProduct.id}`}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                            Önceki Ürün
                        </Link>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                        <Link
                            to={`/product/${nextProduct.id}`}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            Sonraki Ürün
                            <span className="material-symbols-outlined">chevron_right</span>
                        </Link>
                    </div>
                </div>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    {/* Media Gallery */}
                    {/* Media Gallery (Vertical Thumbs on Desktop) */}
                    {/* Media Gallery (Vertical Thumbs on Desktop) */}
                    {/* Media Gallery Structure */}
                    <div className="flex flex-col-reverse lg:flex-row gap-4 align-start">

                        {/* Thumbnails Column */}
                        {mediaList.length > 1 && (
                            <div className="shrink-0 lg:w-20 w-full">
                                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide py-1">
                                    {mediaList.map((media, idx) => (
                                        <button
                                            key={idx}
                                            onMouseEnter={() => setActiveMedia(media as any)}
                                            onClick={() => setActiveMedia(media as any)}
                                            className={`
                                                relative shrink-0 
                                                size-16 lg:w-full lg:h-20 
                                                rounded-xl overflow-hidden border-2 transition-all 
                                                ${activeMedia?.url === media.url
                                                    ? 'border-primary ring-2 ring-primary/20 scale-105 z-10'
                                                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            {media.type === 'video' ? (
                                                <div className="w-full h-full bg-black flex items-center justify-center group">
                                                    <span className="material-symbols-outlined text-white text-3xl group-hover:scale-110 transition-transform">play_circle</span>
                                                </div>
                                            ) : (
                                                <img src={media.url} alt={`View ${idx}`} className="w-full h-full object-cover" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Main Image Display */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white dark:bg-surface-dark rounded-3xl p-2 border border-gray-100 dark:border-white/5 shadow-lg overflow-hidden">
                                <div className="aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 dark:bg-black/20 relative group">
                                    {activeMedia?.type === 'video' ? (
                                        <iframe
                                            src={getEmbedUrl(activeMedia.url)}
                                            title="Product Video"
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <img src={activeMedia?.url || product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                    )}
                                    {product.isNew && <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg pointer-events-none">Yeni</div>}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-2 flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                {product.category}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">{product.sku}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black font-display text-slate-900 dark:text-white mb-6 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                <span className={`size-2.5 rounded-full ${statusColor} animate-pulse`}></span>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{statusText}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Stok: <span className="font-bold text-slate-900 dark:text-white">{product.stock} Adet</span>
                            </div>
                        </div>

                        {/* Price Replacement: Quote Request Section */}
                        <div className="mb-8 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-2xl">sell</span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Fiyat Teklifi Alın</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                                Bu ürün için güncel fiyat bilgisi ve projenize özel iskontolar için lütfen bizimle iletişime geçin. Uzman ekibimiz size en uygun çözümü sunmak için hazır.
                            </p>
                            <button
                                onClick={() => setQuoteProduct(product)}
                                disabled={product.stockStatus === 'outstock'}
                                className={`w-full h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-xl hover:-translate-y-1 ${product.stockStatus === 'outstock'
                                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary text-black hover:bg-[#0fd630] shadow-primary/30'
                                    }`}
                            >
                                {product.stockStatus === 'outstock' ? (
                                    <span>Stokta Yok</span>
                                ) : (
                                    <>
                                        <span>Hemen Fiyat Teklifi Al</span>
                                        <span className="material-symbols-outlined text-[24px]">request_quote</span>
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">security</span>
                                Güvenli ve hızlı teklif süreci. 24 saat içinde dönüş.
                            </p>
                        </div>

                        <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            {product.detailedSpecs ? (
                                <div dangerouslySetInnerHTML={{ __html: product.detailedSpecs }} />
                            ) : (
                                <p className="text-gray-500 italic p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                                    {product.name} hakkında teknik detaylar ve proje bazlı uyumluluk bilgisi için satış ekibimizle görüşebilirsiniz.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Specs Tab / Section */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/5 mb-20">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                        Ürün Özellikleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {product.specs && product.specs.length > 0 ? (
                            product.specs.map((spec, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-black/20">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    <span className="font-medium text-slate-700 dark:text-gray-300">{spec}</span>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <span className="material-symbols-outlined text-3xl mb-2 opacity-50">description</span>
                                <p>Teknik özellikler proje gereksinimlerine göre yapılandırılmaktadır.</p>
                            </div>
                        )}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-black/20">
                            <span className="material-symbols-outlined text-primary">category</span>
                            <span className="font-medium text-slate-700 dark:text-gray-300">Kategori: {product.category}</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-black/20">
                            <span className="material-symbols-outlined text-primary">qr_code</span>
                            <span className="font-medium text-slate-700 dark:text-gray-300">SKU: {product.sku}</span>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="w-1 h-8 bg-primary rounded-full"></span>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Benzer Ürünler</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                            {similarProducts.map(p => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onRequestQuote={(prod) => setQuoteProduct(prod)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {quoteProduct && <QuoteRequestModal product={quoteProduct} onClose={() => setQuoteProduct(null)} />}
        </div>
    );
};
