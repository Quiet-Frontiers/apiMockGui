# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.8] - 2024-12-19

### 🐛 Bug Fixes
- **Fixed CSS Import Error**: Removed problematic CSS import requirement - styles are now automatically included via inline CSS
- **Fixed GUI Button Issues**: Resolved button click events not working in FloatingApiMockManager
  - Added explicit `pointerEvents: 'auto'` to all interactive elements
  - Improved event handling with `preventDefault()` and `stopPropagation()`
  - Added console logging for debugging button interactions
- **Improved Event Handling**: Enhanced click handlers for Start/Stop, Add API, Save, and Cancel buttons
- **Updated Documentation**: Removed CSS import instructions from README and USAGE_GUIDE

### 📦 Package Exports
- **Fixed CSS Export**: Simplified CSS export paths in package.json for better compatibility
- **Inline Styles**: CSS is now automatically injected via JavaScript, eliminating import issues

### 🔧 Technical Improvements
- Enhanced auto-init.ts with better CSS loading mechanism
- Improved FloatingApiMockManager component with explicit pointer-events
- Better error handling and logging for debugging

## [2.0.7] - 2024-12-19

### 🚀 Major Enhancement
- **BREAKING IMPROVEMENT**: Automatic interception of ALL axios instances (default + created)
- **Zero Configuration**: Now truly works with any axios setup without additional configuration
- **Smart Instance Tracking**: Automatically tracks `axios.create()` instances
- **Universal Coverage**: Both existing and future axios instances are automatically mocked

### 🔧 Technical Improvements
- **Enhanced MockServer**: Overrides `axios.create` to track all instances
- **Multi-Instance Support**: Applies mock handlers to all tracked axios instances
- **Better Logging**: Shows count of intercepted axios instances
- **Improved Cleanup**: Properly restores all axios instances when stopped

### 📚 Documentation Updates
- **Clarified Usage**: Updated README and USAGE_GUIDE to reflect automatic axios interception
- **Added FAQ**: Common questions about axios-mock-adapter setup (spoiler: none needed!)
- **Better Examples**: Showcased various axios instance patterns that work automatically

## [2.0.6] - 2024-12-19

### 🐛 Fixed
- **Critical**: Fixed GUI button click issues - converted FloatingButton from `<div>` to `<button>`
- **Critical**: Fixed Add API, Close, and Minimize buttons not responding to clicks
- **Important**: Improved event handling with `preventDefault()` and `stopPropagation()`
- **Important**: Fixed drag and click event conflicts
- **UI**: Added proper `outline: none` to all buttons for better styling

### 📚 Improved
- **Documentation**: Completely rewrote README.md with step-by-step usage guide
- **Documentation**: Enhanced USAGE_GUIDE.md with detailed 6-step getting started guide
- **Documentation**: Added comprehensive troubleshooting section
- **UX**: Clarified that CSS import is mandatory
- **UX**: Emphasized axios-only support (fetch API not supported)

### ✨ Added
- **Feature**: Auto CSS loading attempt in auto-init
- **Documentation**: Step-by-step GUI usage instructions
- **Documentation**: Common problems and solutions guide
- **Documentation**: Environment detection troubleshooting

## [2.0.5] - 2024-12-18

### ✨ Added
- Enhanced environment detection for development mode
- Improved auto-initialization reliability
- Better error handling and retry logic

### 🎨 Improved
- Modern floating button design with Database icon
- Smooth animations and hover effects
- Better visual feedback for server status

## [2.0.4] - 2024-12-17

### 🐛 Fixed
- Fixed React version compatibility issues
- Improved container element creation
- Better cleanup on component unmount

## [2.0.3] - 2024-12-16

### ✨ Added
- Auto-initialization feature
- Floating button with modern design
- Global control functions

## [2.0.2] - 2024-12-15

### 🎨 UI/UX Improvements
- New icon combination (Database + Zap)
- Gradient backgrounds and enhanced shadows
- Smooth scaling animations and glow effects
- Smart tooltips with status information
- Larger button size (60x60px) for easier clicking

### 🔧 Feature Improvements
- Enhanced environment detection (Vite, Webpack, DevTools)
- Force activation options
- Korean console messages
- Better initialization retry logic
- Improved error handling

## [2.0.1] - 2024-12-14

### 🐛 Fixed
- Fixed TypeScript type definitions
- Improved package exports
- Better CSS handling

## [2.0.0] - 2024-12-13

### 🎉 Major Release
- Complete rewrite with modern React architecture
- axios-mock-adapter integration
- Beautiful GUI with Tailwind CSS
- Multiple response cases support
- Real-time server control
- TypeScript support throughout

### ✨ Features
- **Zero Configuration**: Just import and use
- **Auto-initialization**: Floating button appears automatically
- **Modern UI**: Beautiful, responsive interface
- **Real-time Updates**: Changes take effect immediately
- **Multiple Response Cases**: Different scenarios per API
- **Development Focus**: Auto-detects development environment

### 🔧 Technical
- Built with React 18+ and TypeScript
- Uses axios-mock-adapter for request interception
- Tailwind CSS for styling
- Modular architecture with hooks
- Comprehensive error handling

## [1.0.0] - 2024-12-01

### 🎉 Initial Release
- Basic API mocking functionality
- Simple GUI interface
- Manual configuration required 