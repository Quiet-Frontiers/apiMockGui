"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const client_1 = require("react-dom/client");
const FloatingApiMockManager_1 = require("./components/FloatingApiMockManager");
// Global variables
let isInitialized = false;
let containerElement = null;
let reactRoot = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 10;
// Auto-initialization function
const initFloatingButton = () => {
    if (isInitialized)
        return;
    // Browser environment check
    if (typeof window === 'undefined')
        return;
    // Increment attempt counter
    initAttempts++;
    // Development environment check (localhost, 127.0.0.1, ports)
    const isDevelopment = window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1') ||
        window.location.hostname.includes('192.168.') ||
        window.location.port !== '' ||
        window.location.hostname === '';
    // Skip initialization if not in development
    if (!isDevelopment) {
        console.log('🔒 API Mock GUI auto-activation is limited to development environment.');
        return;
    }
    try {
        // Wait for React to be available
        if (typeof react_1.default === 'undefined' || typeof client_1.default === 'undefined') {
            if (initAttempts < MAX_INIT_ATTEMPTS) {
                console.log(`⏳ Waiting for React to load... (attempt ${initAttempts}/${MAX_INIT_ATTEMPTS})`);
                setTimeout(initFloatingButton, 500);
                return;
            }
            else {
                console.error('❌ React not available after maximum attempts');
                return;
            }
        }
        // Check if container already exists (prevent duplicate initialization)
        const existingContainer = document.getElementById('api-mock-gui-floating-container');
        if (existingContainer) {
            console.log('🔄 Floating button container already exists, skipping initialization');
            isInitialized = true;
            return;
        }
        // Create container element
        containerElement = document.createElement('div');
        containerElement.id = 'api-mock-gui-floating-container';
        containerElement.setAttribute('data-api-mock-floating-button', 'true');
        containerElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;
        // Wait for document.body to be available
        if (!document.body) {
            if (initAttempts < MAX_INIT_ATTEMPTS) {
                console.log(`⏳ Waiting for document.body... (attempt ${initAttempts}/${MAX_INIT_ATTEMPTS})`);
                setTimeout(initFloatingButton, 100);
                return;
            }
            else {
                console.error('❌ document.body not available after maximum attempts');
                return;
            }
        }
        document.body.appendChild(containerElement);
        // Create React root with better error handling
        if (typeof client_1.default.createRoot === 'function') {
            reactRoot = client_1.default.createRoot(containerElement);
        }
        else {
            // Fallback for older React versions
            reactRoot = {
                render: (element) => {
                    client_1.default.render(element, containerElement);
                }
            };
        }
        // Render FloatingApiMockManager
        const floatingManager = react_1.default.createElement(FloatingApiMockManager_1.FloatingApiMockManager, {
            serverConfig: {
                baseUrl: window.location.origin,
                environment: 'browser'
            },
            position: 'bottom-right',
            buttonText: 'API Mock',
            autoStart: false, // Changed to false for better control
            draggable: true,
            minimizable: true,
            onServerStart: () => {
                console.log('🎭 API Mock Server started!');
            },
            onServerStop: () => {
                console.log('🛑 API Mock Server stopped.');
            }
        });
        reactRoot.render(floatingManager);
        isInitialized = true;
        console.log('🎭 API Mock GUI Floating Button auto-initialized!');
        console.log('💡 Click the floating button at bottom-right to use.');
    }
    catch (error) {
        console.error('API Mock GUI auto-initialization failed:', error);
        // Retry on error (with limit)
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            console.log(`🔄 Retrying initialization in 1 second... (attempt ${initAttempts}/${MAX_INIT_ATTEMPTS})`);
            setTimeout(initFloatingButton, 1000);
        }
    }
};
// Multiple initialization strategies for better reliability
if (typeof window !== 'undefined') {
    // Strategy 1: Immediate if DOM is ready
    if (document.readyState === 'complete') {
        setTimeout(initFloatingButton, 50);
    }
    // Strategy 2: On DOM content loaded
    else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initFloatingButton, 50);
        });
    }
    // Strategy 3: On window load (fallback)
    else {
        setTimeout(initFloatingButton, 100);
    }
    // Strategy 4: Additional window load listener for safety
    window.addEventListener('load', () => {
        if (!isInitialized) {
            setTimeout(initFloatingButton, 100);
        }
    });
    // Provide global functions
    window.apiMockGuiInit = () => {
        initAttempts = 0; // Reset attempts for manual init
        initFloatingButton();
    };
    window.apiMockGuiCleanup = () => {
        if (!isInitialized)
            return;
        try {
            if (reactRoot && reactRoot.unmount) {
                reactRoot.unmount();
            }
            if (containerElement && containerElement.parentNode) {
                containerElement.parentNode.removeChild(containerElement);
            }
            isInitialized = false;
            containerElement = null;
            reactRoot = null;
            initAttempts = 0;
            console.log('🧹 API Mock GUI cleaned up.');
        }
        catch (error) {
            console.error('API Mock GUI cleanup failed:', error);
        }
    };
}
