import { FileDropError, FileDropErrorType } from "../types";

// Type guard function to check if an error matches the FileDropError structure
export function isFileDropError(error: any): error is FileDropError {
  return (
    error != null && // Check if error is neither null nor undefined
    typeof error === "object" && // Check if error is an object
    "error" in error && // Check if the 'error' property exists in error object
    error.error != null && // Check if error.error is neither null nor undefined
    typeof error.error === "object" && // Check if error.error is an object
    "text" in error.error && // Check if the 'text' property exists
    typeof error.error.text === "string" && // Check if error.error.text is a string
    "type" in error.error && // Check if the 'type' property exists
    Object.values(FileDropErrorType).includes(error.error.type) // Check if error.error.type is a valid value
  );
}
