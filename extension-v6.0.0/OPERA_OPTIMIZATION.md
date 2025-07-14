# Opera Extension Optimization Guide

This guide covers optimization strategies and best practices for developing high-performance extensions for Opera browser.

## Quick Start

### Development
```bash
# Start development server for Opera
npm run dev:opera

# Build for Opera
npm run build:opera

# Create Opera distribution package
npm run zip:opera
```

## Opera-Specific Optimizations

### 1. Chromium Compatibility

Opera is built on Chromium, which means it shares many features with Chrome and Edge. However, Opera has unique optimizations and features:

- **Built-in VPN**: Extensions should handle VPN-related network changes gracefully
- **Ad Blocker**: Consider compatibility with Opera's built-in ad blocker
- **Workspaces**: Optimize for Opera's workspace feature
- **Sidebar Integration**: Leverage Opera's sidebar capabilities
- **Flow Synchronization**: Support Opera's cross-device sync features

### 2. Performance Optimizations

#### Memory Efficiency
- Optimize for Opera's memory management system
- Use efficient data structures to minimize RAM usage
- Implement proper cleanup in background scripts
- Leverage Opera's tab hibernation features

#### CPU Optimization
- Use `requestIdleCallback` for non-critical operations
- Implement efficient event handling
- Minimize DOM manipulations in content scripts
- Optimize for Opera's performance monitoring

#### Network Efficiency
- Handle Opera's VPN state changes
- Implement request caching strategies
- Optimize for Opera's data compression features
- Consider Opera Turbo compatibility

### 3. Opera-Specific Features

#### Sidebar Integration
```javascript
// Detect Opera sidebar capabilities
const isOperaSidebar = window.location.search.includes('sidebar=true');

// Optimize UI for sidebar display
if (isOperaSidebar) {
  document.body.classList.add('opera-sidebar-mode');
}
```

#### Workspaces Support
```javascript
// Handle Opera workspace changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Optimize for workspace-specific behavior
  handleWorkspaceChange(activeInfo.tabId);
});
```

#### VPN Detection
```javascript
// Detect Opera VPN status
const detectOperaVPN = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    // Compare with expected IP to detect VPN usage
    return checkVPNStatus(data.ip);
  } catch (error) {
    console.warn('VPN detection failed:', error);
    return false;
  }
};
```

### 4. Manifest Optimization

Opera supports both Manifest V2 and V3, but V3 is recommended for new extensions:

```json
{
  "manifest_version": 3,
  "name": "Your Extension",
  "version": "1.0.0",
  "description": "Optimized for Opera",
  "permissions": [
    "activeTab",
    "storage"
  ],
  "host_permissions": [
    "https://*/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_idle"
  }],
  "web_accessible_resources": [{
    "resources": ["assets/*"],
    "matches": ["<all_urls>"]
  }]
}
```

### 5. UI/UX Optimizations

#### Opera Design Guidelines
- Follow Opera's design principles
- Use Opera-compatible color schemes
- Optimize for Opera's dark/light theme switching
- Ensure compatibility with Opera's zoom levels

#### Responsive Design
```css
/* Opera-specific responsive design */
@media (max-width: 400px) {
  .opera-sidebar {
    width: 100%;
    padding: 8px;
  }
}

/* Opera workspace optimization */
.opera-workspace-mode {
  transition: all 0.3s ease;
  transform-origin: top left;
}
```

## Development Best Practices

### 1. Browser Configuration

Create a `web-ext.config.ts` file for Opera-specific development:

```typescript
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  binaries: {
    opera: '/path/to/opera', // Path to Opera executable
  },
  chromiumArgs: [
    '--disable-extensions-except=./dist',
    '--load-extension=./dist',
    '--enable-opera-features'
  ]
});
```

### 2. Testing and Debugging

- Use Opera Developer Tools for debugging
- Test with Opera's VPN enabled/disabled
- Validate extension behavior in different workspaces
- Test sidebar integration if applicable
- Verify compatibility with Opera's built-in features

### 3. Cross-Browser Compatibility

```typescript
// Use WXT's browser abstraction for Opera compatibility
import { browser } from 'wxt/browser';

// This works across Chrome, Firefox, Safari, Edge, and Opera
const tabs = await browser.tabs.query({ active: true });

// Opera-specific feature detection
const isOpera = /OPR\//.test(navigator.userAgent);
if (isOpera) {
  // Opera-specific optimizations
  enableOperaFeatures();
}
```

## Performance Monitoring

