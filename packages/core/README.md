# React Upload Control

[![npm version](https://img.shields.io/npm/v/@osmandvc/react-upload-control.svg)](https://www.npmjs.com/package/@osmandvc/react-upload-control)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, flexible file upload control for React applications.

React Upload Control is a free, lightweight and open-source file uploader library designed for modern React applications. This library is crafted to provide a high-quality developer experience (DX), making it easy to use for simple file uploads while offering extensive customization options for advanced use cases.

## Demo

Check out our interactive demo cases here:  
[React Upload Control Demo](https://675c9582166050575d7b72e2-bzirycxazq.chromatic.com)

## Why React Upload Control? 🤷‍♂️

Born from real-world needs in a production environment, React Upload Control addresses common limitations found in existing file upload solutions. While there are many file upload libraries available, we found that most of them fell short in crucial areas:

- 🔄 **No Drag-to-Reorder:** Most solutions lack built-in file ordering capabilities, a crucial feature for many applications
- 📚 **Documentation Gaps:** Many libraries either have excessive boilerplate, insufficient documentation or lacking DX
- 🔧 **Maintenance Issues:** Several options are outdated or no longer actively maintained
- 🎨 **Poor UI/UX:** Many unstyled options result in subpar user interfaces
- 🔒 **Vendor Lock-in:** Some solutions tie you to specific cloud services or platforms
- 📦 **Bloated Dependencies:** Often file uploaders come bundled within larger UI libraries, increasing your bundle size

React Upload Control was created to solve these problems, offering a standalone, modern file uploader that's both powerful and flexible. Whether you need a simple file upload control or a feature-rich solution with file processing capabilities, you can customize it to your specific needs without compromising on quality or developer experience.

## Features summary 🔥

- 🚀 **Modern Stack:** Built with React 18+ and TypeScript for type-safe development
- 📁 **Drag & Drop:** Intuitive file uploading with visual feedback and validation
- 📋 **File Management:** Drag-to-reorder capability for organizing user uploads
- 🔄 **File Processing:** Optional pre/post-processing capabilities with [@osmandvc/react-upload-control-processors](https://www.npmjs.com/package/@osmandvc/react-upload-control-processors) or custom integrations
- 📷 **Camera Integration:** Camera integration for capturing photos directly
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
      handlers={{ onUpload: handleUpload, onFinish: handleFinish }}
      config={{
        mimeTypes: ["image/png", "image/jpeg"],
        disableSorting: false, // Disable drag-to-reorder functionality
      }}
    >
      <FileUploadControl />
    </UploadedFilesProvider>
  );
}
```

## Upload Handler Guide

The upload handler is a crucial part of the library that gives you complete control over how files are processed and uploaded.

The upload handler receives two parameters:

1. `files`: An array of `UploadedFile` objects to be uploaded
2. `onProgressChange`: A callback function to update the upload progress

Here are two examples of implementing an upload handler:

### Example 1: Simple Batch Upload

```tsx
async function handleUpload(
  files: UploadedFile[],
  onProgressChange: (
    fileId: string,
    progress: number,
    error?: { text: string; code: string }
  ) => void
): Promise<UploadFileResult[]> {
  try {
    // Set initial progress for all files
    files.forEach((file) => {
      onProgressChange(file.id, 0);
    });

    // Create form data with all files
    const formData = new FormData();
    files.forEach((file, index) => {
      if (file.file) {
        formData.append(`files`, file.file);
      }
    });

    // Make API call with all files
    const response = await fetch("https://api.example.com/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    // Example API response with processed file data
    const result = await response.json();
    // { success: true, files: [{ id: "...", url: "..." }] }

    // Set progress to 100% for all files after successful upload
    files.forEach((file) => {
      onProgressChange(file.id, 100);
    });

    // Return success results with metadata from API
    return files.map((file, index) => ({
      fileId: file.id,
      success: true,
      metadata: {
        url: result.files[index].url,
        uploadedAt: new Date().toISOString(),
      },
    }));
  } catch (error) {
    // Set error state for all files
    const errorResult = {
      text: error.message || "Upload failed",
      code: "BATCH_UPLOAD_ERROR",
    };

    // Return error results for all files
    return files.map((file) => ({
      fileId: file.id,
      success: false,
      error: errorResult,
    }));
  }
}

// Usage with the UploadedFilesProvider
function MyFileUpload() {
  return (
    <UploadedFilesProvider
      handlers={{
        onUpload: handleUpload,
        onFinish: (files) => {
          // All files are uploaded successfully at this point
          const urls = files.map((f) => f.metadata.url);
          console.log("Uploaded file URLs:", urls);
        },
      }}
      config={{
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
        maxFileSizeMb: 10,
      }}
    >
      <FileUploadControl />
    </UploadedFilesProvider>
  );
}
```

### Example 2: Real-World AWS S3 Example

```tsx
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

async function handleS3Upload(
  files: UploadedFile[],
  onProgressChange: (
    fileId: string,
    progress: number,
    error?: { text: string; code: string }
  ) => void
): Promise<UploadFileResult[]> {
  // Initialize the S3 client
  const s3Client = new S3Client({
    region: "your-region",
    credentials: {
      accessKeyId: "your-access-key",
      secretAccessKey: "your-secret-key",
    },
  });

  return Promise.all(
    files.map(async (file) => {
      try {
        if (!file.file) throw new Error("No file provided");

        // Generate a unique key for the file
        const key = `uploads/${Date.now()}-${file.name}`;

        // Create the upload
        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: "your-bucket-name",
            Key: key,
            Body: file.file,
            ContentType: file.file.type,
            // Optional: Set additional parameters
            // ACL: 'public-read',
            // Metadata: { /* your metadata */ }
          },
        });

        // Handle upload progress
        upload.on("httpUploadProgress", (progress) => {
          const percentage = Math.round(
            ((progress.loaded || 0) * 100) / (progress.total || 100)
          );
          onProgressChange(file.id, percentage);
        });

        // Perform the upload
        await upload.done();

        // Return success result with the S3 URL
        return {
          fileId: file.id,
          success: true,
          metadata: {
            url: `https://your-bucket-name.s3.your-region.amazonaws.com/${key}`,
          },
        };
      } catch (error) {
        console.error("S3 upload error:", error);
        return {
          fileId: file.id,
          success: false,
          error: {
            text: error.message || "S3 upload failed",
            code: "S3_UPLOAD_ERROR",
          },
        };
      }
    })
  );
}

