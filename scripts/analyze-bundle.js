#!/usr/bin/env node

/**
 * سكريبت لتحليل حجم الحزمة وعرض النتائج بشكل واضح
 * 
 * الاستخدام:
 * node scripts/analyze-bundle.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 تحليل حجم الحزمة...\n');

// قراءة ملف البناء
const buildManifestPath = path.join(__dirname, '../.next/build-manifest.json');

if (!fs.existsSync(buildManifestPath)) {
    console.error('❌ لم يتم العثور على ملف البناء. قم بتشغيل npm run build أولاً.');
    process.exit(1);
}

try {
    const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));

    console.log('📦 الصفحات المبنية:');
    console.log('─'.repeat(50));

    Object.keys(manifest.pages).forEach(page => {
        const files = manifest.pages[page];
        console.log(`\n📄 ${page}`);
        console.log(`   الملفات: ${files.length}`);
    });

    console.log('\n' + '─'.repeat(50));
    console.log('\n✅ لعرض تحليل مفصل، قم بتشغيل:');
    console.log('   npm run build:analyze');
    console.log('\n📊 ثم افتح الملفات في مجلد analyze/');

} catch (error) {
    console.error('❌ خطأ في قراءة ملف البناء:', error.message);
    process.exit(1);
}
