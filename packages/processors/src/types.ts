export interface ScaledImage extends FormImage {
  storeId?: number;
  img?: HTMLImageElement;
  scale: number;
  file?: File;
  mimeType: string;
}

export interface FormImage {
  uriBase64: string;
  width: number;
  height: number;
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

export interface UploadedFileMetadata {
  [key: string]: any;
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

export type UploadedFileImage = {
  imgBase64Uri: string;
  width?: number;
  height?: number;
};