// Usage with the UploadedFilesProvider
function MyFileUpload() {
  return (
    <UploadedFilesProvider
      handlers={{
        onUpload: handleS3Upload,
        onFinish: (files) => {
          // All files are successfully uploaded at this point
          const urls = files.map((f) => f.metadata.url);
          console.log("Uploaded file URLs:", urls);
        },
      }}
      config={{
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
        maxFileSizeMb: 10,
      }}
    >
      <FileUploadControl />
    </UploadedFilesProvider>
  );
}
```

### Understanding UploadFileResult

The upload handler must return an array of `UploadFileResult` objects - one for each uploaded file. Here's the structure:

```typescript
type UploadFileResult = {
  // The ID of the file that was uploaded (must match the original file.id)
  fileId: string;

  // Whether the upload was successful
  success: boolean;

  // Optional error information if success is false
  error?: {
    text: string; // Human-readable error message
    code: string; // Error code for programmatic handling
  };

  // Optional metadata to attach to the file
  metadata?: {
    [key: string]: any; // Any additional data you want to store with the file
  };
};
```

Example of a successful upload result:

```typescript
{
  fileId: "file123",
  success: true,
  metadata: {
    url: "https://example.com/uploads/file123.jpg",
    uploadedAt: "2025-01-02T12:00:00Z",
    size: 1024000
  }
}
```

Example of a failed upload result:

```typescript
{
  fileId: "file456",
  success: false,
  error: {
    text: "File size exceeds server limit",
    code: "SIZE_LIMIT_EXCEEDED"
  }
}
```

## onDelete Handler

The `onDelete` handler is designed to be non-blocking and does not include progress tracking. This is intentional for better UX - since it's primarily used for cleanup when resetting a control with already finished uploads. Users should be able to reset the control immediately without waiting for deletion to complete or being blocked by deletion errors.

```typescript
interface Props {
  onDelete?: (files: UploadedFile[]) => void | Promise<void>;
}
```

> Note: Unlike `onUpload`, the `onDelete` handler won't show progress or block the UI. This ensures users can quickly reset or clear their upload state without delays.

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
  config={{
    mimeTypes: ["image/jpeg", "image/png"], // Allowed file types
    maxFileSizeMb: 10, // Maximum file size in MB
    multiple: true, // Allow multiple file uploads
    maxFiles: 5, // Maximum number of files
    locale: "en", // Locale for i18n
    resetOnFinish: false, // Reset state after finish
    disableSorting: false, // Disable drag-to-reorder functionality
  }}
  handlers={{
    onUpload: handleUpload, // Upload handler function
    onDelete: handleDelete, // Delete handler function
    onFinish: handleFinish, // Finish handler function
  }}
/>
```

## API Reference

### UploadedFilesProvider Props

