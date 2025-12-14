
import { Product, Order, SiteContent, Customer, Project, QuoteRequest, Category, BlogPost, JobApplication, NewsItem, Comment } from '../types';

export const initialCategories: Category[] = [
    { id: '1', name: 'Güneş Panelleri', slug: 'solar' },
    { id: '2', name: 'İnvertörler', slug: 'inverter' },
    { id: '3', name: 'Batarya Sistemleri', slug: 'battery' },
    { id: '4', name: 'Kablolar', slug: 'cable' },
    { id: '5', name: 'Elektronik', slug: 'electronics' },
    { id: '6', name: 'Diğer', slug: 'other' }
];

export const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Monokristal Solar Panel 450W',
        sku: 'SP-450-MK',
        category: 'solar',
        price: 4250,
        stock: 45,
        status: 'active',
        stockStatus: 'instock',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=3264&auto=format&fit=crop',
        specs: ['20.8% Verim', 'Half-Cut'],
        isNew: true
    },
    // ... existing products (kept concise for update)
    {
        id: '2',
        name: '340W Polikristal Panel',
        sku: 'SP-340-PK',
        category: 'solar',
        price: 3100,
        stock: 120,
        status: 'active',
        stockStatus: 'instock',
        imageUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=3258&auto=format&fit=crop',
        specs: ['72 Hücre', 'Dayanıklı']
    },
    {
        id: '3',
        name: 'Hibrit İnvertör 5kW',
        sku: 'INV-5KW-HB',
        category: 'inverter',
        price: 12500,
        stock: 12,
        status: 'active',
        stockStatus: 'lowstock',
        imageUrl: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?q=80&w=2940&auto=format&fit=crop',
        specs: ['Akıllı MPPT', '48V']
    }
];

export const initialOrders: Order[] = [
    { id: '#ORD-001', customer: 'Ahmet Yılmaz', product: 'Solar Panel X-200', date: '12 Eki 2023', status: 'completed', amount: 12500 },
    { id: '#ORD-002', customer: 'EnerjiSA Ltd.', product: 'Endüstriyel İnvertör', date: '11 Eki 2023', status: 'pending', amount: 45000 },
];

export const initialQuotes: QuoteRequest[] = [
    {
        id: 'qt-101',
        customerName: 'Kemal Sunal',
        companyName: 'Gülümseten Tarım A.Ş.',
        email: 'kemal@tarim.com',
        phone: '0532 111 22 33',
        productName: 'Monokristal Solar Panel 450W',
        productSku: 'SP-450-MK',
        message: 'Merhaba, arazimizde kullanmak üzere 50 adet panel için fiyat teklifi rica ediyorum. Kargo dahil fiyat alabilir miyim?',
        date: '2024-05-20',
        status: 'new'
    }
];

