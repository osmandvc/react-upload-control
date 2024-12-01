"use client";
import React, { PropsWithChildren } from "react";
import { UploadedFilesProvider } from "../providers";
import { FileUploadControl } from "../FileUploadControl";
import { UploadedFile, UploadFileResult } from "../types";

function FileUploadControlTestError(props: PropsWithChildren) {
  function handleUploadWithError(
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
            // Initially, set progress to 0%
            onProgressChange(file.id, 0);

            // Halfway through (50% progress), after a delay
            setTimeout(() => {
              onProgressChange(file.id, 50);

              // Decide the fate of the upload randomly
              const success = Math.random() > 0.5;

              // Final progress update and setting the stage based on success
              setTimeout(() => {
                // Resolve with UploadFileResult based on the outcome
                const result: UploadFileResult = {
                  fileId: file.id,
                  success,
                };

                if (!success) {
                  result.error = {
                    text: `Executed onUpload for file ${file.name} with error`,
                    code: "UPLOAD_ERROR",
                  };
                }
                onProgressChange(file.id, 100, result.error);

                resolve(result);
              }, 1000); // Completing the upload after another second
            }, 1000); // Setting the progress to 50% after 1 second
          })
      );

      // Wait for all file uploads to complete
      Promise.all(uploadPromises).then((results) => {
        resolve(results);
      });
    });
  }

  function handleDelete(files: UploadedFile[]): Promise<UploadFileResult[]> {
    return new Promise((resolve) => {
      let uploadPromises: Promise<UploadFileResult>[] = files.map(
        (file) =>
          new Promise((resolve) => {
            // Initially, set progress to 0%

            // Halfway through (50% progress), after a delay
            setTimeout(() => {
              // Decide the fate of the upload randomly
              const success = Math.random() > 0.5;

              // Final progress update and setting the stage based on success
              setTimeout(() => {
                // Resolve with UploadFileResult based on the outcome
                const result: UploadFileResult = {
                  fileId: file.id,
                  success,
                };

                if (!success) {
                  result.error = {
                    text: `Executed onDelete for file ${file.name} with error`,
                    code: "DELETE_ERROR",
                  };
                }

                resolve(result);
              }, 1000); // Completing the upload after another second
            }, 1000); // Setting the progress to 50% after 1 second
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
    <UploadedFilesProvider
      onUpload={handleUploadWithError}
      onFinish={handleFinish}
    >
      <FileUploadControl />
    </UploadedFilesProvider>
  );
}

export default FileUploadControlTestError;
