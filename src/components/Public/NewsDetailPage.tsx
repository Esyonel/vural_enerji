
import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useData } from '../../services/dataProvider';

export const NewsDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { siteContent, blogPosts, currentUser, addComment, toggleLike } = useData();
    const location = useLocation();
    const [newComment, setNewComment] = useState('');
    
    const isBlog = location.pathname.includes('/blog/');
    
    let content: any = null;
    let type: 'blog' | 'news' = 'news';

    if (isBlog) {
        content = blogPosts.find(p => p.id === id);
        type = 'blog';
    } else {
        content = siteContent.news.find(n => n.id === id);
        type = 'news';
    }

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && id) {
            await addComment(id, newComment);
            setNewComment('');
        }
    };

    if (!content) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-slate-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">İçerik Bulunamadı</h2>
                <Link to="/" className="text-primary hover:underline">Ana Sayfaya Dön</Link>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20 pt-10">
             <div className="max-w-[1000px] mx-auto">
                 <Link to={isBlog ? "/blog" : "/"} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-8 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span> {isBlog ? 'Blog Listesi' : 'Ana Sayfa'}
                 </Link>

                 <article className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/5">
                     <header className="mb-8">
                         <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-4">
                             <span className="bg-primary/10 text-primary px-3 py-1 rounded-full uppercase text-xs font-bold">
                                 {type === 'blog' ? (content.category || 'Blog') : (content.category === 'solar' ? 'Güneş' : content.category === 'wind' ? 'Rüzgar' : 'Haber')}
                             </span>
                             <span>{content.date}</span>
                             {type === 'blog' && <span>• {content.author}</span>}
                         </div>
                         <h1 className="text-3xl md:text-5xl font-black font-display leading-tight mb-6">
                             {content.title}
                         </h1>
                         {type === 'blog' && content.imageUrl && (
                             <img src={content.imageUrl} alt={content.title} className="w-full aspect-video object-cover rounded-2xl mb-8" />
                         )}
                     </header>

                     <div className="prose dark:prose-invert prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                         {type === 'blog' ? content.content : (content.content || content.summary)}
                     </div>

                     {/* Like Button */}
                     {type === 'blog' && (
                         <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10 flex items-center gap-4">
                             <button 
                                onClick={() => toggleLike(content.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-500 transition-colors font-bold"
                             >
                                 <span className="material-symbols-outlined">favorite</span>
                                 {content.likes} Beğeni
                             </button>
                             <div className="flex gap-2 text-sm">
                                {content.tags?.map((tag: string) => (
                                    <span key={tag} className="text-gray-500">#{tag}</span>
                                ))}
                             </div>
                         </div>
                     )}

                     {type === 'news' && content.sourceUrl && (
                         <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10">
                             <p className="text-sm text-gray-500 mb-2">Bu haberin kaynağı:</p>
                             <a 
                                href={content.sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                             >
                                 {content.sourceName || 'Kaynak Bağlantısı'}
                                 <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                             </a>
                         </div>
                     )}
                 </article>

                 {/* Comments Section */}
                 {type === 'blog' && (
                     <div className="mt-12 bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/5">
                         <h3 className="text-2xl font-bold mb-8">Yorumlar ({content.comments?.length || 0})</h3>
                         
                         {/* Comment Form */}
                         {currentUser ? (
                             <form onSubmit={handleCommentSubmit} className="mb-10">
                                 <div className="flex gap-4">
                                     <div className="size-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                                         <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                                     </div>
                                     <div className="flex-1">
                                         <textarea 
                                            rows={3} 
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Düşüncelerini paylaş..." 
                                            className="w-full rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary p-4"
                                         />
                                         <div className="flex justify-end mt-2">
                                             <button 
                                                type="submit" 
                                                disabled={!newComment.trim()}
                                                className="bg-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-green-500 disabled:opacity-50 transition-colors"
                                             >
                                                 Yorum Yap
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             </form>
                         ) : (
                             <div className="p-6 bg-gray-50 dark:bg-black/20 rounded-xl text-center mb-10 border border-gray-100 dark:border-white/5">
                                 <p className="text-gray-500 mb-4">Yorum yapabilmek için giriş yapmalısınız.</p>
                                 <Link to="/login" className="inline-block bg-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors">
                                     Giriş Yap
                                 </Link>
                             </div>
                         )}

                         {/* Comments List */}
                         <div className="space-y-8">
                             {content.comments?.map((comment: any) => (
                                 <div key={comment.id} className="flex gap-4">
                                     <div className="size-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                         <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                                     </div>
                                     <div>
                                         <div className="flex items-center gap-2 mb-1">
                                             <span className="font-bold text-slate-900 dark:text-white">{comment.userName}</span>
                                             <span className="text-xs text-gray-500">{comment.date}</span>
                                         </div>
                                         <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                             {comment.content}
                                         </p>
                                     </div>
                                 </div>
                             ))}
                             {(!content.comments || content.comments.length === 0) && (
                                 <p className="text-gray-500 text-sm">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                             )}
                         </div>
                     </div>
                 )}
             </div>
        </div>
    );
};
