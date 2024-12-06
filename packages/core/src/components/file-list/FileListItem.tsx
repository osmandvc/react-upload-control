import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  order,
  count,
  disabled,
}: FileListItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    disabled: disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (uploadStatus.stage === UploadedFileItemStage.FAILED) {
    toast.error(
      `Failed to upload file ${name}. Reason: ${uploadStatus.error?.text}`
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col rounded border duration-150 transition-transform-colors-opacity ${
        isDragging ? "bg-gray-50/70" : ""}`}
      {...attributes}
    >
      <div className="flex gap-4 items-center h-full">
        {order && (
          <span className="pl-3 text-xs text-gray-500 dark:text-gray-300">
            {order}/{count}
          </span>
        )}
        {previewImgSrc ? (
          <ImageZoom>
            <div className="relative p-2 w-16 h-24 bg-gray-200/65 xs:h-20 xs:w-14">
              <img
                src={previewImgSrc}
                alt="Preview of File"
                className="object-contain w-full h-full rounded-lg"
              />
            </div>
          </ImageZoom>
        ) : (
          <ImagePlaceholderIcon className="hidden m-2 w-14 h-20 text-gray-400 xs:block" />
        )}

        <div className="flex flex-1 gap-2 items-center min-w-0">
          <div className="flex flex-col gap-2 justify-center min-w-0">
            <h3 className="overflow-hidden max-w-full text-xs font-semibold whitespace-nowrap text-ellipsis xs:text-base">
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
            className="flex items-center self-stretch p-3 bg-gray-200/65 cursor-grab active:cursor-grabbing"
            {...listeners}
          >
            <MoveIcon />
          </div>
        )}
      </div>
      {uploadStatus.stage === UploadedFileItemStage.UPLOADING && (
        <div className="p-3 pt-0">
          <ProgressBar progress={uploadStatus.progress} />
        </div>
      )}
      {uploadStatus.stage === UploadedFileItemStage.FINISHED && (
        <div className="p-3 pt-0">
          <ProgressBar progress={100} variant="finished" />
        </div>
      )}
      {uploadStatus.stage === UploadedFileItemStage.REMOVING && (
        <div className="p-3 pt-0">
          <ProgressBar progress={100} variant="removing" />
        </div>
      )}
      {uploadStatus.stage === UploadedFileItemStage.FAILED && (
        <div className="p-3 pt-0">
          <ProgressBar progress={100} variant="failed" />
        </div>
      )}
    </div>
  );
};
