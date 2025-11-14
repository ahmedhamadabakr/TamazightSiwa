#!/usr/bin/env node

/**
 * سكريبت للتحقق من تحسينات Lighthouse
 * يفحص الملفات للتأكد من تطبيق جميع التحسينات
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 فحص تحسينات Lighthouse...\n');

const checks = {
    accessibility: {
        name: 'إمكانية الوصول (Accessibility)',
        tests: []
    },
    seo: {
        name: 'SEO',
        tests: []
    },
    performance: {
        name: 'الأداء (Performance)',
        tests: []
    }
};

// فحص alt text في الصور
function checkAltText() {
    const files = [
        'components/navigation.tsx',
        'components/navigation/FastNavigation.tsx',
        'app/login/page.tsx',
        'app/register/page.tsx'
    ];

    let passed = true;
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const imageMatches = content.match(/<Image[^>]*>/g) || [];

        imageMatches.forEach(match => {
            if (!match.includes('alt=')) {
                console.log(`❌ صورة بدون alt text في ${file}`);
                passed = false;
            }
        });
    });

    checks.accessibility.tests.push({
        name: 'Alt text للصور',
        passed
    });
}

// فحص aria-labels
function checkAriaLabels() {
    const files = [
        'components/navigation.tsx',
        'components/navigation/FastNavigation.tsx'
    ];

    let passed = true;
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        // فحص الأزرار التي تحتوي على أيقونات فقط
        const buttonMatches = content.match(/<Button[^>]*>[\s\S]*?<\/Button>/g) || [];

        buttonMatches.forEach(match => {
            if (match.includes('<Menu') || match.includes('<X') || match.includes('<User')) {
                if (!match.includes('aria-label')) {
                    console.log(`⚠️  زر بدون aria-label في ${file}`);
                    passed = false;
                }
            }
        });
    });

    checks.accessibility.tests.push({
        name: 'ARIA labels للأزرار',
        passed
    });
}

// فحص SEO enhancements
function checkSEOEnhancements() {
    const seoFile = 'components/SEOEnhancements.tsx';
    const pageFile = 'app/page.tsx';

    let passed = true;

    if (!fs.existsSync(seoFile)) {
        console.log(`❌ ملف ${seoFile} غير موجود`);
        passed = false;
    }

    const pageContent = fs.readFileSync(pageFile, 'utf8');
    if (!pageContent.includes('SEOEnhancements')) {
        console.log(`❌ SEOEnhancements غير مستورد في ${pageFile}`);
        passed = false;
    }

    checks.seo.tests.push({
        name: 'مكون SEO Enhancements',
        passed
    });
}

// فحص Accessibility enhancements
function checkAccessibilityEnhancements() {
    const a11yFile = 'components/AccessibilityEnhancements.tsx';
    const pageFile = 'app/page.tsx';

    let passed = true;

    if (!fs.existsSync(a11yFile)) {
        console.log(`❌ ملف ${a11yFile} غير موجود`);
        passed = false;
    }

    const pageContent = fs.readFileSync(pageFile, 'utf8');
    if (!pageContent.includes('AccessibilityEnhancements')) {
        console.log(`❌ AccessibilityEnhancements غير مستورد في ${pageFile}`);
        passed = false;
    }

    checks.accessibility.tests.push({
        name: 'مكون Accessibility Enhancements',
        passed
    });
}

// فحص Performance optimizations
function checkPerformanceOptimizations() {
    const perfFile = 'components/PerformanceOptimizations.tsx';
    const pageFile = 'app/page.tsx';

    let passed = true;

    if (!fs.existsSync(perfFile)) {
        console.log(`❌ ملف ${perfFile} غير موجود`);
        passed = false;
    }

    const pageContent = fs.readFileSync(pageFile, 'utf8');
    if (!pageContent.includes('PerformanceOptimizations')) {
        console.log(`❌ PerformanceOptimizations غير مستورد في ${pageFile}`);
        passed = false;
    }

    checks.performance.tests.push({
        name: 'مكون Performance Optimizations',
        passed
    });
}

// تشغيل جميع الفحوصات
checkAltText();
checkAriaLabels();
checkSEOEnhancements();
checkAccessibilityEnhancements();
checkPerformanceOptimizations();

// طباعة النتائج
console.log('\n📊 نتائج الفحص:\n');

Object.keys(checks).forEach(category => {
    const { name, tests } = checks[category];
    console.log(`\n${name}:`);

    tests.forEach(test => {
        const icon = test.passed ? '✅' : '❌';
        console.log(`  ${icon} ${test.name}`);
    });
});

// حساب النسبة المئوية
const totalTests = Object.values(checks).reduce((sum, cat) => sum + cat.tests.length, 0);
const passedTests = Object.values(checks).reduce((sum, cat) =>
    sum + cat.tests.filter(t => t.passed).length, 0
);
const percentage = Math.round((passedTests / totalTests) * 100);

console.log(`\n\n🎯 النتيجة الإجمالية: ${passedTests}/${totalTests} (${percentage}%)\n`);

if (percentage === 100) {
    console.log('🎉 ممتاز! جميع التحسينات مطبقة بنجاح!\n');
} else {
    console.log('⚠️  بعض التحسينات تحتاج إلى مراجعة.\n');
    process.exit(1);
}
