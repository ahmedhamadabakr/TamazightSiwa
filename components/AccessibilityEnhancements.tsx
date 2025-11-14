'use client';

import { useEffect } from 'react';

/**
 * مكون تحسينات إمكانية الوصول (Accessibility Enhancements)
 * يضيف تحسينات تلقائية لإمكانية الوصول في جميع أنحاء التطبيق
 */
export function AccessibilityEnhancements() {
    useEffect(() => {
        // إضافة skip link للانتقال السريع للمحتوى الرئيسي
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // إضافة aria-label للروابط الخارجية
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach((link) => {
            if (!link.getAttribute('aria-label') && !link.getAttribute('title')) {
                const text = link.textContent?.trim();
                if (text) {
                    link.setAttribute('aria-label', `${text} (opens in new tab)`);
                }
            }
        });

        // تحسين focus indicators
        const style = document.createElement('style');
        style.textContent = `
      *:focus-visible {
        outline: 2px solid #D4A574;
        outline-offset: 2px;
      }
      
      button:focus-visible,
      a:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid #D4A574;
        outline-offset: 2px;
      }
    `;
        document.head.appendChild(style);

        return () => {
            if (skipLink.parentNode) {
                skipLink.parentNode.removeChild(skipLink);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, []);

    return null;
}
