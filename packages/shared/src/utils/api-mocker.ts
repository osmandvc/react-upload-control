import { UploadStatus, UploadedFile } from "../types";

export async function mockApiCallWithProgress(
  file: UploadedFile,
  updateProgress: (id: string, options: Partial<UploadedFile>) => void
) {
  const intervalTime = 250;
  let progress = 0;

  // Function to simulate the progress
  const simulateProgress = () => {
    if (progress < 100) {
      progress += 10; // Increment progress by 10% (adjust as needed)
      const uploadStatus: UploadStatus = {
        ...file.uploadStatus,
        progress,
      };
      updateProgress(file.id, { uploadStatus });
    } else {
      clearInterval(progressInterval);
      console.log("Upload complete");
    }
  };
  const progressInterval = setInterval(simulateProgress, intervalTime);

  await new Promise((resolve) => setTimeout(resolve, intervalTime * 10));
}
