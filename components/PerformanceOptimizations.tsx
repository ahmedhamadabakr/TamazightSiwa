'use client';

import { useEffect } from 'react';

/**
 * تحسينات الأداء الشاملة
 * Performance Optimizations Component
 */
export function PerformanceOptimizations() {
    useEffect(() => {
        // Preload critical fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreload);

        // Lazy load images with Intersection Observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach((img) => {
                imageObserver.observe(img);
            });
        }

        // Prefetch next pages on hover
        const prefetchLinks = () => {
            const links = document.querySelectorAll('a[href^="/"]');
            links.forEach((link) => {
                link.addEventListener('mouseenter', () => {
                    const href = link.getAttribute('href');
                    if (href && !document.querySelector(`link[href="${href}"]`)) {
                        const prefetch = document.createElement('link');
                        prefetch.rel = 'prefetch';
                        prefetch.href = href;
                        document.head.appendChild(prefetch);
                    }
                }, { once: true });
            });
        };

        prefetchLinks();
    }, []);

    return null;
}
