const fs = require('fs');
const path = require('path');

console.log('🔧 브라우저용 번들 확인 중...');

const browserBundlePath = path.join(__dirname, '../dist/auto-init.browser.js');

// auto-init.browser.js가 이미 존재하는지 확인
if (fs.existsSync(browserBundlePath)) {
    console.log('✅ 브라우저용 번들이 이미 존재합니다: dist/auto-init.browser.js');
    
    // 파일 크기 확인
    const stats = fs.statSync(browserBundlePath);
    console.log(`📊 파일 크기: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // 파일 내용 확인 (첫 번째 줄)
    const content = fs.readFileSync(browserBundlePath, 'utf8');
    const firstLine = content.split('\n')[0];
    console.log(`📝 첫 번째 줄: ${firstLine.substring(0, 100)}...`);
    
    console.log('✅ 브라우저용 번들 준비 완료');
} else {
    console.error('❌ auto-init.browser.js 파일이 없습니다!');
    process.exit(1);
} 