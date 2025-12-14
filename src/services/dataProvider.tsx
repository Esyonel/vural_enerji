
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, SiteContent, Customer, Project, QuoteRequest, Category, BlogPost, JobApplication, Comment, MediaItem, JobPosition, ContactMessage } from '../types';
import { initialProducts, initialOrders, initialSiteContent, initialCustomers, initialProjects, initialQuotes, initialCategories, initialBlogPosts, initialJobApplications } from './mockData';

interface DataContextType {
    products: Product[];
    categories: Category[];
    orders: Order[];
    customers: Customer[];
    projects: Project[];
    quotes: QuoteRequest[];
    blogPosts: BlogPost[];
    jobApplications: JobApplication[];
    siteContent: SiteContent;
    isLoading: boolean;
    currentUser: Customer | null;

    // Contact Messages
    contactMessages: ContactMessage[];
    addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => Promise<void>;
    deleteContactMessage: (id: string) => Promise<void>;
    updateContactMessageStatus: (id: string, status: ContactMessage['status']) => Promise<void>;

    // Job Positions
    openPositions: JobPosition[];
    addJobPosition: (pos: Omit<JobPosition, 'id' | 'date' | 'isActive'>) => Promise<void>;
    updateJobPosition: (id: string, pos: Partial<JobPosition>) => Promise<void>;
    deleteJobPosition: (id: string) => Promise<void>;

