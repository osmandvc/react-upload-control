# React Upload Control

> ⚠️ **Early Release Notice:** This library is in active development! While it's already battle-tested and production-ready, we're working on comprehensive documentation and additional features. The current docs provide basic usage - stay tuned for in-depth guides, examples, and advanced customization options coming soon!

React Upload Control is a free, lightweight and open-source file uploader library designed for modern React applications. This library is crafted to provide a high-quality developer experience (DX), making it easy to use for simple file uploads while offering extensive customization options for advanced use cases.

- 🚀 **Modern Stack:** Built with React 18+ and TypeScript for type-safe development
- 📁 **Drag & Drop:** Intuitive file uploading with visual feedback and validation
- 📋 **File Management:** Drag-to-reorder capability for organizing user uploads in a specific order
- 📷 **Camera Integration:** Capture photos directly from your device's camera
- 💻 **Developer Experience:** Simple API with comprehensive TypeScript support and documentation
- 🌐 **Internationalization:** Built-in i18n support for multiple languages (currently English and German)
- 🎨 **Beautiful UI:** Modern, responsive design powered by Tailwind CSS
- 📱 **Mobile Ready:** Optimized experience across all device sizes
- ⚡ **Async Processing:** Handle file uploads asynchronously with progress updates
- 🔍 **File Preview:** Built-in preview support for images
- ⚙️ **Unopinionated:** You decide how and where files are uploaded, no vendor lock-in
- 🔓 **Open Source:** Free to use and modify under the MIT license

## Installation

To install React Upload Control, use npm or yarn:

```bash
npm install @osmandvc/react-upload-control
```

or

```bash
yarn add @osmandvc/react-upload-control
```

## Getting Started

This section will guide you through the process of setting up everything you need to get started. The library is built around the concept of providers and the React Context API, which means you need to wrap your application in a `UploadedFilesProvider` provider. If you want to use the default use case of a list of files and a drop area, you can do this by wrapping your `FileUploadControl` component in the provider. An minimal example of this can be seen below:

```tsx
import React, { PropsWithChildren } from "react";
import {
  FileUploadControl,
  UploadedFilesProvider,
  UploadedFile,
  UploadFileResult,
} from "react-upload-control";

function MyFileUploadParent(props: PropsWithChildren) {
  // Your custom delete and upload handlers (more about them later)...
  // function handleDelete(files: UploadedFile[]) {...}
  // function handleUpload(files: UploadedFile[], onProgressChange: (...) => void) {...}

  function handleFinish(files: UploadedFile[]) {
    console.log(files);
  }

  return (
    <UploadedFilesProvider
      onUpload={handleUpload}
      onDelete={handleDelete}
      onFinish={handleFinish}
      multiple={true}
      mimeTypes={["image/png", "image/jpeg"]}
    >
      <FileUploadControl />
    </UploadedFilesProvider>
  );
}
```

## Core Components

### FileUploadControl

The default component that provides the file upload interface with a FileList and FileDropArea.

```tsx
<FileUploadControl
  size="auto" // 'auto' | 'sm' | 'lg'
  disableCamera={false} // Disable camera integration
  disableFileSystem={false} // Disable file system uploads
/>
```

### UploadedFilesProvider

The provider component that manages the upload state and configuration.

```tsx
<UploadedFilesProvider
  mimeTypes={["image/jpeg", "image/png"]} // Allowed file types
  maxFileSizeMb={10} // Maximum file size in MB
  multiple={true} // Allow multiple file uploads
  maxFiles={5} // Maximum number of files
  onUpload={handleUpload} // Upload handler function
  onDelete={handleDelete} // Delete handler function
  onFinish={handleFinish} // Finish handler function
  locale="en" // Locale for i18n
/>
```

## API Reference

### UploadedFilesProvider Props

| Prop          | Type                                                   | Default   | Description                     |
| ------------- | ------------------------------------------------------ | --------- | ------------------------------- |
| mimeTypes     | string[]                                               | []        | Allowed file types              |
| maxFileSizeMb | number                                                 | 10        | Maximum file size in MB         |
| multiple      | boolean                                                | true      | Allow multiple file uploads     |
| maxFiles      | number                                                 | undefined | Maximum number of files         |
| onUpload      | (files: UploadedFile[]) => Promise<UploadFileResult[]> | required  | Upload handler function         |
| onDelete      | (files: UploadedFile[]) => Promise<UploadFileResult[]> | undefined | Delete handler function         |
| onFinish      | (files: UploadedFile[]) => void                        | undefined | Called when all uploads finish  |
| locale        | string                                                 | 'en'      | Locale for internationalization |
| resetOnFinish | boolean                                                | false     | Reset state after finish        |

### FileUploadControl Props

| Prop              | Type                   | Default   | Description                 |
| ----------------- | ---------------------- | --------- | --------------------------- |
| size              | 'auto' \| 'sm' \| 'lg' | 'auto'    | Component size variant      |
| disableCamera     | boolean                | false     | Disable camera integration  |
| disableFileSystem | boolean                | false     | Disable file system uploads |
| className         | string                 | undefined | Additional CSS classes      |

## Customization

React Upload Control is highly customizable. You can tailor it to meet your specific needs by adjusting its configuration and using its extensive API. <i> Detailed documentation coming soon. </i>

## Contributing

We welcome contributions from the community. Feel free to open issues or submit pull requests on our [GitHub repository](https://github.com/osmandvc/react-upload-control).

Please note that while React Upload Control is in an early state and has been battle-tested, bugs may still appear. We would appreciate it if you report any issues you encounter so they can be fixed as soon as possible. Contributions to improve the library are **very welcome**.

## License

This project is licensed under the MIT License.

---

<i> Detailed documentation coming soon. </i>
MIT © Osman Deveci