| Prop      | Type                                                                                                                                                                              | Default   | Description                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------- |
| config    | { mimeTypes: string[], maxFileSizeMb: number, multiple: boolean, maxFiles: number, locale: string, resetOnFinish: boolean, disableSorting: boolean }                              | required  | Configuration object                        |
| handlers  | { onUpload: (files: UploadedFile[]) => Promise<UploadFileResult[]>, onDelete: (files: UploadedFile[]) => Promise<UploadFileResult[]>, onFinish: (files: UploadedFile[]) => void } | required  | Handlers object                             |
| children  | React.ReactNode                                                                                                                                                                   | required  | Child components to render                  |
| initFiles | UploadedFile[]                                                                                                                                                                    | undefined | Initial files to populate the uploader with |
| locale    | string                                                                                                                                                                            | 'en'      | Locale for internationalization             |

### FileUploadControl Props

| Prop              | Type                   | Default   | Description                 |
| ----------------- | ---------------------- | --------- | --------------------------- |
| size              | 'auto' \| 'sm' \| 'lg' | 'auto'    | Component size variant      |
| disableCamera     | boolean                | false     | Disable camera integration  |
| disableFileSystem | boolean                | false     | Disable file system uploads |
| className         | string                 | undefined | Additional CSS classes      |

## Understanding the UploadedFile Type

When implementing your upload handlers, you'll work with the `UploadedFile` type, which provides access to various file properties:

```typescript
interface UploadedFile {
  id: string; // Unique identifier for the file
  file?: File; // The actual File object
  name: string; // File name
  size?: number; // File size in bytes
  type: string; // MIME type
  base64Uri?: string; // Base64 encoded file content
  previewImg?: {
    // Preview image data (for images)
    imgBase64Uri: string;
    width?: number;
    height?: number;
  };
  uploadStatus: {
    // Current upload status
    stage?: "IDLE" | "FINISHED" | "FAILED" | "UPLOADING" | "REMOVING";
    progress?: number; // Upload progress (0-100)
    error?: {
      text: string; // Error message
      code: string; // Error code
    };
  };
  order?: number; // File order in the list
  metadata?: {
    // Custom metadata
    [key: string]: any;
  };
}
```

## File Processing

React Upload Control supports file processing through the optional [@osmandvc/react-upload-control-processors](https://www.npmjs.com/package/@osmandvc/react-upload-control-processors) package. This enables you to process files before or after upload, with built-in support for PDF manipulation and extensible architecture for custom processors.

```bash
npm install @osmandvc/react-upload-control-processors
```

### Example: PDF to JPEG Conversion

```tsx
import {
  FileUploadControl,
  UploadedFile,
  UploadedFilesProvider,
  UploadFileResult,
} from "@osmandvc/react-upload-control";
import { processPdfToJpeg } from "@osmandvc/react-upload-control-processors";

function FileUploadTest() {
  return (
    <div className="max-w-lg">
      <UploadedFilesProvider
        config={{
          mimeTypes: ["image/png", "image/jpeg", "application/pdf"],
          disableSorting: true,
        }}
        handlers={{
          onUpload: handleUpload,
          onFinish: handleFinish,
          preProcessFiles: {
            "application/pdf": processPdfToJpeg,
          },
        }}
      >
        <FileUploadControl />
      </UploadedFilesProvider>
    </div>
  );
}
```

You can see a demo of this in action [here](https://675c9582166050575d7b72e2-bzirycxazq.chromatic.com/?path=/story/examples-upload-control-with-pdf-pre-processing--default).

## Creating Custom Upload Sources and Destinations

The `useUploadFilesProvider` hook allows you to create your own file sources (like drop areas) and file destinations (like file lists) with ease. The provider handles all the complex validation and state management for you.

The provider abstracts away:

- File validation (size, type, count)
- Progress tracking
- File state management
- Error handling
- Upload coordination

> 🔍 **Coming Soon**: Detailed documentation on creating custom upload components, handling file preprocessing, and implementing advanced validation logic.

## Customization

React Upload Control is highly customizable. You can tailor it to meet your specific needs by adjusting its configuration and using its extensive API. <i> Detailed documentation coming soon. </i>

## Contributing

We welcome contributions from the community. Feel free to open issues or submit pull requests on our [GitHub repository](https://github.com/osmandvc/react-upload-control).

Please note that while React Upload Control is in an early state and has been battle-tested, bugs may still appear. We would appreciate it if you report any issues you encounter so they can be fixed as soon as possible. Contributions to improve the library are **very welcome**.

Because the library is in its early stages, **we are open to suggestions and feedback. If you have any ideas for new features or enhancements, please don't hesitate to share them with us.**

## License

This project is licensed under the MIT License.

---

MIT © Osman Deveci
