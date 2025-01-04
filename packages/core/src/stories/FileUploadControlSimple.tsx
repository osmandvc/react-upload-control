"use client";
import React, { PropsWithChildren } from "react";
import { UploadedFilesProvider } from "../providers";
import { FileUploadControl } from "../components/FileUploadControl";
import { UploadedFile, UploadFileResult } from "../types";

function FileUploadControlSimple(props: PropsWithChildren) {
  async function handleUpload(
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
    const results = await Promise.all(
      files.map(async (file) => {
        // Set progress directly to 100%
        onProgressChange(file.id, 100);

        return {
          fileId: file.id,
          success: true,
          metadata: {
            field: "John Doe",
          },
        } as UploadFileResult;
      })
    );

    return results;
  }

  function handleFinish(files: UploadedFile[]) {
    console.log("Finished uploading files:", files);
  }

  return (
    <div className="max-w-lg">
      <UploadedFilesProvider
        config={{
          mimeTypes: ["image/png", "image/jpeg", "application/pdf"],
          disableSorting: true,
        }}
        handlers={{
          onUpload: handleUpload,
          onFinish: handleFinish,
        }}
      >
        <FileUploadControl />
      </UploadedFilesProvider>
    </div>
  );
}

export default FileUploadControlSimple;