export const initialCustomers: Customer[] = [
    { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@gmail.com', password: 'user', phone: '+90 555 123 4567', role: 'user', status: 'active', joinDate: '2023-10-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet' },
    { id: '2', name: 'Zeynep Kaya', email: 'admin@vuralenerji.com', password: 'admin', phone: '+90 544 333 4455', role: 'admin', status: 'active', joinDate: '2023-01-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep' },
    { id: '3', name: 'Esyonel', email: 'esyonel@gmail.com', password: '45184518', phone: '+90 555 555 5555', role: 'admin', status: 'active', joinDate: '2024-05-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Esyonel' },
];

export const initialProjects: Project[] = [
    {
        id: '1',
        title: 'Akdeniz Meyve Fabrikası',
        location: 'Antalya',
        capacity: '2.5 MW',
        date: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1566093097221-ac56396c48e0?q=80&w=2070&auto=format&fit=crop',
        description: 'Endüstriyel çatı üzeri güneş enerjisi santrali projesi ile tesisin enerji ihtiyacının %85\'i karşılanmaktadır.'
    },
    {
        id: '2',
        title: 'Yeşil Vadi Konutları',
        location: 'İzmir',
        capacity: '450 kW',
        date: '2024',
        imageUrl: 'https://images.unsplash.com/photo-1625305266405-b772c7221652?q=80&w=2070&auto=format&fit=crop',
        description: 'Site ortak alan aydınlatmaları ve havuz sistemleri için hibrit sistem kurulumu.'
    }
];

const comments: Comment[] = [
    { id: 'c1', postId: '1', userId: '1', userName: 'Ahmet Yılmaz', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet', content: 'Çok faydalı bir yazı olmuş, teşekkürler. Panellerin ömrü hakkında da bilgi verir misiniz?', date: '16 Mayıs 2024', status: 'approved' },
    { id: 'c2', postId: '1', userId: '99', userName: 'Mehmet Demir', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet', content: 'Güneş enerjisi gerçekten geleceğimiz.', date: '17 Mayıs 2024', status: 'approved' }
];

export const initialBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Güneş Enerjisi ile Tasarruf Etmenin 5 Yolu',
        excerpt: 'Evinizde veya iş yerinizde güneş enerjisi kullanarak faturalarınızı nasıl düşürebileceğinizi keşfedin.',
        content: 'Güneş enerjisi, günümüzde en popüler yenilenebilir enerji kaynaklarından biridir. Panellerin verimliliği arttıkça ve maliyetler düştükçe, daha fazla ev sahibi ve işletme bu teknolojiye yönelmektedir. İşte tasarruf etmenin 5 yolu: \n\n1. Doğru Konumlandırma: Panellerin güneşi en dik açıyla aldığı konuma yerleştirilmesi verimi %20 artırabilir.\n2. Kaliteli İnvertör Seçimi: Enerji dönüşüm kaybını en aza indirmek için hibrit invertörler tercih edilmelidir.\n3. Batarya Depolama: Gündüz üretilen enerjiyi gece kullanmak için depolama sistemleri kritik öneme sahiptir.\n4. Periyodik Bakım: Panellerin temizliği, enerji üretimini doğrudan etkiler.\n5. Akıllı Tüketim: Enerji yoğun cihazları güneşin tepede olduğu saatlerde çalıştırmak şebekeden çekilen enerjiyi sıfırlar.',
        author: 'Dr. Enerji',
        date: '2024-05-15',
        imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2944&auto=format&fit=crop',
        slug: 'gunes-enerjisi-tasarruf-yollari',
        category: 'Solar Enerji',
        tags: ['Tasarruf', 'Teknoloji', 'Güneş'],
        likes: 24,
        comments: comments
    },
    {
        id: '2',
        title: 'İnvertör Seçerken Nelere Dikkat Edilmeli?',
        excerpt: 'Solar sisteminizin kalbi olan invertörleri doğru seçmek, sistem ömrünü ve verimini doğrudan etkiler.',
        content: 'İnvertörler, güneş panellerinden gelen doğru akımı (DC), evlerimizde kullandığımız alternatif akıma (AC) çeviren cihazlardır. Doğru invertör seçimi, sistemin güvenliği ve verimliliği için hayati öneme sahiptir. \n\nÖncelikle sisteminizin on-grid (şebeke bağlantılı) mi yoksa off-grid (akülü) mi olacağına karar vermelisiniz. Hibrit invertörler her iki durumu da destekleyerek esneklik sağlar.',
        author: 'Teknik Ekip',
        date: '2024-04-20',
        imageUrl: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?q=80&w=2940&auto=format&fit=crop',
        slug: 'invertor-secimi-rehberi',
        category: 'Teknik Rehber',
        tags: ['İnvertör', 'Mühendislik'],
        likes: 15,
        comments: []
    }
];

export const initialJobApplications: JobApplication[] = [
    {
        id: 'job-1',
        fullName: 'Caner Erkin',
        email: 'caner@test.com',
        phone: '0555 999 88 77',
        position: 'Saha Mühendisi',
        coverLetter: 'Yenilenebilir enerji sektöründe 5 yıllık tecrübem var. Projelerinizde yer almak istiyorum.',
        linkedinUrl: 'linkedin.com/in/caner',
        date: '2024-05-21',
        status: 'new'
    }
];

export const initialSiteContent: SiteContent = {
    heroTitle: 'Temiz Enerji, Parlak Yarınlar',
    heroSubtitle: 'Vural Enerji ile kendi elektriğinizi üretin, doğayı koruyun ve enerji maliyetlerinizi sıfırlayın. Modern teknoloji ile doğanın gücünü birleştiriyoruz.',
    heroButtonText: 'Projelerimizi İncele',
    heroImages: [
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=3264&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=3174&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=3270&auto=format&fit=crop'
    ],

    aboutText: 'Vural Enerji, 2010 yılında yenilenebilir enerji sektöründe faaliyet göstermek üzere kurulmuştur. Kurulduğumuz günden bu yana, sürdürülebilir bir gelecek için çalışıyor, müşterilerimize en verimli ve çevre dostu enerji çözümlerini sunuyoruz. Türkiye genelinde 500+ başarılı projeye imza atmanın gururunu yaşıyoruz.',
    visionText: 'Türkiye\'nin ve bölgenin lider yenilenebilir enerji çözüm ortağı olmak ve temiz enerjiye geçişi herkes için erişilebilir kılmak.',
    missionText: 'Yüksek kaliteli mühendislik hizmetleri ve son teknoloji ürünlerle, müşterilerimizin enerji bağımsızlığını kazanmalarını sağlamak ve karbon ayak izini azaltarak dünyaya katkıda bulunmak.',

    newsTitle: 'Enerji Dünyasından Haberler',
    news: [
        {
            id: 'n1',
            title: '2024 Güneş Enerjisi Teşvikleri Açıklandı',
            summary: 'Devlet destekli hibe programı ile tarımsal sulama ve çatı GES projelerinde %50 hibe desteği başladı.',
            content: 'Resmi Gazete\'de yayınlanan yeni yönetmeliğe göre, 2024 yılı içerisinde yapılacak olan lisanssız güneş enerjisi yatırımlarına %50 hibe desteği verilecek. Özellikle tarımsal sulama alanında faaliyet gösteren çiftçilerimiz için büyük bir fırsat sunan bu paket...',
            date: '10 Mayıs 2024',
            category: 'solar',
            sourceName: 'Enerji Bakanlığı',
            sourceUrl: 'https://enerji.gov.tr'
        },
        {
            id: 'n2',
            title: 'Rüzgar Enerjisinde Yeni Dönem',
            summary: 'Yerli türbin üretimi kapasitesi artırılıyor. Lisanssız elektrik üretimi yönetmeliğinde önemli değişiklikler yapıldı.',
            content: 'Türkiye\'nin rüzgar enerjisi potansiyelini daha verimli kullanmak adına yerli türbin üreticilerine sağlanan vergi indirimleri artırıldı.',
            date: '22 Nisan 2024',
            category: 'wind',
            sourceName: 'EPDK',
            sourceUrl: 'https://epdk.gov.tr'
        },
        // ... more news items
    ] as NewsItem[],

    contactAddress: 'Teknoloji Cad. Yeşil Plaza No:12/4, Maslak, İstanbul',
    contactPhone: '+90 (212) 555 0123',
    contactEmail: 'info@vuralenerji.com',

    features: [
        {
            id: 'f1',
            icon: 'eco',
            title: 'Çevre Dostu Teknoloji',
            text: 'Karbon ayak izinizi azaltan, %100 geri dönüştürülebilir malzemelerle üretilmiş sistemler.',
            color: 'green'
        },
        {
            id: 'f2',
            icon: 'engineering',
            title: 'Uzman Mühendislik',
            text: 'Her proje için özel simülasyonlar yaparak en verimli konumu ve açıyı belirliyoruz.',
            color: 'orange'
        },
        {
            id: 'f3',
            icon: 'support_agent',
            title: 'Kesintisiz Destek',
            text: 'Kurulum sonrası 7/24 teknik destek ve periyodik bakım hizmeti ile yanınızdayız.',
            color: 'blue'
        }
    ],

    ctaTitle: 'Teknoloji ile Doğayı Buluşturuyoruz',
    ctaText: 'Mobil uygulamamız üzerinden üretiminizi anlık takip edebilir, sistem verimliliğini optimize edebilirsiniz.',
    ctaImageUrl: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=2574&auto=format&fit=crop',
    ctaButtonText: 'Teknolojimizi Keşfedin',

    partners: [
        { id: 'p1', name: 'Partner 1', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png', siteUrl: '#' },
        { id: 'p2', name: 'Partner 2', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png', siteUrl: '#' },
        { id: 'p3', name: 'Partner 3', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png', siteUrl: '#' },
        { id: 'p4', name: 'Partner 4', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png', siteUrl: '#' },
    ],

    socialLinks: [
        { platform: 'facebook', url: '#', icon: 'public' },
        { platform: 'twitter', url: '#', icon: 'alternate_email' },
        { platform: 'instagram', url: '#', icon: 'photo_camera' },
        { platform: 'linkedin', url: '#', icon: 'share' }
    ]
};
