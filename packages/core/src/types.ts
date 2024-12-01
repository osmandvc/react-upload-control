import { PropsWithChildren } from "react";

import {
  DragDropContext,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult,
  ResponderProvided,
} from "@hello-pangea/dnd";
import { any } from "zod";

export type FilePreProcessorFunction = (
  files: UploadedFilePublic[]
) => UploadedFilePublic[] | Promise<UploadedFilePublic[] | undefined>;

interface MimeTypesProcessorMap {
  [key: string]: FilePreProcessorFunction | null;
}

export type FilePreProcessor = MimeTypesProcessorMap & {
  other?: FilePreProcessorFunction;
};

export interface UploadedFilesManagerProps extends PropsWithChildren {
  maxFileSizeMb?: number;
  maxFiles?: number;
  mimeTypes?: string[];
  multiple?: boolean;
  initFiles?: UploadedFile[];
  onUpload: (
    files: UploadedFile[],
    onProgressChange: (
      fileId: string,
      progress: number,
      error?: {
        text: string;
        code: string;
      }
    ) => void
  ) => Promise<UploadFileResult[]>; // Upload Callback for FileItems
  onDelete?: (files: UploadedFile[]) => Promise<UploadFileResult[]>; // Cleanup Callback for FileItems
  onFinish: (files: UploadedFile[]) => void;
  onAddFileError?: (error: unknown | FileDropError) => void;
  preProcessFiles?: FilePreProcessor;
  resetOnFinish?: boolean;
}

export interface UploadedFilesProviderProps extends UploadedFilesManagerProps {
  locale?: string;
}

export type UploadFileResult = {
  fileId: string;
  success: boolean;
  error?: {
    text: string;
    code: string;
  };
};

export type FileDropProps = {
  isMinimal?: boolean;
  children?: React.ReactNode;
};

export type FileDropError = {
  error: {
    type: FileDropErrorType;
    text: string;
  };
};

export type FileListProps = {
  onDragEnd: (result: DropResult, provided: ResponderProvided) => any;
};

export interface FileUploadControlProps
  extends FileDropProps,
    FileLoaderActionsProps {
  className?: string;
  size?: "sm" | "lg" | "auto";
}

export type UploadStatus = {
  stage?: UploadedFileItemStage;
  progress?: number;
  error?: {
    text: string;
    code: string;
  };
};

export type FileListItemProps = {
  id: string;
  size?: number;
  name: string;
  previewImgSrc?: string;
  uploadStatus: UploadStatus;
  order?: number;
  count: number;
  draggableProvided?: DraggableProvided;
  draggableSnapshot?: DraggableStateSnapshot;
};

export enum FileDropErrorType {
  INVALID_FILE = "INVALID_FILE",
  MAXSIZE = "OVER_SIZE_LIMIT",
  MULTIPLE_NOT_ALLOWED = "MULTIPLE_NOT_ALLOWED",
  MAX_FILES_NUMBER = "MAX_FILES_NUMBER",
}

export type UploadedFileImage = {
  imgBase64Uri: string;
  width?: number;
  height?: number;
};

export enum UploadedFileItemStage {
  IDLE = "IDLE",
  FINISHED = "FINISHED",
  FAILED = "FAILED",
  UPLOADING = "UPLOADING",
  REMOVING = "REMOVING",
}

export interface UploadedFile extends UploadedFilePublic {
  uploadStatus: UploadStatus;
  order?: number;
}

export interface UploadedFilePublic {
  id: string;
  file?: File;
  name: string;
  size?: number;
  type: string;
  base64Uri?: string;
  previewImg?: UploadedFileImage;
  metadata?: UploadedFileMetadata;
}

export interface UploadedFileMetadata {
  [key: string]: any;
}

export interface FormImage {
  uriBase64: string;
  width: number;
  height: number;
}

export interface ScaledImage extends FormImage {
  storeId?: number;
  img?: HTMLImageElement;
  scale: number;
  file?: File;
  mimeType: string;
}

export type FileLoaderActionsProps = {
  disableCamera?: boolean;
  disableFileSystem?: boolean;
  isMinimal?: boolean;
  disabled?: boolean;
};

export type FileLoaderFileSystemProps = {
  className?: string;
  onlyIcon?: boolean;
};

export type FileLoaderCameraProps = {
  className?: string;
  onlyIcon?: boolean;
};

export interface ScaledImageBinary extends ScaledImage {
  uri: string;
  img: HTMLImageElement;
  imgBlob?: Blob;
  imgArray?: Uint8Array;
  width: number;
  height: number;
  scale: number;
  mimeType: string;
  hasWatermark?: boolean;
}
