import React from "react";

import { Progress } from "@/src/ui/progress";
import { filesize } from "filesize";

import { ImageZoom } from "@/src/ui/image-zoom";

import { FileItemActions } from "../../actions";
import {
  FileListItemProps,
  UploadStatus,
  UploadedFileItemStage,
} from "../../types";
import { ImagePlaceholderIcon, MoveIcon } from "../../ui/icons";
import { toast } from "sonner";

const ProgressBar = ({
  progress,
  variant,
}: UploadStatus & { variant?: "finished" | "removing" | "failed" }) => {
  return (
    <div className="flex items-center w-full">
      {!variant && <Progress value={progress} aria-label="progress bar" />}
      {variant === "finished" && (
        <Progress value={progress} className="bg-green-500" />
      )}
      {variant === "removing" && (
        <Progress value={progress} className="bg-yellow-500" />
      )}
      {variant === "failed" && (
        <Progress value={progress} className="bg-red-500" />
      )}
    </div>
  );
};

export const FileListItem = ({
  size,
  name,
  previewImgSrc,
  id,
  uploadStatus,
  draggableProvided,
  draggableSnapshot,
  order,
  count,
}: FileListItemProps) => {
  if (uploadStatus.stage === UploadedFileItemStage.FAILED) {
    toast.error(
      `Failed to upload file ${name}. Reason: ${uploadStatus.error?.text}`
    );
  }

  return (
    <div
      className={`flex flex-col rounded border duration-150 transition-transform-colors-opacity ${
        draggableSnapshot?.isDragging ? "bg-gray-50/70" : ""
      }`}
      {...draggableProvided?.dragHandleProps}
    >
      <div className="flex items-center h-full gap-4">
        {order && (
          <span className="pl-3 text-xs text-gray-500 dark:text-gray-300">
            {order}/{count}
          </span>
        )}
        {previewImgSrc ? (
          <ImageZoom>
            <div className="relative w-16 h-24 p-2 bg-gray-200/65 xs:h-20 xs:w-14">
              <img
                src={previewImgSrc}
                alt="Preview of File"
                className="object-contain w-full h-full rounded-lg"
              />
            </div>
          </ImageZoom>
        ) : (
          <ImagePlaceholderIcon className="hidden h-20 m-2 text-gray-400 w-14 xs:block" />
        )}

        <div className="flex items-center flex-1 min-w-0 gap-2">
          <div className="flex flex-col justify-center min-w-0 gap-2 ">
            <h3 className="max-w-full overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap xs:text-base">
              {name}
            </h3>
            {size && (
              <span className="text-xs text-gray-500 dark:text-gray-300">
                {filesize(size, { standard: "jedec", round: 1 })}
              </span>
            )}
          </div>
        </div>
        <FileItemActions id={id} stage={uploadStatus.stage} />
        {uploadStatus.stage === UploadedFileItemStage.IDLE && (
          <div
            className="flex items-center self-stretch p-3 bg-gray-200/65"
            {...draggableProvided?.dragHandleProps}
          >
            <MoveIcon />
          </div>
        )}
      </div>
      {uploadStatus.stage === UploadedFileItemStage.UPLOADING && (
        <ProgressBar progress={uploadStatus.progress} />
      )}

      {uploadStatus.stage === UploadedFileItemStage.FINISHED && (
        <ProgressBar variant="finished" progress={uploadStatus.progress} />
      )}

      {uploadStatus.stage === UploadedFileItemStage.FAILED && (
        <ProgressBar variant="failed" progress={100} />
      )}
    </div>
  );
};
