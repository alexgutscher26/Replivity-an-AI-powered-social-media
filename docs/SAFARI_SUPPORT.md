# Safari Extension Support

This extension now supports Safari through the WXT framework. Safari extensions require some additional steps for development and distribution.

## Development

### Building for Safari

```bash
# Development mode for Safari
npm run dev:safari
# or
bun run dev:safari

# Build for Safari
npm run build:safari
# or
bun run build:safari

# Create Safari extension package
npm run zip:safari
# or
bun run zip:safari
```

### Safari-Specific Considerations

1. **Manifest Version**: WXT automatically uses Manifest V2 for Safari builds (as Safari has limited MV3 support)
2. **API Limitations**: Some Chrome extension APIs may not be available or work differently in Safari
3. **Permissions**: Safari may require different permission declarations

## Converting to Safari App Extension

To distribute through the Mac App Store, you'll need to convert the web extension to a Safari App Extension:

```bash
# After building for Safari
npm run build:safari

# Convert to Safari App Extension (requires Xcode)
xcrun safari-web-extension-converter --bundle-identifier com.yourcompany.yourextension --force .output/safari-mv2
```

### Prerequisites

- macOS with Xcode installed
- Apple Developer account (for App Store distribution)
- Valid bundle identifier

### Testing Safari Extension

1. Build the extension for Safari
2. Convert using `xcrun safari-web-extension-converter`
3. Open the generated Xcode project
4. Build and run in Xcode
5. Enable "Show features for web developers" in Safari > Settings > Advanced
6. Enable "Allow unsigned extensions" in Safari > Settings > Developer
7. Enable your extension in Safari > Settings > Extensions

## API Compatibility

Some APIs work differently in Safari:

- **webRequest API**: Limited support in MV3, works better in MV2
- **Storage API**: Fully supported
- **Tabs API**: Most functionality supported
- **Runtime messaging**: Fully supported

## Browser Detection

You can detect Safari builds in your code:

```javascript
if (import.meta.env.BROWSER === 'safari') {
  // Safari-specific code
}

if (import.meta.env.SAFARI) {
  // Shorthand for Safari detection
}
```

## Distribution

### Mac App Store

1. Convert web extension to Safari App Extension
2. Configure in Xcode with proper bundle ID and team
3. Archive and submit through App Store Connect

### Direct Distribution

1. Build and sign the Safari App Extension
2. Distribute the `.app` file directly
3. Users need to enable unsigned extensions in Safari

## Troubleshooting

### Common Issues

1. **Extension not appearing**: Check Safari developer settings
2. **Build errors**: Ensure Xcode command line tools are installed
3. **API errors**: Check Safari extension API compatibility

### Debugging

1. Use Safari's Web Inspector for content scripts
2. Use Xcode's console for background script debugging
3. Check Safari's extension console in Developer menu

## Resources

- [WXT Safari Documentation](https://wxt.dev/guide/essentials/target-different-browsers)
- [Safari Extension Development Guide](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
- [Safari Extension API Reference](https://developer.apple.com/documentation/safariservices/safari_web_extensions/safari_web_extension_api_reference)
