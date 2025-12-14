
import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { ContactMessage } from '../../types';

export const ContactMessages: React.FC = () => {
    const { contactMessages, deleteContactMessage, updateContactMessageStatus } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<ContactMessage['status'] | 'all'>('all');

    const filteredMessages = contactMessages.filter(msg =>
        (filterStatus === 'all' || msg.status === filterStatus) &&
        (msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status: ContactMessage['status']) => {
        switch (status) {
            case 'new': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">Yeni</span>;
            case 'read': return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-bold">Okundu</span>;
            case 'replied': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Yanıtlandı</span>;
        }
    };

    return (
        <div className="pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gelen İletişim İstekleri</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Web sitesinden gelen form mesajlarını yönetin.</p>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="İsim, e-posta veya mesaj içeriği ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-sm"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 text-sm px-4"
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="new">Yeni Mesajlar</option>
                        <option value="read">Okunmuşlar</option>
                        <option value="replied">Yanıtlananlar</option>
                    </select>
                </div>
            </div>

            {filteredMessages.length === 0 ? (
                <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                    <p className="text-gray-500">Henüz mesaj bulunmuyor veya arama kriterlerine uymuyor.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredMessages.map(msg => (
                        <div key={msg.id} className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{msg.name}</h3>
                                        <p className="text-xs text-slate-500">{msg.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 mr-2">{new Date(msg.date).toLocaleDateString('tr-TR')}</span>
                                    {getStatusBadge(msg.status)}
                                    <div className="relative group">
                                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                            <span className="material-symbols-outlined text-slate-400">more_vert</span>
                                        </button>
                                        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-10">
                                            {msg.status !== 'read' && (
                                                <button onClick={() => updateContactMessageStatus(msg.id, 'read')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300">
                                                    Okundu Olarak İşaretle
                                                </button>
                                            )}
                                            {msg.status !== 'replied' && (
                                                <button onClick={() => updateContactMessageStatus(msg.id, 'replied')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300">
                                                    Yanıtlandı Olarak İşaretle
                                                </button>
                                            )}
                                            <button onClick={() => deleteContactMessage(msg.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600">
                                                Sil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