    // Auth Methods
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: Customer }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;

    updateSiteContent: (newContent: Partial<SiteContent>) => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addCustomer: (customer: Omit<Customer, 'id' | 'joinDate' | 'status'>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    addProject: (project: Omit<Project, 'id'>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    updateProject: (id: string, project: Partial<Project>) => Promise<void>;
    addQuote: (quote: Omit<QuoteRequest, 'id' | 'date' | 'status'>) => Promise<void>;
    updateQuoteStatus: (id: string, status: QuoteRequest['status']) => Promise<void>;
    deleteQuote: (id: string) => Promise<void>;

    // Blog Methods
    addBlogPost: (post: Omit<BlogPost, 'id' | 'date' | 'slug' | 'likes' | 'comments'>) => Promise<void>;
    updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
    deleteBlogPost: (id: string) => Promise<void>;
    addComment: (postId: string, content: string) => Promise<void>;
    deleteComment: (postId: string, commentId: string) => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;

    // Job Methods
    addJobApplication: (app: Omit<JobApplication, 'id' | 'date' | 'status'>) => Promise<void>;
    updateJobStatus: (id: string, status: JobApplication['status']) => Promise<void>;

    // Media Methods
    mediaItems: MediaItem[];
    addMediaItem: (item: Omit<MediaItem, 'id' | 'date'>) => Promise<void>;
    deleteMediaItem: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [openPositions, setOpenPositions] = useState<JobPosition[]>([]);
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
    const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<Customer | null>(null);

    // Simulate Supabase fetch on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            // Load Media Library
            const savedMedia = localStorage.getItem('vural_media_library');
            if (savedMedia) {
                try {
                    setMediaItems(JSON.parse(savedMedia));
                } catch (e) {
                    console.error("Error parsing saved media", e);
                }
            }

            // Load Open Positions
            const savedPositions = localStorage.getItem('vural_open_positions');
            if (savedPositions) {
                try {
                    setOpenPositions(JSON.parse(savedPositions));
                } catch (e) { console.error(e); }
            }

            // Load Contact Messages
            const savedMessages = localStorage.getItem('vural_contact_messages');
            if (savedMessages) {
                try {
                    setContactMessages(JSON.parse(savedMessages));
                } catch (e) { console.error(e); }
            }

            // Load Products with Persistence
            const savedProducts = localStorage.getItem('vural_products');
            if (savedProducts) {
                try {
                    setProducts(JSON.parse(savedProducts));
                } catch (e) {
                    console.error("Error parsing saved products", e);
                    setProducts(initialProducts);
                }
            } else {
                setProducts(initialProducts);
            }

            setCategories(initialCategories);
            setOrders(initialOrders);
            setCustomers(initialCustomers);
            setProjects(initialProjects);
            setQuotes(initialQuotes);
            setBlogPosts(initialBlogPosts);
            setJobApplications(initialJobApplications);

            // Load Site Content with Persistence
            const savedContent = localStorage.getItem('vural_site_content');
            if (savedContent) {
                try {
                    setSiteContent({ ...initialSiteContent, ...JSON.parse(savedContent) });
                } catch (e) {
                    console.error("Error parsing saved site content", e);
                    setSiteContent(initialSiteContent);
                }
            } else {
                setSiteContent(initialSiteContent);
            }

            // Check for session (mock)
            const savedUser = localStorage.getItem('vural_user');
            if (savedUser) {
                setCurrentUser(JSON.parse(savedUser));
            }

            setIsLoading(false);
        };
        fetchData();
    }, []);

    // Auth Methods
    const login = async (email: string, password: string) => {
        // Mock authentication
        await new Promise(resolve => setTimeout(resolve, 500));

        // Special check for simple admin login as requested: admin / admin
        if (email === 'admin' && password === 'admin') {
            const adminUser: Customer = {
                id: 'admin-id',
                name: 'Vural Admin',
                email: 'admin@vuralenerji.com',
                role: 'admin',
                status: 'active',
                joinDate: '2023-01-01',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
            };
            setCurrentUser(adminUser);
            localStorage.setItem('vural_user', JSON.stringify(adminUser));
            return { success: true, user: adminUser };
        }

        const user = customers.find(c => c.email === email && c.password === password);

        if (user) {
            setCurrentUser(user);
            localStorage.setItem('vural_user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'E-posta/Kullanıcı adı veya şifre hatalı.' };
    };

    const register = async (name: string, email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const existing = customers.find(c => c.email === email);
        if (existing) return { success: false, message: 'Bu e-posta adresi zaten kayıtlı.' };

        const newUser: Customer = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            password,
            role: 'user',
            status: 'active',
            joinDate: new Date().toLocaleDateString('tr-TR'),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };

        setCustomers(prev => [...prev, newUser]);
        // Auto login after register
        setCurrentUser(newUser);
        localStorage.setItem('vural_user', JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('vural_user');
    };

    const updateSiteContent = async (newContent: Partial<SiteContent>) => {
        setSiteContent(prev => {
            const updated = { ...prev, ...newContent };
            localStorage.setItem('vural_site_content', JSON.stringify(updated));
            return updated;
        });
    };

    // Helper to calculate stock status
    const calculateStockStatus = (stock: number): 'instock' | 'lowstock' | 'outstock' => {
        if (stock <= 0) return 'outstock';
        if (stock < 10) return 'lowstock';
        return 'instock';
    };

    const addProduct = async (product: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...product,
            id: Math.random().toString(36).substr(2, 9),
            stockStatus: calculateStockStatus(product.stock)
        };
        const newProducts = [newProduct, ...products];
        setProducts(newProducts);
        localStorage.setItem('vural_products', JSON.stringify(newProducts));
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        const updatedProducts = products.map(p => {
            if (p.id === id) {
                const updatedProduct = { ...p, ...updates };
                // Recalculate stock status if stock changed
                if (updates.stock !== undefined) {
                    updatedProduct.stockStatus = calculateStockStatus(updatedProduct.stock);
                }
                return updatedProduct;
            }
            return p;
        });
        setProducts(updatedProducts);
        localStorage.setItem('vural_products', JSON.stringify(updatedProducts));
    };

    const deleteProduct = async (id: string) => {
        const newProducts = products.filter(p => p.id !== id);
        setProducts(newProducts);
        localStorage.setItem('vural_products', JSON.stringify(newProducts));
    };

    const addCategory = async (category: Omit<Category, 'id'>) => {
        const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9) };
        setCategories(prev => [...prev, newCategory]);
    };

    const updateCategory = async (id: string, updates: Partial<Category>) => {
        const oldCategory = categories.find(c => c.id === id);
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

        // If slug changed, update associated products
        if (oldCategory && updates.slug && oldCategory.slug !== updates.slug) {
            setProducts(prev => prev.map(p =>
                p.category === oldCategory.slug ? { ...p, category: updates.slug! } : p
            ));
        }
    };

    const deleteCategory = async (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    const addCustomer = async (customer: Omit<Customer, 'id' | 'joinDate' | 'status'>) => {
        const newCustomer: Customer = {
            ...customer,
            id: Math.random().toString(36).substr(2, 9),
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`
        };
        setCustomers(prev => [newCustomer, ...prev]);
    };

    const deleteCustomer = async (id: string) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    const updateCustomer = async (id: string, updates: Partial<Customer>) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

        // If updating current user (self), update session
        if (currentUser && currentUser.id === id) {
            const updatedUser = { ...currentUser, ...updates };
            setCurrentUser(updatedUser);
            localStorage.setItem('vural_user', JSON.stringify(updatedUser));
        }
    };

    const addProject = async (project: Omit<Project, 'id'>) => {
        const newProject = { ...project, id: Math.random().toString(36).substr(2, 9) };
        setProjects(prev => [newProject, ...prev]);
    };

    const deleteProject = async (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const addQuote = async (quote: Omit<QuoteRequest, 'id' | 'date' | 'status'>) => {
        const newQuote: QuoteRequest = {
            ...quote,
            id: 'qt-' + Math.random().toString(36).substr(2, 6),
            date: new Date().toISOString().split('T')[0],
            status: 'new'
        };
        setQuotes(prev => [newQuote, ...prev]);
    };

    const updateQuoteStatus = async (id: string, status: QuoteRequest['status']) => {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    };

    const deleteQuote = async (id: string) => {
        setQuotes(prev => prev.filter(q => q.id !== id));
    };

    // Blog Methods
    const addBlogPost = async (post: Omit<BlogPost, 'id' | 'date' | 'slug' | 'likes' | 'comments'>) => {
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const newPost: BlogPost = {
            ...post,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toLocaleDateString('tr-TR'),
            slug,
            likes: 0,
            comments: []
        };
        setBlogPosts(prev => [newPost, ...prev]);
    };

    const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
        setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteBlogPost = async (id: string) => {
        setBlogPosts(prev => prev.filter(p => p.id !== id));
    };

    const addComment = async (postId: string, content: string) => {
        if (!currentUser) return;
        const newComment: Comment = {
            id: 'c' + Math.random().toString(36).substr(2, 9),
            postId,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            content,
            date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
            status: 'approved' // Auto approve for demo
        };

        setBlogPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return { ...p, comments: [...(p.comments || []), newComment] };
            }
            return p;
        }));
    };

    const deleteComment = async (postId: string, commentId: string) => {
        setBlogPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return { ...p, comments: (p.comments || []).filter(c => c.id !== commentId) };
            }
            return p;
        }));
    };

    const toggleLike = async (postId: string) => {
        setBlogPosts(prev => prev.map(p => {
            if (p.id === postId) {
                // Toggle logic simulation (just increment for now as we don't track user likes in mock DB)
                return { ...p, likes: p.likes + 1 };
            }
            return p;
        }));
    };

    // Job Methods
    const addJobApplication = async (app: Omit<JobApplication, 'id' | 'date' | 'status'>) => {
        const newApp: JobApplication = {
            ...app,
            id: 'job-' + Math.random().toString(36).substr(2, 6),
            date: new Date().toISOString().split('T')[0],
            status: 'new'
        };
        setJobApplications(prev => [newApp, ...prev]);
    };

    const updateJobStatus = async (id: string, status: JobApplication['status']) => {
        setJobApplications(prev => prev.map(j => j.id === id ? { ...j, status } : j));
    };

    // Media Methods
    const addMediaItem = async (item: Omit<MediaItem, 'id' | 'date'>) => {
        const newItem: MediaItem = {
            ...item,
            id: 'media-' + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString()
        };
        const newItems = [newItem, ...mediaItems];
        setMediaItems(newItems);
        // Persist to localStorage (heavy but needed for demo)
        try {
            localStorage.setItem('vural_media_library', JSON.stringify(newItems));
        } catch (e) {
            console.error("Storage limit exceeded", e);
            alert("Depolama alanı doldu! Daha fazla resim yükleyemezsiniz.");
            // Revert state
            setMediaItems(mediaItems);
        }
    };

    // Contact Messages Methods
    const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
        const newMsg: ContactMessage = {
            ...msg,
            id: 'msg-' + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            status: 'new'
        };
        const newMessages = [newMsg, ...contactMessages];
        setContactMessages(newMessages);
        localStorage.setItem('vural_contact_messages', JSON.stringify(newMessages));
    };

    const deleteContactMessage = async (id: string) => {
        const newMessages = contactMessages.filter(m => m.id !== id);
        setContactMessages(newMessages);
        localStorage.setItem('vural_contact_messages', JSON.stringify(newMessages));
    };

    const updateContactMessageStatus = async (id: string, status: ContactMessage['status']) => {
        const newMessages = contactMessages.map(m => m.id === id ? { ...m, status } : m);
        setContactMessages(newMessages);
        localStorage.setItem('vural_contact_messages', JSON.stringify(newMessages));
    };

    // Open Positions Methods
    const addJobPosition = async (pos: Omit<JobPosition, 'id' | 'date' | 'isActive'>) => {
        const newPos: JobPosition = {
            ...pos,
            id: 'pos-' + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
            isActive: true
        };
        const newPositions = [newPos, ...openPositions];
        setOpenPositions(newPositions);
        localStorage.setItem('vural_open_positions', JSON.stringify(newPositions));
    };

    const updateJobPosition = async (id: string, updates: Partial<JobPosition>) => {
        const newPositions = openPositions.map(p => p.id === id ? { ...p, ...updates } : p);
        setOpenPositions(newPositions);
        localStorage.setItem('vural_open_positions', JSON.stringify(newPositions));
    };

    const deleteJobPosition = async (id: string) => {
        const newPositions = openPositions.filter(p => p.id !== id);
        setOpenPositions(newPositions);
        localStorage.setItem('vural_open_positions', JSON.stringify(newPositions));
    };

    const deleteMediaItem = async (id: string) => {
        const newItems = mediaItems.filter(m => m.id !== id);
        setMediaItems(newItems);
        localStorage.setItem('vural_media_library', JSON.stringify(newItems));
    };

    return (
        <DataContext.Provider value={{
            products,
            categories,
            orders,
            customers,
            projects,
            quotes,
            blogPosts,
            jobApplications,
            siteContent,
            isLoading,
            currentUser,
            login,
            register,
            logout,
            updateSiteContent,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            updateCategory,
            deleteCategory,
            addCustomer,
            deleteCustomer,
            updateCustomer,
            addProject,
            deleteProject,
            updateProject,
            addQuote,
            updateQuoteStatus,
            deleteQuote,
            addBlogPost,
            updateBlogPost,
            deleteBlogPost,
            addComment,
            deleteComment,
            toggleLike,
            addJobApplication,
            updateJobStatus,
            mediaItems,
            addMediaItem,
            deleteMediaItem,
            contactMessages,
            addContactMessage,
            deleteContactMessage,
            updateContactMessageStatus,
            openPositions,
            addJobPosition,
            updateJobPosition,
            deleteJobPosition
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
