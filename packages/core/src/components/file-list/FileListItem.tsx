import React, { useMemo } from "react";
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

const ProgressBar = React.memo(
  ({
    progress,
    variant,
  }: UploadStatus & { variant?: "finished" | "removing" | "failed" }) => {
    return (
      <div className="w-full">
        {!variant && <Progress value={progress} aria-label="progress bar" />}
        {variant === "finished" && (
          <Progress
            value={progress}
            className="rounded-r-lg rounded-l-lg bg-primary"
          />
        )}
        {variant === "failed" && (
          <Progress
            value={progress}
            className="bg-red-500 rounded-r-lg rounded-l-lg"
          />
        )}
      </div>
    );
  }
);

export const FileListItem = ({
  size,
  name,
  previewImgSrc,
  id,
  uploadStatus,
  order,
  count,
  disabled,
  disableSorting,
}: FileListItemProps) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
    disabled: disabled || disableSorting,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    width: "100%",
  };

  if (uploadStatus.stage === UploadedFileItemStage.FAILED) {
    toast.error(
      `Failed to upload file ${name}. Reason: ${uploadStatus.error?.text}`
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex flex-col rounded border duration-150 transition-transform-colors-opacity">
        <div className="flex gap-4 items-center h-full">
          {!disableSorting && order && (
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
            <div className="relative p-2 w-16 h-24 bg-gray-200/65 xs:h-20 xs:w-14">
              <ImagePlaceholderIcon className="w-full h-full text-primary/50" />
            </div>
          )}

          <div className="flex flex-1 gap-2 items-center min-w-0">
            <div className="flex flex-col gap-2 justify-center min-w-0">
              <h3 className="overflow-hidden max-w-full text-xs font-semibold whitespace-nowrap text-ellipsis xs:text-sm">
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
          {uploadStatus.stage === UploadedFileItemStage.IDLE &&
            !disableSorting && (
              <div
                className="flex items-center self-stretch p-3 bg-gray-200/65 cursor-grab active:cursor-grabbing"
                {...listeners}
              >
                <MoveIcon className="w-5 h-5" />
              </div>
            )}
        </div>
        {uploadStatus.stage === UploadedFileItemStage.UPLOADING && (
          <div className="pt-0">
            <ProgressBar progress={uploadStatus.progress} />
          </div>
        )}
        {uploadStatus.stage === UploadedFileItemStage.FINISHED && (
          <div className="pt-0">
            <ProgressBar progress={100} variant="finished" />
          </div>
        )}
        {uploadStatus.stage === UploadedFileItemStage.FAILED && (
          <div className="pt-0">
            <ProgressBar progress={100} variant="failed" />
          </div>
        )}
      </div>
    </div>
  );
};
