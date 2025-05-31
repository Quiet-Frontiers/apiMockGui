const fs = require('fs');
const path = require('path');

console.log('🔧 브라우저용 UMD 번들 생성 중...');

const autoInitPath = path.join(__dirname, '../dist/auto-init.js');
const autoInitContent = fs.readFileSync(autoInitPath, 'utf8');

// ES6 모듈을 UMD 형태로 변경
const umdContent = `
(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS
        factory(exports, require('react'), require('react-dom'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['exports', 'react', 'react-dom'], factory);
    } else {
        // 브라우저 전역
        var globalThis = global || self;
        factory({}, globalThis.React, globalThis.ReactDOM);
    }
})(this, (function (exports, React, ReactDOM) {
    'use strict';

    // 원본 auto-init 코드를 수정하여 전역 React 사용
    ${autoInitContent
        .replace(/import React from 'react';/g, '// React는 전역에서 사용')
        .replace(/import ReactDOM from 'react-dom\/client';/g, '// ReactDOM은 전역에서 사용')
        .replace(/import { FloatingApiMockManager } from.*?;/g, '// FloatingApiMockManager 인라인')}

}));
`;

// 브라우저용 파일 저장
const browserPath = path.join(__dirname, '../dist/auto-init.browser.js');
fs.writeFileSync(browserPath, umdContent);

console.log('✅ 브라우저용 UMD 번들 생성 완료: dist/auto-init.browser.js'); 