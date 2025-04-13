import { useUploadFilesProvider } from "../providers/UploadedFilesManager";

/**
 * Hook that provides status-related properties from the upload context
 * @returns Status-related properties and methods
 */
export function useUploadStatus() {
  const { 
    smStatus, 
    isIdle, 
    isProcessing, 
    isFinished, 
    isError, 
    isReady, 
    isPending 
  } = useUploadFilesProvider();
  
  return {
    status: smStatus,
    isIdle,
    isProcessing,
    isFinished,
    isError,
    isReady,
    isPending
  };
}
