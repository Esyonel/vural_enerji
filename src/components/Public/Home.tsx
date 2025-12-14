import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../services/dataProvider';
import { SEO } from '../SEO';
import { Product } from '../../types';

export const Home: React.FC = () => {
    const { products, siteContent, categories, addQuote } = useData();
    const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
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

    return (
        <div className="-mt-24">
            <SEO
                title="Vural Enerji - Yenilenebilir Enerji Çözümleri"
                description="Güneş enerjisi sistemleri, çatı GES projeleri ve yenilenebilir enerji mühendislik hizmetleri. Profesyonel çözümlerle enerji maliyetlerinizi düşürün."
                keywords="güneş enerjisi, solar panel, ges, yenilenebilir enerji, inverter, güneş paneli fiyatları"
            />


            <div className="relative w-full h-[850px] overflow-hidden bg-black group -mt-24">
                {/* Slider Images */}
                {siteContent.heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out transform ${index === currentHeroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                        style={{ backgroundImage: `url("${img}")` }}
                    ></div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
                <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-20 pt-20">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-md border border-primary/40 text-primary text-sm font-bold uppercase tracking-widest mb-8">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                            Sürdürülebilir Gelecek
                        </div>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8 drop-shadow-lg">
                            {siteContent.heroTitle.split(',').map((part, i) => (
                                <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 block" : "block"}>
                                    {part}{i === 0 && ','}
                                </span>
                            ))}
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl lg:text-2xl font-normal leading-relaxed mb-12 max-w-2xl opacity-90">
                            {siteContent.heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link to="/projects" className="h-14 px-10 rounded-xl bg-primary text-black hover:bg-[#0fd630] transition-all transform hover:-translate-y-1 font-bold text-lg shadow-[0_0_30px_rgba(19,236,55,0.4)] flex items-center justify-center gap-3">
                                {siteContent.heroButtonText}
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

            {/* Products Grid */}
            <div id="products" className="py-12 px-4 sm:px-6 lg:px-8">
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
                                <button className="bg-primary hover:bg-green-500 text-black px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 w-fit shadow-[0_0_20px_rgba(19,236,55,0.4)]">
                                    {siteContent.ctaButtonText}
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
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

            <footer className="bg-white dark:bg-[#0c180e] border-t border-gray-200 dark:border-white/5 pt-16 pb-8 mt-auto">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <img
                                    src="/logo.png"
                                    alt="Vural Enerji Logo"
                                    className="h-10 w-auto object-contain rounded-full"
                                />
                                <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">Vural Enerji</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">
                                {siteContent.aboutText}
                            </p>
                            <div className="flex gap-4">
                                {siteContent.socialLinks.map((social, i) => (
                                    <SocialLink key={i} icon={social.icon} url={social.url} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Kurumsal</h4>
                            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                                <li><Link to="/about" className="hover:text-primary transition-colors block">Hakkımızda</Link></li>
                                <li><Link to="/vision-mission" className="hover:text-primary transition-colors block">Vizyon & Misyon</Link></li>
                                <li><Link to="/career" className="hover:text-primary transition-colors block">Kariyer</Link></li>
                                <li><Link to="/blog" className="hover:text-primary transition-colors block">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-6">İletişim</h4>
                            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                                    <span>{siteContent.contactAddress}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">phone_in_talk</span>
                                    <span className="font-semibold text-slate-900 dark:text-gray-200">{siteContent.contactPhone}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">mail</span>
                                    <span>{siteContent.contactEmail}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">© 2024 Vural Enerji. Tüm hakları saklıdır.</p>
                        <div className="flex gap-6 text-sm text-gray-500">
                            <a className="hover:text-primary transition-colors">Gizlilik Politikası</a>
                            <a className="hover:text-primary transition-colors">Kullanım Şartları</a>
                            <a className="hover:text-primary transition-colors">Çerez Politikası</a>
                        </div>
                    </div>
                </div>
            </footer>

            {quoteProduct && <QuoteRequestModal product={quoteProduct} onClose={() => setQuoteProduct(null)} />}
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
                {product.specs?.map((spec: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] font-bold">{spec}</span>
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

const SocialLink: React.FC<{ icon: string, url: string }> = ({ icon, url }) => (
    <a href={url} className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black transition-all cursor-pointer">
        <span className="material-symbols-outlined">{icon}</span>
    </a>
);

export const QuoteRequestModal: React.FC<{ product: Product, onClose: () => void }> = ({ product, onClose }) => {
    const { addQuote } = useData();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        phone: '',
        email: '',
        message: `Merhaba, ${product.name} (SKU: ${product.sku}) ürünü için fiyat teklifi almak istiyorum.`,
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        await addQuote({
            customerName: formData.name,
            companyName: formData.company,
            phone: formData.phone,
            email: formData.email,
            message: formData.message,
            notes: formData.notes,
            productName: product.name,
            productSku: product.sku
        });

        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-[#1a2e22] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/10 p-8 text-center animate-fade-in-up">
                    <div className="size-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-5xl">check_circle</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Talebiniz Alındı!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Fiyat teklifi isteğiniz başarıyla tarafımıza ulaştı. Satış ekibimiz en kısa sürede sizinle iletişime geçecektir.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full h-12 bg-primary hover:bg-green-600 text-black font-bold rounded-xl transition-colors shadow-lg"
                    >
                        Tamam
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-[#1a2e22] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-primary/10 border-b border-primary/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">request_quote</span>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fiyat Teklifi Al</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Ürün: {product.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-8 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="size-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${product.imageUrl}')` }}></div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{product.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{product.sku}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ad Soyad <span className="text-red-500">*</span></label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Firma Adı</label>
                                <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full h-11 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Telefon <span className="text-red-500">*</span></label>
                                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full h-11 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-posta <span className="text-red-500">*</span></label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full h-11 px-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mesajınız</label>
                                <textarea rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full p-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"></textarea>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ek Notlar (Opsiyonel)</label>
                                <textarea rows={2} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full p-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" placeholder="Varsa eklemek istediğiniz teknik detaylar veya özel notlar..."></textarea>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-12 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="flex-[2] h-12 bg-primary hover:bg-green-600 text-black font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <span className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        <span>Teklif İste</span>
                                        <span className="material-symbols-outlined text-[20px]">send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
