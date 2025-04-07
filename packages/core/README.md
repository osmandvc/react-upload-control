# React Upload Control Core

[![npm version](https://img.shields.io/npm/v/@osmandvc/react-upload-control.svg)](https://www.npmjs.com/package/@osmandvc/react-upload-control)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The core package of React Upload Control, providing the essential hooks and providers for file upload management in React applications. This package is part of the React Upload Control ecosystem, designed to be lightweight and tree-shakable.

## Demo

Check out our interactive demo cases here:  
[React Upload Control Demo](https://main--675c9582166050575d7b72e2.chromatic.com)

## Why React Upload Control? 🤷‍♂️

Born from real-world needs in a production environment, React Upload Control addresses common limitations found in existing file upload solutions. While there are many file upload libraries available, we found that most of them fell short in crucial areas:

- 📚 **Documentation Gaps:** Many libraries either have excessive boilerplate, insufficient documentation or lacking DX
- 🔧 **Maintenance Issues:** Several options are outdated or no longer actively maintained
- 🔒 **Vendor Lock-in:** Some solutions tie you to specific cloud services or platforms
- 📦 **Bloated Dependencies:** Often file uploaders come bundled within larger UI libraries, increasing your bundle size

React Upload Control was created to solve these problems, offering a powerful and flexible core that you can build upon. Whether you need a simple file upload implementation or want to build a feature-rich solution, you can customize it to your specific needs without compromising on quality or developer experience.

## Features 🔥

- 🚀 **Modern Stack:** Built with React 18+ and TypeScript for type-safe development
- 🎯 **Core Functionality:** Provides the essential hooks and providers for file upload management
- 🌳 **Tree Shakable:** Only import what you need, keeping your bundle size minimal
- ⚛️ **State Management:** Built-in state machine for handling upload lifecycle
- 🔄 **File Ordering:** Built-in file ordering system with programmatic reordering capabilities
- ⚡ **Async Processing:** Handle file uploads asynchronously with progress updates
- 💻 **Developer Experience:** Simple API with comprehensive TypeScript support
- ⚙️ **Unopinionated:** You decide how and where files are uploaded, no vendor lock-in
- 🔓 **Open Source:** Free to use and modify under the MIT license
- 📦 **Lightweight:** Zero dependencies (except for optional toaster notifications)

## Installation

```bash
npm install @osmandvc/react-upload-control

# Optional: Install sonner if you want built-in toast notifications
npm install sonner
```

## Pre-built Components

Looking for a complete UI solution? Check out [@osmandvc/react-upload-control-components](https://www.npmjs.com/package/@osmandvc/react-upload-control-components), our official UI components package that provides:

- Drag & Drop upload zone
- File list with reordering capabilities
- Progress indicators
- Camera integration
- And more!

While this is currently the only pre-built component package, we welcome community-built components and plan to integrate more solutions in the future. The core package's flexible architecture makes it easy to build custom UI components on top of it.

## Basic Usage

```tsx
import {
  UploadedFilesProvider,
  useUploadFilesProvider,
} from "@osmandvc/react-upload-control";

function MyUploadComponent() {
  const uploadProvider = useUploadFilesProvider();
  const { files, addFiles, uploadAllFiles } = uploadProvider;

  return <div>{/* Build your own UI components */}</div>;
}
```

## Upload Handler Examples

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
    files.forEach((file) => {
      if (file.file) {
        formData.append("files", file.file);
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

    const result = await response.json();

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
    // Handle errors
    const errorResult = {
      text: error.message || "Upload failed",
      code: "BATCH_UPLOAD_ERROR",
    };

    return files.map((file) => ({
      fileId: file.id,
      success: false,
      error: errorResult,
    }));
  }
}
```

### Example 2: AWS S3 Upload

```tsx
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

async function handleS3Upload(
  files: UploadedFile[],
  onProgressChange: (
    fileId: string,
    progress: number,
    error?: { text: string; code: string }
  ) => void
): Promise<UploadFileResult[]> {
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

        const key = `uploads/${Date.now()}-${file.name}`;
        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: "your-bucket-name",
            Key: key,
            Body: file.file,
            ContentType: file.file.type,
          },
        });

        // Handle upload progress
        upload.on("httpUploadProgress", (progress) => {
          const percentage = Math.round(
            ((progress.loaded || 0) * 100) / (progress.total || 100)
          );
          onProgressChange(file.id, percentage);
        });

        await upload.done();

        return {
          fileId: file.id,
          success: true,
          metadata: {
            url: `https://your-bucket-name.s3.your-region.amazonaws.com/${key}`,
          },
        };
      } catch (error) {
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
```

## State Management

The core package includes a built-in state machine that handles different upload states automatically. The `useUploadFilesProvider` hook gives you access to these states through the `smStatus` property and helper methods `smStatusIs` and `smStatusIsnt`.

### Upload States

The state machine handles the following states:

- **IDLE**: Initial state and after successful operations
- **PROCESSING**: During file transformations, uploads, or deletions
- **ERROR**: When an upload operation fails
- **RETRY**: When retrying after an error
- **FINISHED**: After successful upload completion (if resetOnFinish is false)

### State Transitions

States change automatically based on different operations:

1. **Adding Files**:

   - IDLE → PROCESSING (during file transformation)
   - PROCESSING → IDLE (after files are added)
   - PROCESSING → ERROR (if error occurs)

2. **Uploading Files**:

   - IDLE/ERROR → PROCESSING (during upload)
   - PROCESSING → IDLE (all uploads successful)
   - PROCESSING → ERROR (if any upload fails)
   - ERROR → RETRY (when retrying upload)
   - IDLE → FINISHED (after successful upload if resetOnFinish is false)

3. **Deleting Files**:
   - IDLE → PROCESSING (during deletion)
   - PROCESSING → IDLE (after deletion)

### File States

Individual files also have their own states through the `uploadStatus` property:

```typescript
interface UploadStatus {
  stage: "IDLE" | "UPLOADING" | "FINISHED" | "FAILED";
  progress: number;
  error?: {
    text: string;
    code: string;
  };
}
```

The hook manages these states automatically during:

- File validation
- Pre-processing
- Upload progress
- Upload completion/failure

### Usage Example

```tsx
function MyUploadComponent() {
  const { smStatus, smStatusIs, files, uploadAllFiles } =
    useUploadFilesProvider();

  return (
    <div>
      {smStatusIs("ERROR") && <div>Upload failed! Please try again.</div>}
      {smStatusIs("PROCESSING") && <div>Processing...</div>}
      {smStatusIs("FINISHED") && <div>Upload complete!</div>}

      <button onClick={uploadAllFiles} disabled={smStatusIs("PROCESSING")}>
        {smStatusIs("ERROR") ? "Retry Upload" : "Upload Files"}
      </button>
    </div>
  );
}
```

## Error Handling

The package provides two ways to handle errors:

1. **Built-in Toast Notifications:** If you have `sonner` installed, the package will automatically show toast notifications for validation errors.
2. **Custom Error Handler:** Provide your own `onAddFileError` handler in the provider props for custom error handling.

## API Reference

### UploadedFilesProvider Props

| Prop     | Type               | Description                         |
| -------- | ------------------ | ----------------------------------- |
| config   | `FileUploadConfig` | Configuration for file uploads      |
| handlers | `UploadHandlers`   | Upload and error handling functions |
| children | `ReactNode`        | Child components                    |

### Config Options

```typescript
interface FileUploadConfig {
  mimeTypes: string[]; // Allowed file types
  maxFileSizeMb: number; // Maximum file size in MB
  multiple?: boolean; // Allow multiple file uploads
  maxFiles?: number; // Maximum number of files
  resetOnFinish?: boolean; // Reset state after finish
  disableSorting?: boolean; // Disable reordering
}
```

### Handler Types

```typescript
interface UploadHandlers {
  onUpload: (
    files: UploadedFile[],
    onProgressChange: OnProgressCallback
  ) => Promise<UploadFileResult[]> | UploadFileResult[];
  onDelete?: (files: UploadedFile[]) => Promise<void> | void;
  onFinish?: (files: UploadedFile[]) => void;
  onAddFileError?: (error: FileDropError | unknown) => void;
}
```

Example usage of progress callback:

```typescript
import {
  OnProgressCallback,
  UploadProgressError,
} from "@osmandvc/react-upload-control";

function MyUploadComponent() {
  return (
    <UploadedFilesProvider
      config={{
        mimeTypes: ["image/jpeg", "image/png"],
        maxFileSizeMb: 10,
      }}
      handlers={{
        onUpload: async (files, onProgressChange) => {
          try {
            for (const file of files) {
              // Update progress as the upload proceeds
              onProgressChange(file.id, 30);

              // ... upload logic ...

              // Upload complete
              onProgressChange(file.id, 100);
            }
            return files.map((file) => ({
              fileId: file.id,
              success: true,
            }));
          } catch (error) {
            // Handle error case
            onProgressChange(file.id, 0, {
              text: "Upload failed",
              code: "UPLOAD_ERROR",
            });
            return [
              {
                fileId: file.id,
                success: false,
                error: { text: "Upload failed", code: "UPLOAD_ERROR" },
              },
            ];
          }
        },
      }}
    >
      <YourConsumingComponent />
    </UploadedFilesProvider>
  );
}
```

## Hook Return Values

The `useUploadFilesProvider` hook returns an object with the following properties:

### File Management

- `files`: Array of currently uploaded files
- `addFiles`: Function to add new files to the upload queue
- `updateFile`: Function to update properties of a specific file
- `uploadAllFiles`: Function to start uploading all files in the queue
- `deleteFile`: Function to delete a specific uploaded file
- `deleteAllFiles`: Function to delete all uploaded files
- `getFile`: Function to retrieve a specific file by its ID
- `setFiles`: Function to directly set the files array
- `resetControl`: Function to reset the upload control to its initial state
- `moveFile`: Function to change the order of a file. Takes a fileId and direction (-1 for up, 1 for down)

### Status Management

- `smStatus`: Current status of the state machine
- `smStatusIs`: Function to check if the current status matches a specific status
- `smStatusIsnt`: Function to check if the current status does not match a specific status

### Validation

- `getValidationInfo`: Function to get validation information for files
- `disableSorting`: Property to disable file sorting functionality

## Contributing

We welcome contributions from the community. Feel free to open issues or submit pull requests on our [GitHub repository](https://github.com/osmandvc/react-upload-control).

## License

MIT © [osmandvc](https://github.com/osmandvc)