### 1. Metrics to Track

- Extension startup time in Opera
- Memory usage patterns
- CPU utilization
- Network request efficiency
- VPN compatibility performance
- Workspace switching responsiveness

### 2. Optimization Techniques

```javascript
// Lazy loading for Opera performance
const loadOperaFeature = async () => {
  if (isOpera) {
    const { operaFeature } = await import('./opera-features.js');
    return operaFeature;
  }
  return null;
};

// Efficient event handling for Opera
const debouncedOperaHandler = debounce((event) => {
  // Handle Opera-specific events
  handleOperaEvent(event);
}, 300);

// Memory-efficient Opera integration
const operaObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      // Optimize for Opera's DOM changes
      optimizeForOpera(mutation.target);
    }
  });
});
```

## Opera Store Distribution

### 1. Opera Add-ons Store

- Opera extensions are distributed through the Opera Add-ons store
- Extensions must comply with Opera's review guidelines
- Support for Opera's unique features is recommended
- Ensure compatibility with Opera's security model

### 2. Submission Requirements

- Manifest V3 is preferred for new submissions
- Proper icon sizes (16x16, 32x32, 48x48, 128x128)
- Comprehensive description highlighting Opera-specific features
- Screenshots showing Opera integration
- Privacy policy if handling user data

### 3. Opera-Specific Marketing

- Highlight VPN compatibility
- Showcase sidebar integration
- Demonstrate workspace optimization
- Emphasize performance benefits

## Advanced Features

### 1. Opera Flow Integration

```javascript
// Sync data across Opera devices
const syncWithOperaFlow = async (data) => {
  try {
    await browser.storage.sync.set({
      operaFlowData: data,
      timestamp: Date.now()
    });
  } catch (error) {
    console.warn('Opera Flow sync failed:', error);
  }
};
```

### 2. Speed Dial Integration

```javascript
// Add to Opera Speed Dial
const addToSpeedDial = () => {
  if (isOpera) {
    // Opera-specific Speed Dial API (if available)
    chrome.runtime.sendMessage({
      action: 'addToSpeedDial',
      url: window.location.href,
      title: document.title
    });
  }
};
```

### 3. Opera Turbo Compatibility

```javascript
// Detect Opera Turbo mode
const detectOperaTurbo = () => {
  // Check for Opera Turbo indicators
  const isTurboMode = navigator.connection?.effectiveType === '2g' ||
                     navigator.connection?.saveData === true;
  
  if (isTurboMode) {
    // Optimize for reduced bandwidth
    enableLowBandwidthMode();
  }
};
```

## Troubleshooting

### Common Issues

1. **Extension not loading in Opera**
   - Verify Chromium compatibility
   - Check manifest.json syntax
   - Validate permissions

2. **VPN-related issues**
   - Handle network state changes
   - Implement proper error handling
   - Test with VPN enabled/disabled

3. **Sidebar integration problems**
   - Check responsive design
   - Validate CSS for narrow widths
   - Test sidebar-specific functionality

4. **Performance issues**
   - Profile memory usage
   - Optimize for Opera's performance features
   - Review background script efficiency

### Debug Commands

```bash
# Build with source maps for debugging
npm run build:opera -- --mode development

# Analyze bundle size for Opera
npm run build:opera -- --analyze

# Test Opera-specific features
npm run dev:opera -- --opera-features
```

## Security Considerations

### 1. Opera VPN Security

- Handle encrypted traffic appropriately
- Respect user privacy with VPN enabled
- Implement proper certificate validation
- Consider geo-location implications

### 2. Content Security Policy

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; connect-src https: wss:;"
  }
}
```

### 3. Permission Management

- Request minimal necessary permissions
- Explain permission usage to users
- Handle permission changes gracefully
- Respect Opera's privacy features

## Resources

- [Opera Extensions Documentation](https://dev.opera.com/extensions/)
- [Opera Add-ons Developer Portal](https://addons.opera.com/developer/)
- [WXT Framework Documentation](https://wxt.dev/)
- [Chromium Extension APIs](https://developer.chrome.com/docs/extensions/reference/)
- [Opera Developer Blog](https://blogs.opera.com/desktop/)

## Next Steps

1. Run `npm run build:opera` to create an optimized Opera build
2. Test the extension in Opera using `npm run dev:opera`
3. Validate Opera-specific features and performance
4. Submit to Opera Add-ons store when ready

This optimization guide ensures your extension performs optimally on Opera while leveraging its unique features and maintaining cross-browser compatibility.