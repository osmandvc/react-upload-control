"use client";

import React from "react";
import { arrayMove } from "@dnd-kit/sortable";

import {
  FileDropLarge,
  FileDropSmall,
  FileList,
  FileListActions,
  FileListContainer,
} from "./components";
import { useUploadFilesProvider } from "./providers";
import { DndResult, FileUploadControlProps } from "./types";
import { cn } from "./utils";

/**
 * The Default File-Upload-Control Component with a Drop-Area and a List which displays the Files.
 */
export const FileUploadControl = ({
  className,
  children,
  disableCamera,
  disableFileSystem,
  size = "auto",
}: FileUploadControlProps) => {
  const { files, setFiles, smStatusIs } = useUploadFilesProvider();
  const hasFiles = !!files.length;

  function handleOnDragEnd(result: DndResult) {
    const { source, destination } = result;

    // If dropped outside the list or at the same position, do nothing
    if (!destination || source.index === destination.index) {
      return;
    }

    setFiles((prevFiles) => {
      const newFiles = arrayMove(prevFiles, source.index, destination.index);
      return newFiles.map((file, index) => ({ ...file, order: index + 1 }));
    });
  }

  return (
    <div
      className={cn(
        "flex overflow-hidden flex-col gap-6 p-4 w-full h-full",
        className
      )}
    >
      {(smStatusIs("IDLE") || smStatusIs("PROCESSING")) && (
        <>
          <FileDropSmall
            disableCamera={disableCamera}
            disabled={smStatusIs("PROCESSING")}
            disableFileSystem={disableFileSystem}
            className={cn({
              flex: size === "sm",
              hidden: size === "lg",
              "flex xsh:hidden": size === "auto",
              "blur-sm": smStatusIs("PROCESSING"),
            })}
          >
            {children}
          </FileDropSmall>
          <FileDropLarge
            disableCamera={disableCamera}
            disableFileSystem={disableFileSystem}
            disabled={smStatusIs("PROCESSING")}
            className={cn({
              flex: size === "lg",
              hidden: size === "sm",
              "hidden xsh:flex": size === "auto",
            })}
          >
            {children}
          </FileDropLarge>
        </>
      )}
      {hasFiles && (
        <FileListContainer>
          <FileListActions />
          <FileList onDragEnd={handleOnDragEnd} />
        </FileListContainer>
      )}
    </div>
  );
};
