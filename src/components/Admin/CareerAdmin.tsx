import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { JobApplication, JobPosition } from '../../types';

export const CareerAdmin: React.FC = () => {
    const { jobApplications, updateJobStatus, openPositions, addJobPosition, deleteJobPosition, updateJobPosition } = useData();
    const [activeTab, setActiveTab] = useState<'applications' | 'positions'>('applications');

    // Application States
    const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

    // Position States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPosition, setNewPosition] = useState<Partial<JobPosition>>({
        title: '',
        location: 'Osmaniye (Merkez)',
        type: 'Full-time',
        description: '',
        requirements: [],
        isActive: true
    });
    const [reqInput, setReqInput] = useState('');

    const handleAddRequirement = () => {
        if (reqInput.trim()) {
            setNewPosition({
                ...newPosition,
                requirements: [...(newPosition.requirements || []), reqInput.trim()]
            });
            setReqInput('');
        }
    };

    const removeRequirement = (index: number) => {
        setNewPosition({
            ...newPosition,
            requirements: newPosition.requirements?.filter((_, i) => i !== index)
        });
    };

    const handleSavePosition = async () => {
        if (newPosition.title && newPosition.description) {
            await addJobPosition(newPosition as any);
            setIsAddModalOpen(false);
            setNewPosition({
                title: '',
                location: 'Osmaniye (Merkez)',
                type: 'Full-time',
                description: '',
                requirements: [],
                isActive: true
            });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kariyer Merkezi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">İş başvurularını ve açık pozisyonları yönetin.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'applications' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Başvurular
                    </button>
                    <button
                        onClick={() => setActiveTab('positions')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'positions' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Açık Pozisyonlar
                    </button>
                </div>
            </div>

            {activeTab === 'applications' ? (
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    {/* Existing Applications Table Code */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aday</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pozisyon</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tarih</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {jobApplications.length === 0 ? (
                                    <tr><td colSpan={5} className="py-10 text-center text-slate-500">Başvuru bulunamadı.</td></tr>
                                ) : (
                                    jobApplications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{app.fullName}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{app.position}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{app.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                    app.status === 'interview' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>{app.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => setSelectedApp(app)} className="text-primary hover:text-green-600 font-bold text-sm">İncele</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-primary hover:bg-green-600 text-black px-4 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Yeni Pozisyon Ekle
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {openPositions.map(pos => (
                            <div key={pos.id} className={`bg-surface-light dark:bg-surface-dark border ${pos.isActive ? 'border-slate-200 dark:border-slate-800' : 'border-slate-200 bg-slate-50 opacity-75'} rounded-xl p-6 shadow-sm relative group`}>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => updateJobPosition(pos.id, { isActive: !pos.isActive })}
                                        className={`p-1 rounded ${pos.isActive ? 'text-green-600 bg-green-100' : 'text-slate-500 bg-slate-200'}`}
                                        title={pos.isActive ? 'Yayından Kaldır' : 'Yayına Al'}
                                    >
                                        <span className="material-symbols-outlined">{pos.isActive ? 'visibility' : 'visibility_off'}</span>
                                    </button>
                                    <button
                                        onClick={() => deleteJobPosition(pos.id)}
                                        className="p-1 rounded text-red-600 bg-red-100"
                                        title="Sil"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${pos.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                        {pos.isActive ? 'Yayında' : 'Pasif'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{pos.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {pos.location}</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {pos.type}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">{pos.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {pos.requirements.slice(0, 3).map((req, i) => (
                                        <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">{req}</span>
                                    ))}
                                    {pos.requirements.length > 3 && <span className="text-[10px] text-slate-400">+{pos.requirements.length - 3}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Application Detail Modal (Same as before) */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedApp(null)}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Başvuru Detayı: {selectedApp.fullName}</h3>
                            <button onClick={() => setSelectedApp(null)} className="text-slate-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div><label className="block text-xs text-slate-500 uppercase font-bold mb-1">Pozisyon</label><p className="dark:text-white font-medium">{selectedApp.position}</p></div>
                                <div><label className="block text-xs text-slate-500 uppercase font-bold mb-1">Email</label><p className="dark:text-white font-medium">{selectedApp.email}</p></div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs text-slate-500 uppercase font-bold mb-2">Ön Yazı</label>
                                <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl text-sm leading-relaxed">{selectedApp.coverLetter}</div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => setSelectedApp(null)} className="px-4 py-2 bg-primary text-black font-bold rounded-lg text-sm">Kapat</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Position Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Yeni Pozisyon Ekle</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Pozisyon Başlığı</label>
                                <input type="text" className="w-full rounded-lg border-slate-300 dark:bg-black/20" value={newPosition.title} onChange={e => setNewPosition({ ...newPosition, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Lokasyon</label>
                                    <input type="text" className="w-full rounded-lg border-slate-300 dark:bg-black/20" value={newPosition.location} onChange={e => setNewPosition({ ...newPosition, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Çalışma Tipi</label>
                                    <select className="w-full rounded-lg border-slate-300 dark:bg-black/20" value={newPosition.type} onChange={e => setNewPosition({ ...newPosition, type: e.target.value as any })}>
                                        <option value="Full-time">Tam Zamanlı</option>
                                        <option value="Part-time">Yarı Zamanlı</option>
                                        <option value="Remote">Uzaktan</option>
                                        <option value="Hybrid">Hibrit</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Açıklama</label>
                                <textarea rows={4} className="w-full rounded-lg border-slate-300 dark:bg-black/20" value={newPosition.description} onChange={e => setNewPosition({ ...newPosition, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Gereksinimler</label>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" className="flex-1 rounded-lg border-slate-300 dark:bg-black/20 text-sm" placeholder="Örn: 5 yıl tecrübe" value={reqInput} onChange={e => setReqInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddRequirement()} />
                                    <button onClick={handleAddRequirement} className="bg-slate-200 px-3 rounded-lg hover:bg-slate-300">+</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {newPosition.requirements?.map((req, idx) => (
                                        <span key={idx} className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                                            {req} <button onClick={() => removeRequirement(idx)} className="hover:text-red-500">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">İptal</button>
                                <button onClick={handleSavePosition} className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-green-600">Oluştur</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
