
import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { Link } from 'react-router-dom';
import { SEO } from '../SEO';

export const BlogPage: React.FC = () => {
    const { blogPosts } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Derived data
    const categories = Array.from(new Set(blogPosts.map(p => p.category)));
    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const recentPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20 pt-10">
            <SEO
                title="Enerji ve Teknoloji Blogu"
                description="Güneş enerjisi sistemleri, elektrik tasarrufu yöntemleri ve yenilenebilir enerji teknolojileri hakkında güncel makaleler ve rehberler."
                keywords="enerji blogu, solar enerji haberleri, ges rehberi, güneş paneli makaleleri"
            />
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase mb-2 block">Vural Enerji Blog</span>
                    <h1 className="text-4xl md:text-5xl font-black font-display mb-4">Enerji ve Teknoloji Güncesi</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                        Sektördeki yenilikler, enerji tasarrufu ipuçları ve teknik makalelerimizi buradan takip edebilirsiniz.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredPosts.map(post => (
                                <Link key={post.id} to={`/blog/${post.id}`} className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-full">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-3">
                                            <span>{post.date}</span>
                                            <span className="size-1 rounded-full bg-gray-400"></span>
                                            <span>{post.author}</span>
                                        </div>
                                        <h3 className="text-xl font-bold font-display mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium pt-4 border-t border-gray-100 dark:border-white/5">
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">favorite</span> {post.likes}</span>
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">chat_bubble</span> {post.comments?.length || 0}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {filteredPosts.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                <p>Aradığınız kriterlere uygun yazı bulunamadı.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Search Widget */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold text-lg mb-4">Ara</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Blogda ara..."
                                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">search</span>
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold text-lg mb-4">Kategoriler</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${selectedCategory === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 dark:hover:bg-black/20 text-gray-600 dark:text-gray-300'}`}
                                >
                                    Tümü
                                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                </button>
                                {categories.map((cat, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${selectedCategory === cat ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 dark:hover:bg-black/20 text-gray-600 dark:text-gray-300'}`}
                                    >
                                        {cat}
                                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Posts Widget */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold text-lg mb-4">Son Yazılar</h3>
                            <div className="space-y-4">
                                {recentPosts.map(post => (
                                    <Link key={post.id} to={`/blog/${post.id}`} className="flex gap-4 group">
                                        <div className="size-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h4>
                                            <span className="text-xs text-gray-500">{post.date}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
