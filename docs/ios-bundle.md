# Lynx iOS Bundle Format

> A technical overview of the Lynx binary bundle format for iOS applications

## Introduction

The Lynx framework requires a special binary format for JavaScript bundles running on iOS. Unlike standard JavaScript files, Lynx bundles include specific headers, metadata, and checksums that allow the Lynx runtime to efficiently load, validate, and execute the code.

This document describes the format specification and our implementation of a bundling tool that correctly prepares JavaScript files for the Lynx iOS runtime.

## Bundle Structure

A Lynx iOS bundle consists of:

1. **Magic Header** - Identifies the file as a Lynx bundle
2. **Metadata Section** - Contains version, platform, and format information
3. **Content Size and Hash** - For validation and integrity checking
4. **JavaScript Content** - The actual code to be executed

### Binary Format Specification

The overall structure follows this format:

```
+------------------------+
|  Magic Header (8 bytes) |
+------------------------+
| Version Info (4 bytes) |
+------------------------+
| Platform ID (4 bytes)  |
+------------------------+
| Format Type (4 bytes)  |
+------------------------+
| Content Size (4 bytes) |
+------------------------+
| Content Hash (16 bytes)|
+------------------------+
| Reserved (4 bytes)     |
+------------------------+
| JavaScript Content     |
|     (variable size)    |
+------------------------+
```

#### Header Fields

| Field | Size (bytes) | Description |
|-------|--------------|-------------|
| Magic Header | 8 | Identifying marker: "LYNX" + "BNDL" in ASCII |
| Version Info | 4 | Version number (little-endian), e.g., 1.0.0 = 0x00010000 |
| Platform ID | 4 | Target platform identifier (1 = iOS) |
| Format Type | 4 | Bundle format type (3 = Vue) |
| Content Size | 4 | Size of JavaScript content in bytes (little-endian) |
| Content Hash | 16 | MD5 hash of the JavaScript content for integrity checking |
| Reserved | 4 | Reserved for future use (set to 0) |

## JavaScript Content Requirements

The JavaScript content section must include:

1. A global `__LYNX_BUNDLE_METADATA__` object with bundle metadata
2. Entry point initialization code
3. The actual application bundle code

### Metadata Object Example

```javascript
global.__LYNX_BUNDLE_METADATA__ = {
  type: 'vue',
  version: '1.0.0',
  engine: '1.4.0',
  platform: 'ios',
  format: 'lynx-bundle-1',
  entry: 'main',
  timestamp: Date.now()
};
```

## Implementation

We've created a Node.js script that transforms standard JavaScript bundles into the Lynx format. The script:

1. Reads the input bundle
2. Constructs the proper header
3. Calculates the MD5 hash
4. Combines everything into a properly formatted bundle

### Key Code Components

```javascript
// Lynx bundle format header (magic bytes)
const LYNX_BUNDLE_HEADER = Buffer.from([
  // Magic identifier "LYNX"
  0x4C, 0x59, 0x4E, 0x58,
  // Bundle type "BNDL"
  0x42, 0x4E, 0x44, 0x4C,
  // Version 1.0 (little endian)
  0x00, 0x01, 0x00, 0x00,
  // Platform: iOS (1)
  0x01, 0x00, 0x00, 0x00,
  // Format: Vue (3) - using value 3 assuming 1=js, 2=react, 3=vue
  0x03, 0x00, 0x00, 0x00
]);

// Create a buffer that includes header and metadata
const headerSize = LYNX_BUNDLE_HEADER.length + 24; // Header + size fields
const headerBuffer = Buffer.alloc(headerSize);

// Copy the magic header
LYNX_BUNDLE_HEADER.copy(headerBuffer, 0);

// Calculate MD5 hash of content
const md5Hash = crypto.createHash('md5').update(contentBuffer).digest();

// Write content size (little endian)
headerBuffer.writeUInt32LE(contentBuffer.length, LYNX_BUNDLE_HEADER.length);

// Write content MD5 hash (16 bytes)
md5Hash.copy(headerBuffer, LYNX_BUNDLE_HEADER.length + 4);

// Write reserved bytes (4 bytes)
headerBuffer.writeUInt32LE(0, LYNX_BUNDLE_HEADER.length + 20);

// Combine header and content
const outputBuffer = Buffer.concat([headerBuffer, contentBuffer]);
```

## Usage

Our implementation is available as a script that can be integrated into a build process:

```bash
# Build a Vue app and prepare it as a Lynx bundle
bun run build:ios:vue:simple
```

This command:
1. Builds the Vue application using Rspeedy
2. Runs the bundle preparation script
3. Outputs a correctly formatted Lynx bundle

## Common Issues

### Incorrect Bundle Format

If the iOS simulator or device shows an error like:

```
Decode error: template file has broken. Expected size is XXXXXXXX. Actual size is YYYYYY.
```

This indicates that the bundle format doesn't match what the Lynx runtime expects. Common causes include:

- Incorrect magic header values
- Wrong version or platform identifiers
- Missing or corrupt hash information

### QR Code URL Issues

When using QR codes for development, ensure that:
- The server port in configuration matches the port in the QR code
- The URL points to the correct bundle file name

## Future Development

As we move towards creating a standalone package for Lynx bundling, we plan to:

1. Create a proper npm package for the bundler
2. Support different platform targets (iOS, Android, Web)
3. Add more validation and error reporting
4. Provide a CLI interface for easier integration

## References

- [Lynx GitHub Repository](https://github.com/lynx-family/lynx-stack)
- [Lynx JS Documentation](https://lynxjs.org/) 
