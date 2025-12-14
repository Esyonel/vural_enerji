import React, { useState } from 'react';
import { useData } from '../../services/dataProvider';
import { Project } from '../../types';

export const ProjectsAdmin: React.FC = () => {
    const { projects, deleteProject, addProject, updateProject } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const initialFormState: Omit<Project, 'id'> = {
        title: '',
        location: '',
        capacity: '',
        date: new Date().getFullYear().toString(),
        imageUrl: '',
        description: ''
    };

    const [formData, setFormData] = useState<Omit<Project, 'id'>>(initialFormState);

    const handleOpenModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            const { id, ...rest } = project;
            setFormData(rest);
        } else {
            setEditingProject(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProject) {
            await updateProject(editingProject.id, formData);
        } else {
            await addProject(formData);
        }
        setIsModalOpen(false);
        setEditingProject(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Proje Yönetimi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Tamamlanan projeleri ve referansları yönetin.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-black rounded-lg px-5 h-11 transition-colors shadow-sm font-bold"
                >
                    <span className="material-symbols-outlined">add_photo_alternate</span>
                    <span>Yeni Proje Ekle</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm group">
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button onClick={() => handleOpenModal(project)} className="p-2 bg-white rounded-full hover:bg-primary transition-colors">
                                    <span className="material-symbols-outlined text-black">edit</span>
                                </button>
                                <button onClick={() => deleteProject(project.id)} className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{project.title}</h3>
                                <span className="text-xs font-bold bg-primary/20 text-green-800 dark:text-primary px-2 py-1 rounded">{project.date}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{project.location}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">bolt</span>{project.capacity}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white dark:bg-[#1a2e22] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-black/20">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proje Başlığı</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Konum</label>
                                    <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kurulu Güç</label>
                                    <input required type="text" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tarih (Yıl)</label>
                                    <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Görsel URL</label>
                                    <input required type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20" placeholder="https://..." />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Açıklama</label>
                                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20"></textarea>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                                    İptal
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary hover:bg-green-600 text-black font-bold transition-colors shadow-lg shadow-primary/20">
                                    {editingProject ? 'Değişiklikleri Kaydet' : 'Projeyi Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};