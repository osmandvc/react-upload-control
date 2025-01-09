export type FilePreProcessorFunction = (
  files: UploadedFilePublic[]
) => UploadedFilePublic[] | Promise<UploadedFilePublic[] | undefined>;

interface MimeTypesProcessorMap {
  [key: string]: FilePreProcessorFunction | null;
}

export type FilePreProcessor = MimeTypesProcessorMap & {
  other?: FilePreProcessorFunction;
};

export interface FileUploadConfig {
  mimeTypes?: string[];
  multiple?: boolean;
  maxFileSizeMb?: number;
  maxFiles?: number;
  resetOnFinish?: boolean;
  disableSorting?: boolean;
}

export interface FileUploadHandlers {
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
}

export interface UploadedFilesManagerProps {
  children: React.ReactNode;
  config?: FileUploadConfig;
  handlers: FileUploadHandlers;
  initFiles?: UploadedFile[];
  locale?: string;
}

export interface UploadedFilesProviderProps extends UploadedFilesManagerProps {}

export type UploadFileResult = {
  fileId: string;
  success: boolean;
  error?: {
    text: string;
    code: string;
  };
  metadata?: UploadedFileMetadata;
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

export type DndResult = {
  source: { index: number };
  destination: { index: number };
};

export type FileListProps = {
  onDragEnd?: (result: DndResult) => void;
  disableSorting?: boolean;
};

export interface FileUploadControlProps
  extends Omit<FileLoaderActionsProps, "onAddFileError"> {
  className?: string;
  size?: "sm" | "lg" | "auto";
  children?: React.ReactNode;
  disableCamera?: boolean;
  disableFileSystem?: boolean;
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
  disabled?: boolean;
  disableSorting?: boolean;
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
  disableClipboard?: boolean;
  isMinimal?: boolean;
  disabled?: boolean;
};

export interface FileLoaderAction {
  className?: string;
  onlyIcon?: boolean;
}

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
