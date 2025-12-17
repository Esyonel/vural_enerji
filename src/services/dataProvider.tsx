
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

    // Load Data from API
    useEffect(() => {
        const fetchApiData = async () => {
            setIsLoading(true);
            try {
                // Fetch Products
                const prodRes = await fetch('/api/products');
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setProducts(prodData);
                }

                // Fetch Categories
                const catRes = await fetch('/api/categories');
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData.length > 0 ? catData : initialCategories);
                } else {
                    setCategories(initialCategories);
                }

                // Fetch Site Content
                const contentRes = await fetch('/api/content');
                if (contentRes.ok) {
                    const contentData = await contentRes.json();
                    setSiteContent({ ...initialSiteContent, ...contentData });
                } else {
                    setSiteContent(initialSiteContent);
                }

                // Fetch Jobs
                const jobsRes = await fetch('/api/jobs');
                if (jobsRes.ok) setOpenPositions(await jobsRes.json());

                // Fetch Applications
                const appsRes = await fetch('/api/applications');
                if (appsRes.ok) setJobApplications(await appsRes.json());

                // Fetch Messages
                const msgRes = await fetch('/api/messages');
                if (msgRes.ok) setContactMessages(await msgRes.json());

                // Fetch Blog
                const blogRes = await fetch('/api/blog');
                if (blogRes.ok) setBlogPosts(await blogRes.json());

                // Fetch Media
                const mediaRes = await fetch('/api/media');
                if (mediaRes.ok) setMediaItems(await mediaRes.json());

                // Fetch Projects
                const projRes = await fetch('/api/projects');
                if (projRes.ok) setProjects(await projRes.json());

                // Fetch Quotes
                const quoteRes = await fetch('/api/quotes');
                if (quoteRes.ok) setQuotes(await quoteRes.json());

                // Fetch Customers
                const customersRes = await fetch('/api/customers');
                if (customersRes.ok) setCustomers(await customersRes.json());

                // Temporary fallback for unimplemented endpoints/ mocks
                setOrders(initialOrders);
            } catch (error) {
                console.error("API connection failed, falling back to mock data", error);
                setProducts(initialProducts);
                setCategories(initialCategories);
                setSiteContent(initialSiteContent);
                // Fallbacks
                setOrders(initialOrders);
                setCustomers(initialCustomers);
                setProjects(initialProjects);
                setQuotes(initialQuotes);
                setBlogPosts(initialBlogPosts);
                setJobApplications(initialJobApplications);
            }

            // Check for session (mock)
            const savedUser = localStorage.getItem('vural_user');
            if (savedUser) {
                setCurrentUser(JSON.parse(savedUser));
            }

            setIsLoading(false);
        };
        fetchApiData();
    }, []);

    // Auth Methods
    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success && data.user) {
                setCurrentUser(data.user);
                localStorage.setItem('vural_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }
            return { success: false, message: data.message || 'Giriş başarısız.' };
        } catch (e) {
            console.error("Login Error", e);
            return { success: false, message: 'Sunucu hatası.' };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (data.success) {
                // Auto login after register
                return login(email, password);
            }
            return { success: false, message: data.message || 'Kayıt başarısız.' };
        } catch (e) {
            console.error("Register Error", e);
            return { success: false, message: 'Sunucu hatası.' };
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('vural_user');
    };

    const updateSiteContent = async (newContent: Partial<SiteContent>) => {
        try {
            const updated = { ...siteContent, ...newContent };
            const res = await fetch('/api/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });

            if (res.ok) {
                setSiteContent(updated);
                localStorage.setItem('vural_site_content', JSON.stringify(updated));
            } else {
                console.error('Failed to update site content');
            }
        } catch (e) {
            console.error('Error updating site content:', e);
        }
    };

    // Helper to calculate stock status
    const calculateStockStatus = (stock: number): 'instock' | 'lowstock' | 'outstock' => {
        if (stock <= 0) return 'outstock';
        if (stock < 10) return 'lowstock';
        return 'instock';
    };

    const addProduct = async (product: Omit<Product, 'id'>) => {
        const newProduct = {
            ...product,
            stockStatus: calculateStockStatus(product.stock)
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (res.ok) {
                const savedProduct = await res.json();
                setProducts(prev => [savedProduct, ...prev]);
            }
        } catch (e) {
            console.error("Add product failed", e);
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        const updatedProducts = products.map(p => {
            if (p.id === id) {
                const updatedProduct = { ...p, ...updates };
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
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customer)
            });
            const data = await res.json();

            if (data.success) {
                const newCustomer: Customer = {
                    ...customer,
                    id: data.id,
                    joinDate: new Date().toISOString().split('T')[0],
                    status: 'active',
                    role: customer.role || 'user',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`
                };
                setCustomers(prev => [newCustomer, ...prev]);
            } else {
                console.error("Failed to add customer:", data.message);
                alert(data.message || 'Kullanıcı eklenemedi.');
            }
        } catch (e) {
            console.error("API call failed for addCustomer", e);
        }
    };

    const deleteCustomer = async (id: string) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    const updateCustomer = async (id: string, updates: Partial<Customer>) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

        if (currentUser && currentUser.id === id) {
            const updatedUser = { ...currentUser, ...updates };
            setCurrentUser(updatedUser);
            localStorage.setItem('vural_user', JSON.stringify(updatedUser));
        }
    };

    const addProject = async (project: Omit<Project, 'id'>) => {
        try {
            const res = await fetch('http://localhost:3001/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project)
            });
            if (res.ok) {
                const { id } = await res.json();
                setProjects(prev => [{ ...project, id }, ...prev]);
            }
        } catch (e) { console.error("Failed to add project", e); }
    };

    const deleteProject = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/projects/${id}`, { method: 'DELETE' });
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (e) { console.error("Failed to delete project", e); }
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        try {
            await fetch(`http://localhost:3001/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        } catch (e) { console.error("Failed to update project", e); }
    };

    const addQuote = async (quote: Omit<QuoteRequest, 'id' | 'date' | 'status'>) => {
        try {
            const res = await fetch('http://localhost:3001/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quote)
            });
            if (res.ok) {
                const { id } = await res.json();
                const newQuote: QuoteRequest = {
                    ...quote,
                    id,
                    date: new Date().toISOString().split('T')[0],
                    status: 'new'
                };
                setQuotes(prev => [newQuote, ...prev]);
            }
        } catch (e) { console.error("Failed to add quote", e); }
    };

    const updateQuoteStatus = async (id: string, status: QuoteRequest['status']) => {
        try {
            await fetch(`http://localhost:3001/api/quotes/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
        } catch (e) { console.error("Failed to update quote status", e); }
    };

    const deleteQuote = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/quotes/${id}`, { method: 'DELETE' });
            setQuotes(prev => prev.filter(q => q.id !== id));
        } catch (e) { console.error("Failed to delete quote", e); }
    };

    // Blog Methods
    const addBlogPost = async (post: Omit<BlogPost, 'id' | 'date' | 'slug' | 'likes' | 'comments'>) => {
        try {
            const res = await fetch('http://localhost:3001/api/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post)
            });
            if (res.ok) {
                const { id, slug, date } = await res.json();
                const newPost: BlogPost = { ...post, id, slug, date, likes: 0, comments: [] };
                setBlogPosts(prev => [newPost, ...prev]);
            }
        } catch (e) { console.error("Failed to add blog post", e); }
    };

    const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
        try {
            await fetch(`http://localhost:3001/api/blog/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        } catch (e) { console.error("Failed to update blog post", e); }
    };

    const deleteBlogPost = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/blog/${id}`, { method: 'DELETE' });
            setBlogPosts(prev => prev.filter(p => p.id !== id));
        } catch (e) { console.error("Failed to delete blog post", e); }
    };

    const addComment = async (postId: string, content: string) => {
        if (!currentUser) return;
        try {
            const res = await fetch(`http://localhost:3001/api/blog/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    userName: currentUser.name,
                    userAvatar: currentUser.avatar,
                    content
                })
            });
            if (res.ok) {
                const { id, date } = await res.json();
                const newComment: Comment = {
                    id, postId, userId: currentUser.id, userName: currentUser.name,
                    userAvatar: currentUser.avatar, content, date, status: 'approved'
                };
                setBlogPosts(prev => prev.map(p => {
                    if (p.id === postId) return { ...p, comments: [...(p.comments || []), newComment] };
                    return p;
                }));
            }
        } catch (e) { console.error("Failed to add comment", e); }
    };

    const deleteComment = async (postId: string, commentId: string) => {
        try {
            await fetch(`http://localhost:3001/api/blog/${postId}/comments/${commentId}`, { method: 'DELETE' });
            setBlogPosts(prev => prev.map(p => {
                if (p.id === postId) return { ...p, comments: (p.comments || []).filter(c => c.id !== commentId) };
                return p;
            }));
        } catch (e) { console.error("Failed to delete comment", e); }
    };

    const toggleLike = async (postId: string) => {
        try {
            await fetch(`http://localhost:3001/api/blog/${postId}/like`, { method: 'POST' });
            setBlogPosts(prev => prev.map(p => {
                if (p.id === postId) return { ...p, likes: p.likes + 1 };
                return p;
            }));
        } catch (e) { console.error("Failed to like post", e); }
    };

    // Job Methods
    const addJobApplication = async (app: Omit<JobApplication, 'id' | 'date' | 'status'>) => {
        try {
            const res = await fetch('http://localhost:3001/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(app)
            });
            if (res.ok) {
                const { id } = await res.json();
                const newApp: JobApplication = {
                    ...app,
                    id,
                    date: new Date().toISOString().split('T')[0],
                    status: 'new'
                };
                setJobApplications(prev => [newApp, ...prev]);
            }
        } catch (e) { console.error("Failed to add job application", e); }
    };

    const updateJobStatus = async (id: string, status: JobApplication['status']) => {
        try {
            await fetch(`http://localhost:3001/api/applications/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setJobApplications(prev => prev.map(j => j.id === id ? { ...j, status } : j));
        } catch (e) { console.error("Failed to update job status", e); }
    };

    // Media Methods
    const addMediaItem = async (item: Omit<MediaItem, 'id' | 'date'>) => {
        try {
            const res = await fetch('http://localhost:3001/api/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            if (res.ok) {
                const { id, date } = await res.json();
                const newItem: MediaItem = { ...item, id, date };
                setMediaItems(prev => [newItem, ...prev]);
            }
        } catch (e) {
            console.error("Failed to add media item", e);
            alert("Resim yüklenemedi!");
        }
    };

    // Contact Messages Methods
    const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
        try {
            const res = await fetch('http://localhost:3001/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(msg)
            });
            if (res.ok) {
                const { id } = await res.json();
                const newMsg: ContactMessage = {
                    ...msg,
                    id,
                    date: new Date().toISOString(),
                    status: 'new'
                };
                setContactMessages(prev => [newMsg, ...prev]);
            }
        } catch (e) { console.error("Failed to add contact message", e); }
    };

    const deleteContactMessage = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/messages/${id}`, { method: 'DELETE' });
            setContactMessages(prev => prev.filter(m => m.id !== id));
        } catch (e) { console.error("Failed to delete contact message", e); }
    };

    const updateContactMessageStatus = async (id: string, status: ContactMessage['status']) => {
        try {
            await fetch(`http://localhost:3001/api/messages/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        } catch (e) { console.error("Failed to update contact message status", e); }
    };

    // Open Positions Methods
    const addJobPosition = async (pos: Omit<JobPosition, 'id' | 'date' | 'isActive'>) => {
        try {
            const res = await fetch('http://localhost:3001/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pos)
            });
            if (res.ok) {
                const newPos = await res.json();
                setOpenPositions(prev => [newPos, ...prev]);
            }
        } catch (e) { console.error("Failed to add job position", e); }
    };

    const updateJobPosition = async (id: string, updates: Partial<JobPosition>) => {
        try {
            await fetch(`http://localhost:3001/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            setOpenPositions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        } catch (e) { console.error("Failed to update job position", e); }
    };

    const deleteJobPosition = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/jobs/${id}`, { method: 'DELETE' });
            setOpenPositions(prev => prev.filter(p => p.id !== id));
        } catch (e) { console.error("Failed to delete job position", e); }
    };

    const deleteMediaItem = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/api/media/${id}`, { method: 'DELETE' });
            setMediaItems(prev => prev.filter(m => m.id !== id));
        } catch (e) { console.error("Failed to delete media item", e); }
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
