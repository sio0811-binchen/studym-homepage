import { useEffect } from 'react';

/**
 * Custom hook to update document head tags dynamically.
 * Works without react-helmet or extra dependencies.
 */
export function useSEO({ title, description, keywords, ogImage, url }: {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    url?: string;
}) {
    useEffect(() => {
        // Document Title
        document.title = title;

        // Meta Description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", description);
        }

        // Meta Keywords
        if (keywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute("content", keywords);
            }
        }

        // Open Graph Metadata
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute("content", description);

        if (ogImage) {
            const ogImg = document.querySelector('meta[property="og:image"]');
            if (ogImg) ogImg.setAttribute("content", ogImage);
        }

        if (url) {
            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.setAttribute("content", url);

            const canonicalUrl = document.querySelector('link[rel="canonical"]');
            if (canonicalUrl) canonicalUrl.setAttribute("href", url);
        }

        // Cleanup function (optional: restore default values upon unmounting)
        // Here we keep it simple by not resetting, assuming other pages will call useSEO
    }, [title, description, keywords, ogImage, url]);
}
