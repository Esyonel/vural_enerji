import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    schema
}) => {
    const siteTitle = 'Vural Enerji';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    const defaultImage = 'https://images.unsplash.com/photo-1545208942-e94b2b7c6245?q=80&w=2572&auto=format&fit=crop'; // High quality solar image as default
    const metaImage = image || defaultImage;
    const metaUrl = url || window.location.href;
    const metaDescription = description || 'Vural Enerji - Profesyonel Güneş Enerjisi Sistemleri ve Yenilenebilir Enerji Çözümleri. Anahtar teslim GES projeleri, invertör, panel satışı ve mühendislik hizmetleri.';

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={metaUrl} />
            <meta name="robots" content="index, follow" />
            <meta name="author" content="Vural Enerji" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:locale" content="tr_TR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@vuralenerji" />
            <meta name="twitter:creator" content="@vuralenerji" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Structured Data (JSON-LD) for Rich Snippets */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};
