
import React from 'react';
import { useData } from '../../services/dataProvider';
import { useNavigate, Link } from 'react-router-dom';

export const UserProfile: React.FC = () => {
    const { currentUser, logout, quotes, blogPosts } = useData();
    const navigate = useNavigate();

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    const myQuotes = quotes.filter(q => q.email === currentUser.email);
    const likedPosts = blogPosts.filter(p => p.likes > 20).slice(0, 3); 

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20 pt-10">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Profilim</h1>
                    <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors font-bold"
                    >
                        <span className="material-symbols-outlined">logout</span> Çıkış Yap
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 text-center sticky top-32">
                            <div className="size-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden border-4 border-primary/20">
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
                            <p className="text-sm text-gray-500 mb-6">{currentUser.email}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-100 dark:border-white/10 pt-6">
                                <div>
                                    <span className="block text-2xl font-black text-primary">{myQuotes.length}</span>
                                    <span className="text-xs text-gray-500 uppercase font-bold">Teklifler</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-orange-500">0</span>
                                    <span className="text-xs text-gray-500 uppercase font-bold">Siparişler</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* Quotes Section */}
                        <section className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/5">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">request_quote</span>
                                Fiyat Tekliflerim
                            </h3>
                            {myQuotes.length > 0 ? (
                                <div className="space-y-4">
                                    {myQuotes.map(quote => (
                                        <div key={quote.id} className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{quote.productName}</h4>
                                                <p className="text-sm text-gray-500">{quote.date}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase w-fit ${
                                                quote.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                quote.status === 'offered' ? 'bg-orange-100 text-orange-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {quote.status === 'new' ? 'İnceleniyor' : quote.status === 'offered' ? 'Teklif Hazır' : 'Onaylandı'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Henüz bir fiyat teklifi talebiniz bulunmuyor.</p>
                            )}
                        </section>

                        {/* Liked Posts / Reading List */}
                        <section className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/5">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500">favorite</span>
                                Favori Blog Yazıları
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {likedPosts.map(post => (
                                    <Link key={post.id} to={`/blog/${post.id}`} className="group flex gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-black/20 transition-colors">
                                        <div className="size-20 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h4>
                                            <span className="text-xs text-gray-500 mt-1 block">{post.category}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};
