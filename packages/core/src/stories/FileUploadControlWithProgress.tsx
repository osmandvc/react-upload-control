"use client";
import React, { PropsWithChildren } from "react";
import { UploadedFilesProvider } from "../providers";
import { FileUploadControl } from "../FileUploadControl";
import { UploadedFile, UploadFileResult } from "../types";

function FileUploadControlWithProgress(props: PropsWithChildren) {
  function handleUpload(
    files: UploadedFile[],
    onProgressChange: (
      fileId: string,
      progress: number,
      error?: {
        text: string;
        code: string;
      }
    ) => void
  ): Promise<UploadFileResult[]> {
    return new Promise((resolve) => {
      let uploadPromises: Promise<UploadFileResult>[] = files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            let simulatedProgress = 0; // Simulated progress value

            const updateProgress = (increment: number) => {
              simulatedProgress += increment;
              if (simulatedProgress > 100) simulatedProgress = 100;

              onProgressChange(file.id, simulatedProgress);

              return simulatedProgress;
            };

            // Simulate progress throttling
            const throttleProgress = (
              start: number,
              end: number,
              duration: number
            ) => {
              return new Promise<void>((resolveThrottle) => {
                const steps = 10; // Number of steps for the progress
                const stepTime = duration / steps;
                const stepIncrement = (end - start) / steps;
                let currentStep = 0;

                const interval = setInterval(() => {
                  if (currentStep < steps) {
                    updateProgress(stepIncrement);
                    currentStep++;
                  } else {
                    clearInterval(interval);
                    resolveThrottle();
                  }
                }, stepTime);
              });
            };

            // Initially, set progress to 0%
            onProgressChange(file.id, 0);

            reader.onloadstart = async () => {
              await throttleProgress(0, 25, 500); // Simulate progress to 25% over 500ms
            };

            reader.onprogress = async (event) => {
              if (event.lengthComputable) {
                const progressIncrement = (event.loaded / event.total) * 50;
                await throttleProgress(25, 25 + progressIncrement, 1000); // Simulate progress to 75% over 1 second
              }
            };

            reader.onload = async () => {
              try {
                // Simulate final progress update
                await throttleProgress(75, 100, 500);

                // Store the file in localStorage
                const base64String = reader.result as string;
                localStorage.setItem(`file_${file.id}`, base64String);

                resolve({
                  fileId: file.id,
                  success: true,
                });
              } catch (error) {
                const errorResult = {
                  fileId: file.id,
                  success: false,
                  error: {
                    text: `Failed to store file ${file.name} in localStorage`,
                    code: "STORAGE_ERROR",
                  },
                };
                onProgressChange(file.id, 100, errorResult.error);
                resolve(errorResult);
              }
            };

            reader.onerror = async () => {
              const errorResult = {
                fileId: file.id,
                success: false,
                error: {
                  text: `Failed to read file ${file.name}`,
                  code: "READ_ERROR",
                },
              };
              await throttleProgress(simulatedProgress, 100, 500);
              onProgressChange(file.id, 100, errorResult.error);
              resolve(errorResult);
            };

            // Start reading the file as base64
            reader.readAsDataURL(file.file!);
          })
      );

      // Wait for all file uploads to complete
      Promise.all(uploadPromises).then((results) => {
        resolve(results);
      });
    });
  }

  function handleFinish(files: UploadedFile[]) {
    console.log(files);
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-4 text-2xl font-semibold text-gray-500">
        Example with upload to local storage and upload progress
      </h1>
      <UploadedFilesProvider onUpload={handleUpload} onFinish={handleFinish}>
        <FileUploadControl />
      </UploadedFilesProvider>
    </div>
  );
}

export default FileUploadControlWithProgress;
