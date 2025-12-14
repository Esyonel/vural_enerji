
import React from 'react';
import { useData } from '../../services/dataProvider';
import { SEO } from '../SEO';

export const AboutPage: React.FC = () => {
    const { siteContent } = useData();

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-20 pt-10">
            <SEO title="Hakkımızda" description="Vural Enerji hakkında bilgi edinin. Vizyonumuz, misyonumuz ve yenilenebilir enerji sektöründeki deneyimimiz." />
            <div className="max-w-[1400px] mx-auto">
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 dark:border-white/5">
                    <h1 className="text-4xl md:text-5xl font-black font-display mb-8">Hakkımızda</h1>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">
                            {siteContent.aboutText || "İçerik hazırlanıyor..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
