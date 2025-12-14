
import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { BlogPost } from '../../types';

export const BlogAdmin: React.FC = () => {
    const { blogPosts, addBlogPost, deleteBlogPost, updateBlogPost, deleteComment } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState<Omit<BlogPost, 'id' | 'date' | 'slug' | 'likes' | 'comments'>>({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        imageUrl: '',
        category: 'Genel',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');

    const handleOpenModal = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            const { id, date, slug, likes, comments, ...rest } = post;
            setFormData(rest);
        } else {
            setEditingPost(null);
            setFormData({ title: '', excerpt: '', content: '', author: '', imageUrl: '', category: 'Genel', tags: [] });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPost) {
            await updateBlogPost(editingPost.id, formData);
        } else {
            await addBlogPost(formData);
        }
        setIsModalOpen(false);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
            setTagInput('');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Blog Yönetimi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Blog yazılarını ve yorumları yönetin.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-black rounded-lg px-5 h-11 transition-colors shadow-sm font-bold"
                >
                    <span className="material-symbols-outlined">post_add</span>
                    <span>Yeni Yazı</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {blogPosts.map((post) => (
                    <div key={post.id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm group">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-32 md:h-auto relative bg-gray-100 dark:bg-gray-800 shrink-0">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-primary mb-1 block">{post.category}</span>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{post.title}</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenModal(post)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-slate-500">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button onClick={() => deleteBlogPost(post.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center gap-6 text-xs font-medium text-slate-500">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">visibility</span> {Math.floor(Math.random() * 1000)} Görüntülenme</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">favorite</span> {post.likes} Beğeni</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">chat</span> {post.comments?.length || 0} Yorum</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Comments Management Section within the card */}
                        {post.comments && post.comments.length > 0 && (
                            <div className="bg-gray-50 dark:bg-black/20 p-4 border-t border-slate-200 dark:border-slate-800">
                                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Son Yorumlar</h4>
                                <div className="space-y-3">
                                    {post.comments.map(comment => (
                                        <div key={comment.id} className="flex justify-between items-start text-sm">
                                            <div className="flex gap-2">
                                                <img src={comment.userAvatar} className="size-6 rounded-full" alt="user" />
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white mr-2">{comment.userName}</span>
                                                    <span className="text-slate-600 dark:text-slate-400">{comment.content}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteComment(post.id, comment.id)} className="text-red-500 hover:underline text-xs shrink-0 ml-2">Sil</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Başlık</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Özet</label>
                                    <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                                    <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yazar</label>
                                    <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kapak Görseli URL</label>
                                    <input required type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Etiketler</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} className="flex-1 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" placeholder="Etiket ekle..." />
                                        <button type="button" onClick={handleAddTag} className="px-3 bg-slate-200 rounded-lg">Ekle</button>
                                    </div>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {formData.tags?.map(tag => (
                                            <span key={tag} className="text-xs bg-primary/20 px-2 py-1 rounded">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">İçerik</label>
                                    <textarea required rows={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 font-mono text-sm"></textarea>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                                    İptal
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary hover:bg-green-600 text-black font-bold transition-colors shadow-lg shadow-primary/20">
                                    {editingPost ? 'Kaydet' : 'Yayınla'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
