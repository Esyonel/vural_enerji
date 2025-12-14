import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { Customer } from '../../types';

export const Users: React.FC = () => {
    const { customers, deleteCustomer, addCustomer, updateCustomer } = useData();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Customer | null>(null);

    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
    });

    // Filter only standard users
    const users = customers.filter(c => c.role === 'user');

    const handleEditClick = (user: Customer) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            phone: user.phone || ''
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            await updateCustomer(editingUser.id, editForm);
            setIsEditModalOpen(false);
            setEditingUser(null);
        }
    };

    const toggleBlockUser = async (user: Customer) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        await updateCustomer(user.id, { status: newStatus });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kullanıcı Yönetimi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Siteye kayıtlı kullanıcıları ve durumlarını yönetin.</p>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kullanıcı</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İletişim</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kayıt Tarihi</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 flex items-center justify-center font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-slate-500">ID: #{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
                                        <p className="text-xs text-slate-500">{user.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            <span className={`size-1.5 rounded-full ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                            {user.status === 'active' ? 'Aktif' : 'Engelli'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {user.joinDate}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                            title="Düzenle"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => toggleBlockUser(user)}
                                            className={`transition-colors p-2 rounded-lg ${user.status === 'active'
                                                    ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                    : 'text-red-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                }`}
                                            title={user.status === 'active' ? 'Engelle' : 'Engeli Kaldır'}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {user.status === 'active' ? 'block' : 'check_circle'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => deleteCustomer(user.id)}
                                            className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            title="Sil"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsEditModalOpen(false)}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kullanıcı Düzenle</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ad Soyad</label>
                                    <input required type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-posta</label>
                                    <input required type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                                    <input required type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                                    İptal
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary hover:bg-green-600 text-black font-bold transition-colors shadow-lg shadow-primary/20">
                                    Güncelle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
