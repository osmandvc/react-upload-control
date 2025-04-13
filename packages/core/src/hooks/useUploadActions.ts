import { useUploadFilesProvider } from "../providers/UploadedFilesManager";

/**
 * Hook that provides upload action-related methods from the upload context
 * @returns Upload action-related methods
 */
export function useUploadActions() {
  const { 
    uploadAllFiles, 
    resetControl,
    getValidationInfo
  } = useUploadFilesProvider();
  
  return {
    uploadAllFiles,
    resetControl,
    getValidationInfo
  };
}
