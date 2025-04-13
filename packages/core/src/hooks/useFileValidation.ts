import { useUploadFilesProvider } from "../providers/UploadedFilesManager";

/**
 * Hook that provides file validation-related properties and methods from the upload context
 * @returns File validation-related properties and methods
 */
export function useFileValidation() {
  const { 
    getValidationInfo,
    disableSorting
  } = useUploadFilesProvider();
  
  return {
    getValidationInfo,
    disableSorting
  };
}
