
import React from 'react';
import { useData } from '../../services/dataProvider';

export const VisionMissionPage: React.FC = () => {
    const { siteContent } = useData();

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20 pt-10">
             <div className="max-w-[1400px] mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white dark:bg-surface-dark rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col h-full">
                         <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                             <span className="material-symbols-outlined text-4xl">visibility</span>
                         </div>
                         <h2 className="text-3xl font-black font-display mb-6">Vizyonumuz</h2>
                         <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 flex-1">
                             {siteContent.visionText || "İçerik hazırlanıyor..."}
                         </p>
                     </div>

                     <div className="bg-white dark:bg-surface-dark rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col h-full">
                         <div className="size-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 mb-6">
                             <span className="material-symbols-outlined text-4xl">flag</span>
                         </div>
                         <h2 className="text-3xl font-black font-display mb-6">Misyonumuz</h2>
                         <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 flex-1">
                             {siteContent.missionText || "İçerik hazırlanıyor..."}
                         </p>
                     </div>
                 </div>
             </div>
        </div>
    );
};
