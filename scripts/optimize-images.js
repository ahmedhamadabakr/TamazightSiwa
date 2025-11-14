#!/usr/bin/env node

/**
 * سكريبت تحسين الصور تلقائياً
 * يحول جميع صور JPG/PNG إلى WebP
 */

const fs = require('fs');
const path = require('path');

console.log('🖼️  سكريبت تحسين الصور\n');

// التحقق من وجود Sharp
let sharp;
try {
    sharp = require('sharp');
    console.log('✅ Sharp مثبت ومتاح\n');
} catch (error) {
    console.log('❌ Sharp غير مثبت!');
    console.log('📦 قم بتثبيته باستخدام: npm install sharp\n');
    process.exit(1);
}

const publicDir = path.join(__dirname, '../public');

// قائمة الصور المستهدفة للتحسين
const targetImages = [
    'siwa-oasis-photography-golden-hour-palm-trees.jpg',
    'siwa-oasis-natural-springs-with-turquoise-water-an.jpg'
];

console.log('🎯 الصور المستهدفة:');
targetImages.forEach(img => console.log(`   - ${img}`));
console.log('');

let successCount = 0;
let errorCount = 0;

// معالجة كل صورة
targetImages.forEach(async (filename) => {
    const inputPath = path.join(publicDir, filename);
    const outputFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(publicDir, outputFilename);

    // التحقق من وجود الملف
    if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  الملف غير موجود: ${filename}`);
        errorCount++;
        return;
    }

    try {
        // الحصول على معلومات الصورة الأصلية
        const metadata = await sharp(inputPath).metadata();
        const originalSize = fs.statSync(inputPath).size;

        console.log(`\n📸 معالجة: ${filename}`);
        console.log(`   الحجم الأصلي: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`   الأبعاد: ${metadata.width}x${metadata.height}`);

        // تحويل إلى WebP
        await sharp(inputPath)
            .webp({
                quality: 85,
                effort: 6 // أعلى جودة ضغط (0-6)
            })
            .toFile(outputPath);

        const newSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

        console.log(`   ✅ تم التحويل إلى: ${outputFilename}`);
        console.log(`   الحجم الجديد: ${(newSize / 1024).toFixed(2)} KB`);
        console.log(`   التوفير: ${savings}% (${((originalSize - newSize) / 1024).toFixed(2)} KB)`);

        successCount++;
    } catch (error) {
        console.log(`   ❌ خطأ في معالجة ${filename}:`, error.message);
        errorCount++;
    }
});

// انتظر قليلاً ثم اطبع الملخص
setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('📊 ملخص النتائج:');
    console.log(`   ✅ نجح: ${successCount}`);
    console.log(`   ❌ فشل: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

    if (successCount > 0) {
        console.log('🎉 تم تحسين الصور بنجاح!');
        console.log('📝 لا تنسى تحديث الكود لاستخدام ملفات .webp\n');
    }
}, 2000);
