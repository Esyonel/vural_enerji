import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../services/dataProvider';
import { SEO } from '../SEO';
import { Product } from '../../types';
import { QuoteRequestModal } from './QuoteRequestModal';
import { SolarCalculator } from './SolarCalculator';


export const Home: React.FC = () => {
    const { products, siteContent, categories, addQuote, projects } = useData();
    const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
    const [isSolarCalculatorOpen, setIsSolarCalculatorOpen] = useState(false);
    const [solarPackages, setSolarPackages] = useState<any[]>([]);

    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const navigate = useNavigate();

    // Product Rotation Logic
    const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Filter products based on category first
        const filtered = selectedCategory === 'all'
            ? products
            : products.filter(p => p.category === selectedCategory);

        // Initial slice
        setDisplayProducts(filtered.slice(0, 12));

        // Only rotate if 'all' is selected to show variety, otherwise static list is better for specific category
        if (selectedCategory === 'all' && products.length > 12) {
            const interval = setInterval(() => {
                const shuffled = [...products].sort(() => 0.5 - Math.random());
                setDisplayProducts(shuffled.slice(0, 12));
            }, 5000); // Rotate every 5 seconds
            return () => clearInterval(interval);
        } else {
            setDisplayProducts(filtered.slice(0, 12));
        }
    }, [products, selectedCategory]);


    useEffect(() => {
        if (!siteContent.heroImages || siteContent.heroImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentHeroIndex(prev => (prev + 1) % siteContent.heroImages.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [siteContent.heroImages]);

    // Fetch Solar Packages with Products
    useEffect(() => {
        const fetchSolarPackages = async () => {
            try {
                const res = await fetch('/api/solar-packages?status=active');
                const packages = await res.json();

                // Fetch products for each package
                const packagesWithProducts = await Promise.all(
                    packages.map(async (pkg: any) => {
                        try {
                            const detailRes = await fetch(`/api/solar-packages/${pkg.id}`);
                            const detail = await detailRes.json();
                            return detail;
                        } catch (e) {
                            console.error(`Failed to fetch details for package ${pkg.id}:`, e);
                            return pkg;
                        }
                    })
                );

                setSolarPackages(packagesWithProducts);
            } catch (e) {
                console.error('Failed to fetch solar packages:', e);
            }
        };
        fetchSolarPackages();
    }, []);

    return (
        <div className="-mt-24">
            <SEO
                title="Vural Enerji - Yenilenebilir Enerji Çözümleri"
                description="Güneş enerjisi sistemleri, çatı GES projeleri ve yenilenebilir enerji mühendislik hizmetleri. Profesyonel çözümlerle enerji maliyetlerinizi düşürün."
                keywords="güneş enerjisi, solar panel, ges, yenilenebilir enerji, inverter, güneş paneli fiyatları"
            />


            <div className="relative w-full h-[425px] overflow-hidden bg-black group -mt-24">
                {/* Slider Images */}
                {siteContent.heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out transform ${index === currentHeroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                        style={{ backgroundImage: `url("${img}")`, backgroundPosition: 'center 40%' }}
                    ></div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
                <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-20 pt-20">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 backdrop-blur-md border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                            Sürdürülebilir Gelecek
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight mb-4 drop-shadow-lg">
                            {siteContent.heroTitle.split(',').map((part, i) => (
                                <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 block" : "block"}>
                                    {part}{i === 0 && ','}
                                </span>
                            ))}
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg lg:text-xl font-normal leading-relaxed mb-6 max-w-2xl opacity-90">
                            {siteContent.heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/contact" className="h-12 px-8 rounded-xl bg-primary text-black hover:bg-[#0fd630] transition-all transform hover:-translate-y-1 font-bold text-base shadow-[0_0_30px_rgba(19,236,55,0.4)] flex items-center justify-center gap-2">
                                Ücretsiz Teklif Alın
                                <span className="material-symbols-outlined">arrow_outward</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Slider Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                    {siteContent.heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentHeroIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Solar Packages Badge - Always Visible */}
            <div className="-mt-8 py-6 px-4 sm:px-6 lg:px-8 relative z-50">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-orange-500 text-orange-500 text-xs font-bold uppercase tracking-wider shadow-lg">
                            <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                            Solar Paketler
                        </div>
                    </div>
                </div>
            </div>

            {/* Solar Packages Section */}
            {solarPackages.length > 0 && (
                <div className="py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-black/20 dark:to-background-dark border-b border-gray-200 dark:border-white/5">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {solarPackages.map((pkg) => (
                                <div key={pkg.id} className="group bg-white dark:bg-surface-dark rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
                                    {/* Package Image */}
                                    {pkg.imageUrl && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={pkg.imageUrl}
                                                alt={pkg.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute top-4 right-4">
                                                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                                                    Popüler
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Package Title */}
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
                                            {pkg.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                                            {pkg.description}
                                        </p>

                                        {/* Package Details */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                                    Fatura Aralığı
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {pkg.minBill} - {pkg.maxBill} TL
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                                                    Sistem Gücü
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {pkg.systemPower}
                                                </span>
                                            </div>
                                            {pkg.savings && (
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">savings</span>
                                                        Yıllık Tasarruf
                                                    </span>
                                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                                        {pkg.savings}
                                                    </span>
                                                </div>
                                            )}
                                            {pkg.paybackPeriod && (
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                                                        Geri Ödeme
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {pkg.paybackPeriod}
                                                    </span>
                                                </div>
                                            )}
                                        </div>


                                        {/* CTA Button - View Details */}
                                        <Link
                                            to={`/solar-package/${pkg.id}`}
                                            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-105 text-sm"
                                        >
                                            <span className="material-symbols-outlined text-lg">info</span>
                                            Detaylı İncele
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div id="products" className="py-3 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-10 justify-center">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${selectedCategory === 'all'
                                ? 'bg-primary text-black border-primary shadow-lg scale-105'
                                : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'
                                }`}
                        >
                            Tümü
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${selectedCategory === cat.slug
                                    ? 'bg-primary text-black border-primary shadow-lg scale-105'
                                    : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {displayProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                            {displayProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onRequestQuote={(p) => setQuoteProduct(p)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-12 text-center rounded-2xl animate-fade-in-up">
                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">inventory_2</span>
                            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">Bu kategoride ürün bulunamadı.</h3>
                            <p className="text-gray-500">Lütfen başka bir kategori seçin.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* News & Bulletin Section */}
            <div id="news" className="bg-gray-50 dark:bg-black/30 py-16 border-t border-gray-200 dark:border-white/5">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Sektörel Gelişmeler</span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-display">
                                {siteContent.newsTitle || 'Haber Bülteni'}
                            </h2>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="size-3 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold text-slate-500">CANLI YAYIN</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {siteContent.news?.slice(0, 10).map((item, index) => (
                            <div key={item.id} className="bg-white dark:bg-background-dark p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-lg transition-all hover:translate-x-1 group flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.category === 'solar' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                            item.category === 'wind' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                            {item.category === 'solar' ? 'Güneş Enerjisi' : item.category === 'wind' ? 'Rüzgar Enerjisi' : 'Genel'}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                                        {item.sourceName && (
                                            <span className="text-[10px] text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">Kaynak: {item.sourceName}</span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">
                                        {item.summary}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(`/news/${item.id}`)}
                                    className="shrink-0 flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 group-hover:bg-primary group-hover:text-black transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



            {/* Features (Services) */}
            <div id="services" className="bg-black text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black font-display mb-6">
                                Neden <span className="text-primary">Vural Enerji?</span>
                            </h2>
                            {siteContent.features.map((feature) => (
                                <FeatureCard
                                    key={feature.id}
                                    icon={feature.icon}
                                    title={feature.title}
                                    text={feature.text}
                                    color={feature.color}
                                />
                            ))}
                        </div>
                        <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${siteContent.ctaImageUrl}")` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-10">
                                <h3 className="text-3xl font-black text-white font-display mb-4">
                                    {siteContent.ctaTitle}
                                </h3>
                                <p className="text-gray-300 mb-8 text-lg">{siteContent.ctaText}</p>
                                <Link to="/contact" className="bg-primary hover:bg-green-500 text-black px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 w-fit shadow-[0_0_20px_rgba(19,236,55,0.4)]">
                                    Ücretsiz Teklif Alın
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partners Section */}
            {siteContent.partners && siteContent.partners.length > 0 && (
                <div className="py-16 bg-gray-50 dark:bg-background-dark/50 border-t border-gray-200 dark:border-white/5">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl font-bold text-slate-400 uppercase tracking-widest">Çözüm Ortaklarımız</h3>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-70 hover:opacity-100 transition-opacity">
                            {siteContent.partners.map(partner => (
                                <a
                                    key={partner.id}
                                    href={partner.siteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110"
                                >
                                    <img src={partner.logoUrl} alt={partner.name} className="h-12 md:h-16 w-auto object-contain" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {quoteProduct && <QuoteRequestModal product={quoteProduct} onClose={() => setQuoteProduct(null)} />}
            {isSolarCalculatorOpen && <SolarCalculator onClose={() => setIsSolarCalculatorOpen(false)} />}
        </div>
    );
};

export const ProductCard: React.FC<{ product: Product, onRequestQuote: (product: Product) => void }> = ({ product, onRequestQuote }) => {
    const statusColor =
        product.stockStatus === 'instock' ? 'bg-green-500' :
            product.stockStatus === 'lowstock' ? 'bg-yellow-500' : 'bg-red-500';

    const statusText =
        product.stockStatus === 'instock' ? 'Stokta Var' :
            product.stockStatus === 'lowstock' ? 'Kritik Stok' : 'Tükendi';

    return (
        <div className="glass-card p-6 rounded-2xl shadow-xl border-t-4 border-accent hover:border-primary transition-all duration-300 group hover:-translate-y-2 flex flex-col h-full animate-fade-in-up">
            <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-[4/3] rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6 relative overflow-hidden group-hover:shadow-inner transition-all">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                    {product.isNew && <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Yeni</div>}

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full">
                        <span className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`}></span>
                        <span>{statusText}</span>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 line-clamp-2">{product.sku}</p>
            </Link>
            <div className="flex flex-wrap gap-2 mb-6">
                {product.specs && typeof product.specs === 'object' && Object.entries(product.specs).map(([key, value], i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                        {key}: {value}
                    </span>
                ))}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                    onClick={() => onRequestQuote(product)}
                    disabled={product.stockStatus === 'outstock'}
                    className={`w-full h-11 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] ${product.stockStatus === 'outstock'
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-black hover:bg-[#0fd630] shadow-primary/20'
                        }`}
                >
                    {product.stockStatus === 'outstock' ? (
                        <span>Stokta Yok</span>
                    ) : (
                        <>
                            <span>Fiyat Teklifi İste</span>
                            <span className="material-symbols-outlined text-[20px]">request_quote</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, text, color }: any) => {
    const colors: any = {
        green: 'text-primary bg-green-100 dark:bg-green-900/30 group-hover:bg-primary group-hover:text-black',
        orange: 'text-accent bg-orange-100 dark:bg-orange-900/30 group-hover:bg-accent group-hover:text-white',
        blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-500 group-hover:text-white'
    };

    return (
        <div className="flex items-start gap-6 p-6 rounded-2xl bg-white/5 shadow-lg border border-white/10 hover:border-primary/50 transition-colors group">
            <div className={`flex-shrink-0 size-12 rounded-full flex items-center justify-center transition-colors ${colors[color]}`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div>
                <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
            </div>
        </div>
    );
};




