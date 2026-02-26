import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://studym.co.kr';

/**
 * Custom hook to update document head tags dynamically.
 * Works without react-helmet or extra dependencies.
 * 
 * canonical URL은 url 파라미터가 없으면 현재 pathname을 기반으로 자동 생성됩니다.
 * 이를 통해 Google Search Console의 "적절한 표준 태그가 포함된 대체 페이지" 문제를 방지합니다.
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

        // 현재 페이지의 정확한 URL 계산 (url이 없으면 pathname 기반 자동 생성)
        const pageUrl = url || `${BASE_URL}${window.location.pathname}`;

        // Open Graph Metadata
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute("content", title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute("content", description);

        if (ogImage) {
            const ogImg = document.querySelector('meta[property="og:image"]');
            if (ogImg) ogImg.setAttribute("content", ogImage);
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute("content", pageUrl);

        // Canonical URL 업데이트 (항상 현재 페이지 기준)
        const canonicalUrl = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
            canonicalUrl.setAttribute("href", pageUrl);
        }

        // Cleanup function (optional: restore default values upon unmounting)
        // Here we keep it simple by not resetting, assuming other pages will call useSEO
    }, [title, description, keywords, ogImage, url]);
}

/**
 * 모든 페이지에서 canonical URL을 자동 설정하는 간이 훅.
 * useSEO를 호출하지 않는 페이지에서도 canonical이 올바르게 설정됩니다.
 */
export function useCanonical() {
    const location = useLocation();

    useEffect(() => {
        const pageUrl = `${BASE_URL}${location.pathname}`;

        const canonicalUrl = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
            canonicalUrl.setAttribute("href", pageUrl);
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute("content", pageUrl);
    }, [location.pathname]);
}
