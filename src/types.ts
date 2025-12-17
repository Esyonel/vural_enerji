
export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'draft' | 'archived';
    stockStatus: 'instock' | 'lowstock' | 'outstock';
    imageUrl: string;
    specs?: string[];
    detailedSpecs?: string;
    isNew?: boolean;
    isPremium?: boolean;
    images?: string[];
}

export interface Project {
    id: string;
    title: string;
    location: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    capacity: string;
    date: string;
    imageUrl: string;
    description: string;
    stats?: {
        power: string;
        panels: string;
        area: string;
        co2: string;
    };
}

export interface Order {
    id: string;
    customer: string;
    product: string;
    date: string;
    status: 'completed' | 'pending' | 'processing';
    amount: number;
}

export interface QuoteRequest {
    id: string;
    customerName: string;
    companyName?: string;
    email: string;
    phone: string;
    productName: string;
    productSku: string;
    message: string;
    notes?: string;
    date: string;
    status: 'new' | 'offered' | 'accepted' | 'rejected';
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    password?: string; // In real app, this is never stored plain text on client
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
    joinDate: string;
    avatar?: string;
}

export interface Feature {
    id: string;
    icon: string;
    title: string;
    text: string;
    color: 'green' | 'orange' | 'blue';
}

export interface SocialLink {
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'whatsapp';
    url: string;
    icon: string;
}

export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    siteUrl: string;
}

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    content?: string; // Extended content for internal page
    date: string;
    category: 'solar' | 'wind' | 'general';
    sourceName?: string;
    sourceUrl?: string;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    date: string;
    status: 'approved' | 'pending' | 'spam';
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    imageUrl: string;
    slug: string;
    category: string;
    tags?: string[];
    likes: number;
    comments?: Comment[];
}

export interface JobApplication {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    coverLetter: string;
    linkedinUrl?: string;
    date: string;
    status: 'new' | 'reviewed' | 'interview' | 'rejected';
}

export interface SiteContent {
    heroTitle: string;
    heroSubtitle: string;
    heroButtonText: string;
    heroImages: string[];

    // Detailed Pages Content
    aboutText: string;
    visionText: string;
    missionText: string;

    newsTitle: string;
    news: NewsItem[];

    contactAddress: string;
    contactPhone: string;
    contactEmail: string;

    features: Feature[];

    ctaTitle: string;
    ctaText: string;
    ctaImageUrl: string;
    ctaButtonText: string;

    partners: Partner[];
    socialLinks: SocialLink[];
}

export interface MediaItem {
    id: string;
    url: string;
    name: string;
    type: 'image' | 'video';
    date: string;
}

export interface JobPosition {
    id: string;
    title: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid';
    description: string;
    requirements: string[];
    isActive: boolean;
    date: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    date: string;
    status: 'new' | 'read' | 'replied';
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    isAudio?: boolean;
    audioData?: string;
}

export interface PackageProduct {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice?: number;
}

export interface SolarPackage {
    id: string;
    name: string;
    description: string;
    minBill: number;
    maxBill: number;
    systemPower: string; // Admin uses string input
    totalPrice: number;
    installationCost: number;
    imageUrl: string;
    savings: string | number; // Support text or number
    paybackPeriod: string | number; // Support text or number
    status: 'active' | 'inactive';
    createdDate?: string;
    panelCount?: number;
    products?: PackageProduct[];
}
