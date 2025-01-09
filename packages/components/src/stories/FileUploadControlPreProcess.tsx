import { UploadedFile, UploadFileResult } from "../types";
import { UploadedFilesProvider } from "@osmandvc/react-upload-control";
import { processPdfToJpeg } from "@osmandvc/react-upload-control-processors";
import { FileUploadControl } from "../components/FileUploadControl";

function FileUploadTest() {
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
      <h1 className="mb-4 text-2xl font-semibold text-gray-500">
        Upload a pdf and watch the magic happen!
      </h1>
      <UploadedFilesProvider
        config={{
          mimeTypes: ["image/png", "image/jpeg", "application/pdf"],
        }}
        handlers={{
          onUpload: handleUpload,
          onFinish: handleFinish,
          preProcessFiles: {
            "application/pdf": processPdfToJpeg,
          },
        }}
      >
        <FileUploadControl />
      </UploadedFilesProvider>
    </div>
  );
}

export default FileUploadTest;
