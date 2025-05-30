"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockServer = exports.useMockApiStore = exports.FloatingApiMockManager = void 0;
// 자동 초기화 - 라이브러리 import 시 자동으로 floating button 생성
require("./auto-init");
// 핵심 컴포넌트만 export
var FloatingApiMockManager_1 = require("./components/FloatingApiMockManager");
Object.defineProperty(exports, "FloatingApiMockManager", { enumerable: true, get: function () { return FloatingApiMockManager_1.FloatingApiMockManager; } });
// 필수 유틸리티
var useMockApiStore_1 = require("./hooks/useMockApiStore");
Object.defineProperty(exports, "useMockApiStore", { enumerable: true, get: function () { return useMockApiStore_1.useMockApiStore; } });
var mockServer_1 = require("./mock/mockServer");
Object.defineProperty(exports, "MockServer", { enumerable: true, get: function () { return mockServer_1.MockServer; } });
// 스타일
require("./styles/globals.css");
