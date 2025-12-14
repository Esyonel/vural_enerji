
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './services/dataProvider';
import { PublicLayout } from './components/Public/Layout';
import { Home } from './components/Public/Home';
import { ProjectsPage } from './components/Public/ProjectsPage';
import { AboutPage } from './components/Public/AboutPage';
import { VisionMissionPage } from './components/Public/VisionMissionPage';
import { CareerPage } from './components/Public/CareerPage';
import { ContactPage } from './components/Public/ContactPage';
import { BlogPage } from './components/Public/BlogPage';
import { NewsDetailPage } from './components/Public/NewsDetailPage';
import { ProductDetailPage } from './components/Public/ProductDetailPage';
import { AuthPage } from './components/Auth/AuthPage';
import { UserProfile } from './components/User/UserProfile';
import { AdminLayout } from './components/Admin/Layout';
import { Dashboard } from './components/Admin/Dashboard';
import { Products } from './components/Admin/Products';
import { ProjectsAdmin } from './components/Admin/ProjectsAdmin';
import { Quotes } from './components/Admin/Quotes';
import { ContentEditor } from './components/Admin/ContentEditor';
import { Customers } from './components/Admin/Customers';
import { Settings } from './components/Admin/Settings';
import { Categories } from './components/Admin/Categories';
import { CareerAdmin } from './components/Admin/CareerAdmin';
import { BlogAdmin } from './components/Admin/BlogAdmin';
import { MediaLibrary } from './components/Admin/MediaLibrary';
import { Admins } from './components/Admin/Admins';
import { ContactMessages } from './components/Admin/ContactMessages';
import { Users } from './components/Admin/Users';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly }) => {
    const { currentUser, isLoading } = useData();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Yükleniyor...</div>;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && currentUser.role !== 'admin') {
        return <Navigate to="/profile" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <DataProvider>
            <Router>
                <Routes>
                    {/* Public Routes Wrapped in Layout */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/vision-mission" element={<VisionMissionPage />} />
                        <Route path="/career" element={<CareerPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:id" element={<NewsDetailPage />} />
                        <Route path="/news/:id" element={<NewsDetailPage />} />
                        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    </Route>

                    {/* Auth */}
                    <Route path="/login" element={<AuthPage />} />

                    {/* Admin Protected Routes */}
                    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                        <Route index element={<Dashboard />} />
                        <Route path="quotes" element={<Quotes />} />
                        <Route path="products" element={<Products />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="projects" element={<ProjectsAdmin />} />
                        <Route path="content" element={<ContentEditor />} />
                        <Route path="career" element={<CareerAdmin />} />
                        <Route path="contact-messages" element={<ContactMessages />} />
                        <Route path="blog" element={<BlogAdmin />} />
                        <Route path="media" element={<MediaLibrary />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="admins" element={<Admins />} />
                        <Route path="users" element={<Users />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </Router>
        </DataProvider>
    );
};

export default App;
