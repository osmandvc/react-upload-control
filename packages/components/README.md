# React Upload Control Components

[![npm version](https://img.shields.io/npm/v/@osmandvc/react-upload-control-components.svg)](https://www.npmjs.com/package/@osmandvc/react-upload-control-components)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Pre-built UI components for React Upload Control, providing a beautiful and feature-rich file upload experience. This package is part of the React Upload Control ecosystem.

## Demo

Check out our interactive demo cases here:  
[React Upload Control Demo](https://675c9582166050575d7b72e2-bzirycxazq.chromatic.com)

## Features 🔥

- 📁 **Drag & Drop:** Intuitive file uploading with visual feedback and validation
- 📋 **File Management:** Built-in drag-to-reorder capability for organizing uploads
- 📷 **Camera Integration:** Optional camera integration for capturing photos directly
- 🎨 **Beautiful UI:** Modern, responsive design powered by Tailwind CSS
- 📱 **Mobile Ready:** Optimized experience across all device sizes
- 🔍 **File Preview:** Built-in preview support for images
- 📎 **Clipboard Support:** Paste files directly from clipboard

## Installation

```bash
# Install the components package
npm install @osmandvc/react-upload-control-components

# Install the core package (peer dependency)
npm install @osmandvc/react-upload-control
```

## Basic Usage

```tsx
import { FileUploadControl } from "@osmandvc/react-upload-control-components";
import { UploadedFilesProvider } from "@osmandvc/react-upload-control";

function App() {
  return (
    <UploadedFilesProvider
      config={{
        mimeTypes: ["image/jpeg", "image/png"],
        maxFileSizeMb: 10,
        multiple: true,
      }}
      handlers={{
        onUpload: async (files) => {
          // Your upload logic
        },
      }}
    >
      <FileUploadControl />
    </UploadedFilesProvider>
  );
}
```

## Available Components

### FileUploadControl

The main component that combines all features:

```tsx
<FileUploadControl
  size="auto" // 'auto' | 'sm' | 'lg'
  disableCamera={false} // Disable camera integration
  disableFileSystem={false} // Disable file system uploads
  disableClipboard={false} // Disable clipboard uploads
  className="custom-class" // Additional CSS classes
/>
```

## Why a Separate Components Package?

1. **Flexibility:** Use only what you need. If you want to build your own UI, you can use just the core package
2. **Bundle Size:** Keep your bundle size minimal by only including the components you use
3. **Styling Freedom:** The components package includes styles, but you can build your own UI using the core package
4. **Independent Updates:** UI components can be updated without affecting core functionality

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests on our [GitHub repository](https://github.com/osmandvc/react-upload-control).

## License

MIT © [osmandvc](https://github.com/osmandvc)
