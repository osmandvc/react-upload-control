import { useUploadFilesProvider } from "../providers/UploadedFilesManager";

/**
 * Hook that provides file operation-related properties and methods from the upload context
 * @returns File operation-related properties and methods
 */
export function useFileOperations() {
  const { 
    files, 
    addFiles, 
    deleteFile, 
    deleteAllFiles, 
    updateFile, 
    moveFile,
    getFile
  } = useUploadFilesProvider();
  
  return {
    files,
    addFiles,
    deleteFile,
    deleteAllFiles,
    updateFile,
    moveFile,
    getFile
  };
}
