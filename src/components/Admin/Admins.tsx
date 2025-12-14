import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';

export const Admins: React.FC = () => {
    const { customers, deleteCustomer, addCustomer, updateCustomer } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'admin' as const
    });

    // Filter only admins
    const admins = customers.filter(c => c.role === 'admin');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editMode && selectedAdminId) {
            // Update existing
            const { password, ...updateData } = formData;
            // Only include password if it's explicitly provided (though for edit we might want to handle it separately or keep it required if that's the desired flow. 
            // In this specific implementation, let's allow updating other fields without changing password if the input is hidden or we change the logic.
            // However, the current form has password as required. For a better UX, we might make password optional during edit.
            // Let's stick to the simplest flow: Update everything.
            await updateCustomer(selectedAdminId, { ...updateData, role: 'admin' });
        } else {
            // Create new
            await addCustomer({ ...formData, role: 'admin' });
        }

        closeModal();
    };

    const openAddModal = () => {
        setFormData({ name: '', email: '', phone: '', password: '', role: 'admin' });
        setEditMode(false);
        setSelectedAdminId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (admin: typeof admins[0]) => {
        setFormData({
            name: admin.name,
            email: admin.email,
            phone: admin.phone || '',
            password: admin.password || '', // Password might not be visible in real app, but for mock data we have it
            role: 'admin'
        });
        setEditMode(true);
        setSelectedAdminId(admin.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phone: '', password: '', role: 'admin' });
        setEditMode(false);
        setSelectedAdminId(null);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedAdminId && newPassword) {
            await updateCustomer(selectedAdminId, { password: newPassword });
            setIsPasswordModalOpen(false);
            setNewPassword('');
            setSelectedAdminId(null);
            alert('Şifre başarıyla güncellendi.');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Yönetimi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Sistem yöneticilerini ve yetkilerini yönetin.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-black rounded-lg px-5 h-11 transition-colors shadow-sm font-bold"
                >
                    <span className="material-symbols-outlined">add_moderator</span>
                    <span>Yeni Admin</span>
                </button>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Yönetici</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İletişim</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kayıt Tarihi</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 flex items-center justify-center font-bold">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{admin.name}</p>
                                                <p className="text-xs text-slate-500">ID: #{admin.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{admin.email}</p>
                                        <p className="text-xs text-slate-500">{admin.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${admin.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            <span className={`size-1.5 rounded-full ${admin.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                            {admin.status === 'active' ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {admin.joinDate}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedAdminId(admin.id);
                                                setIsPasswordModalOpen(true);
                                            }}
                                            className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                            title="Şifre Değiştir"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">key</span>
                                        </button>
                                        <button
                                            onClick={() => openEditModal(admin)}
                                            className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                            title="Düzenle"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => deleteCustomer(admin.id)}
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

            {/* Add Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={closeModal}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editMode ? 'Admin Düzenle' : 'Yeni Admin Ekle'}</h3>
                            <button onClick={closeModal} className="text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ad Soyad</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-posta</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Şifre</label>
                                    <input required={!editMode} type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" placeholder={editMode ? "Değiştirmek istemiyorsanız boş bırakın" : ""} />
                                    {editMode && <p className="text-xs text-slate-500 mt-1">Şifreyi değiştirmek istemiyorsanız bu alanı olduğu gibi bırakın veya boş geçin (mevcut şifre korunur).</p>}
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                                    İptal
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary hover:bg-green-600 text-black font-bold transition-colors shadow-lg shadow-primary/20">
                                    {editMode ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsPasswordModalOpen(false)}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Şifre Değiştir</h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handlePasswordUpdate} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Yeni Şifre</label>
                                    <input
                                        required
                                        type="text"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"
                                        placeholder="Yeni şifreyi giriniz"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Şifre değişiklikleri anında geçerli olacaktır.</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                                    İptal
                                </button>
                                <button type="submit" className="px-4 py-2 rounded-xl bg-primary hover:bg-green-600 text-black font-bold transition-colors shadow-lg shadow-primary/20">
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
