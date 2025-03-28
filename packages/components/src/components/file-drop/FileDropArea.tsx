import { useRef, ChangeEvent } from "react";
import { type DragEvent } from "react";

import { useUploadFilesProvider } from "@osmandvc/react-upload-control";
import { FileDropProps } from "../../types";
import { LoaderIcon, UploadIcon } from "../../ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

export const FileDropArea = (props: FileDropProps) => {
  const defaultProps: Partial<FileDropProps> = {
    isMinimal: false,
  };

  const { children, isMinimal } = {
    ...defaultProps,
    ...props,
  };

  const { addFiles, getValidationInfo, smStatusIs } = useUploadFilesProvider();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { types, maxFileSizeMb } = getValidationInfo();

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files.length > 0) {
      const inputFiles = Array.from(e.target.files);
      addFiles(inputFiles);
      e.target.value = "";
    }
  };

  // Needed to prevent the default behavior (image opens in new tab, onDrop doesnt trigger)
  const handleDrag = (e: DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropzoneClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const Processing = () => (
    <div className="flex gap-2 items-center text-default-500">
      Processing...
      <LoaderIcon size={16} />
    </div>
  );

  return (
    <>
      {!isMinimal && (
        <div
          className={`flex flex-col p-4 px-4 w-full rounded-3xl border border-gray-400 border-dashed duration-75 cursor-pointer transition-transform-colors-opacity hover:bg-primary/10 hover:text-primary`}
          onClick={handleDropzoneClick}
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInputChange}
            disabled={smStatusIs("PROCESSING")}
          />
          <div className="grid gap-5 place-items-center p-3 text-sm text-center">
            <div className="p-3 rounded-full">
              <UploadIcon size={25} />
            </div>
            {(smStatusIs("IDLE") || smStatusIs("PROCESSING")) && (
              <>
                <p>Drop files here or click to upload</p>
                <p className="text-xs text-gray-400">
                  Accepted files:{" "}
                  {types.map((mimeType) => mimeType.toUpperCase()).join(", ")}
                  {maxFileSizeMb ? ` • Max file size: ${maxFileSizeMb}MB` : ""}
                </p>
              </>
            )}
            {/* {smStatusIs("PROCESSING") && <Processing />} */}
          </div>
        </div>
      )}
      {isMinimal && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`grid flex-1 place-items-center px-4 duration-75 cursor-pointer bg-primary/10 transition-transform-colors-opacity hover:text-primary`}
                onClick={handleDropzoneClick}
                onDrop={handleDrop}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={smStatusIs("PROCESSING")}
                />
                <div className="p-3">
                  {smStatusIs("IDLE") && <UploadIcon size={20} />}
                  {smStatusIs("PROCESSING") && <Processing />}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs max-w-20 text-wrap">
                Drop files here or click to upload
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};
