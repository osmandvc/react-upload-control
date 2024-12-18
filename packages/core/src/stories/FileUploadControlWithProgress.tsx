"use client";
import React, { PropsWithChildren } from "react";
import { UploadedFilesProvider } from "../providers";
import { FileUploadControl } from "../FileUploadControl";
import { UploadedFile, UploadFileResult } from "../types";
import { processPdfToJpeg } from "@osmandvc/react-upload-control-processors";

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
          new Promise((resolveFile) => {
            const reader = new FileReader();
            let simulatedProgress = 0;

            const updateProgress = (increment: number) => {
              simulatedProgress += increment;
              if (simulatedProgress > 100) simulatedProgress = 100;
              onProgressChange(file.id, simulatedProgress);
              return simulatedProgress;
            };

            const throttleProgress = (
              start: number,
              end: number,
              duration: number
            ) => {
              return new Promise<void>((resolveThrottle) => {
                const steps = 10;
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

            onProgressChange(file.id, 0);

            let progressPromise = Promise.resolve();

            reader.onloadstart = () => {
              progressPromise = progressPromise.then(() =>
                throttleProgress(0, 25, 500)
              );
            };

            reader.onprogress = (event) => {
              if (event.lengthComputable) {
                const progressIncrement = (event.loaded / event.total) * 50;
                progressPromise = progressPromise.then(() =>
                  throttleProgress(25, 25 + progressIncrement, 1000)
                );
              }
            };

            reader.onload = () => {
              progressPromise
                .then(() => throttleProgress(75, 100, 500))
                .then(() => {
                  const base64String = reader.result as string;
                  localStorage.setItem(`file_${file.id}`, base64String);
                  resolveFile({
                    fileId: file.id,
                    success: true,
                  });
                })
                .catch((error) => {
                  const errorResult = {
                    fileId: file.id,
                    success: false,
                    error: {
                      text: `Failed to store file ${file.name} in localStorage`,
                      code: "STORAGE_ERROR",
                    },
                  };
                  onProgressChange(file.id, 100, errorResult.error);
                  resolveFile(errorResult);
                });
            };

            reader.onerror = () => {
              const errorResult = {
                fileId: file.id,
                success: false,
                error: {
                  text: `Failed to read file ${file.name}`,
                  code: "READ_ERROR",
                },
              };
              onProgressChange(file.id, 100, errorResult.error);
              resolveFile(errorResult);
            };

            reader.readAsDataURL(file.file!);
          })
      );

      Promise.all(uploadPromises).then(resolve);
    });
  }

  function handleFinish(files: UploadedFile[]) {
    console.log(files);
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-4 text-2xl font-semibold text-gray-500">
        Example with upload to local storage and upload progress (with
        throttling)
      </h1>
      <UploadedFilesProvider
        handlers={{
          onUpload: handleUpload,
          onFinish: handleFinish,
          preProcessFiles: {
            "application/pdf": processPdfToJpeg,
          },
        }}
        config={{ mimeTypes: ["image/png", "image/jpeg", "application/pdf"] }}
      >
        <FileUploadControl />
      </UploadedFilesProvider>
    </div>
  );
}

export default FileUploadControlWithProgress;
