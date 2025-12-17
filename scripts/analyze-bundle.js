#!/usr/bin/env node

/**
 * Script to analyze bundle size and display results clearly.
 *
 * Usage:
 * node scripts/analyze-bundle.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

// Read the build manifest file
const buildManifestPath = path.join(__dirname, '../.next/build-manifest.json');

if (!fs.existsSync(buildManifestPath)) {
    console.error('❌ Build manifest not found. Run `npm run build` first.');
    process.exit(1);
}

try {
    const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));

    console.log('📦 Built Pages:');
    console.log('─'.repeat(50));

    Object.keys(manifest.pages).forEach(page => {
        const files = manifest.pages[page];
        console.log(`\n📄 ${page}`);
        console.log(`   Files: ${files.length}`);
    });

    console.log('\n' + '─'.repeat(50));
    console.log('\n✅ For a detailed analysis, run:');
    console.log('   npm run build:analyze');
    console.log('\n📊 Then open the files in the analyze/ folder');

} catch (error) {
    console.error('❌ Error reading build manifest:', error.message);
    process.exit(1);
}
