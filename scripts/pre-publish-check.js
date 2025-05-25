#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 NPM 배포 전 체크리스트 검사 중...\n');

const errors = [];
const warnings = [];

// 1. 필수 파일 존재 확인
const requiredFiles = [
  'package.json',
  'README.md',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/styles.css'
];

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    errors.push(`❌ 필수 파일이 없습니다: ${file}`);
  } else {
    console.log(`✅ ${file}`);
  }
});

// 2. package.json 검사
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// 버전 체크
if (!packageJson.version || packageJson.version === '1.0.0') {
  warnings.push(`⚠️  버전이 기본값입니다: ${packageJson.version}`);
}

// 작성자 정보 체크
if (!packageJson.author || 
    (typeof packageJson.author === 'object' && packageJson.author.name === 'Your Name') ||
    (typeof packageJson.author === 'string' && packageJson.author === 'Your Name')) {
  errors.push('❌ author 정보를 실제 정보로 변경하세요');
}

// 리포지토리 정보 체크
if (!packageJson.repository || 
    packageJson.repository.url.includes('yourusername')) {
  errors.push('❌ repository URL을 실제 GitHub 주소로 변경하세요');
}

// 3. dist 폴더 크기 체크
const distStats = fs.statSync('dist');
if (distStats.isDirectory()) {
  const distFiles = fs.readdirSync('dist', { recursive: true });
  console.log(`📦 dist 폴더 파일 수: ${distFiles.length}`);
}

// 4. README.md에서 placeholder 체크
const readme = fs.readFileSync('README.md', 'utf8');
if (readme.includes('yourusername') || readme.includes('your-repo')) {
  warnings.push('⚠️  README.md에서 GitHub URL placeholders를 실제 주소로 변경하세요');
}

// 결과 출력
console.log('\n📋 검사 결과:');

if (errors.length > 0) {
  console.log('\n🚨 오류 (배포 전 반드시 수정):');
  errors.forEach(error => console.log(error));
}

if (warnings.length > 0) {
  console.log('\n⚠️  경고 (권장 수정사항):');
  warnings.forEach(warning => console.log(warning));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✨ 모든 검사 통과! 배포 준비 완료');
} else if (errors.length === 0) {
  console.log('✅ 필수 검사 통과! 경고사항 확인 후 배포 가능');
} else {
  console.log('❌ 오류 수정 후 다시 시도하세요');
  process.exit(1);
}

console.log('\n🚀 배포 명령어:');
console.log('npm login');
console.log('npm publish'); 