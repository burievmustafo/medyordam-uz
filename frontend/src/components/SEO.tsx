import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description = 'MedYordam - Shifokorlar uchun tez va ishonchli bemor tibbiy tarixini ko\'rish tizimi',
    keywords = 'medyordam, tibbiy yordam, bemor tarixi, shifokor, tez tibbiy yordam, uzbekistan, medical, emergency, patient history',
    image = 'https://medyordam.uz/og-image.png',
    url,
    type = 'website',
}) => {
    const { i18n } = useTranslation();
    const siteTitle = `${title} | MedYordam`;
    const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://medyordam.uz');
    const fullImageUrl = image.startsWith('http') ? image : `https://medyordam.uz${image}`;

    return (
        <Helmet htmlAttributes={{ lang: i18n.language }}>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <meta name='robots' content='index, follow' />
            
            {/* Canonical URL */}
            <link rel='canonical' href={canonicalUrl} />

            {/* Open Graph tags */}
            <meta property='og:type' content={type} />
            <meta property='og:title' content={siteTitle} />
            <meta property='og:description' content={description} />
            <meta property='og:image' content={fullImageUrl} />
            <meta property='og:image:width' content='1200' />
            <meta property='og:image:height' content='630' />
            <meta property='og:url' content={canonicalUrl} />
            <meta property='og:site_name' content='MedYordam' />
            <meta property='og:locale' content={i18n.language === 'uz' ? 'uz_UZ' : i18n.language === 'ru' ? 'ru_RU' : 'en_US'} />

            {/* Twitter tags */}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={siteTitle} />
            <meta name='twitter:description' content={description} />
            <meta name='twitter:image' content={fullImageUrl} />
        </Helmet>
    );
};
