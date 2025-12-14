import React from 'react';
import { useData } from '../../services/dataProvider';
import { Link } from 'react-router-dom';
import { SEO } from '../SEO';

export const ProjectsPage: React.FC = () => {
    const { projects } = useData();

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
            <SEO
                title="Tamamlanan Projeler ve Referanslar"
                description="Vural Enerji olarak Türkiye genelinde tamamladığımız güneş enerjisi santralleri, çatı GES projeleri ve tarımsal sulama sistemleri."
                keywords="referanslar, tamamlanan projeler, ges kurulumları, güneş santrali örnekleri"
            />
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto pt-10">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white font-display mb-6">
                        Tamamlanan <span className="text-primary">Projelerimiz</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Türkiye'nin dört bir yanında kurduğumuz güneş enerjisi santralleri ve referanslarımızla gurur duyuyoruz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-white dark:bg-[#152018] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{project.location}</span>
                                        <span className="flex items-center gap-1 text-sm font-medium"><span className="material-symbols-outlined text-[18px]">calendar_today</span> {project.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold font-display leading-tight">{project.title}</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                                    <span className="material-symbols-outlined">bolt</span>
                                    <span>{project.capacity} Kurulu Güç</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    {project.description}
                                </p>
                                <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                                        Detaylı Bilgi Al
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="bg-white dark:bg-[#0c180e] border-t border-gray-200 dark:border-white/5 pt-16 pb-8 mt-20 rounded-3xl">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">© 2024 Vural Enerji. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
