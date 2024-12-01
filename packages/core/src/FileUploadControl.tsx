"use client";

import React from "react";

import { DropResult, ResponderProvided } from "@hello-pangea/dnd";

import {
  FileDropLarge,
  FileDropSmall,
  FileList,
  FileListActions,
  FileListContainer,
} from "./components";
import { useUploadFilesProvider } from "./providers";
import { FileUploadControlProps } from "./types";
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

  function handleOnDragEnd(result: DropResult, provided: ResponderProvided) {
    const { source, destination } = result;

    // If dropped outside the list, do nothing
    if (!destination) return;
    if (destination.index === source.index) return;

    const filesCopy = Array.from(files);

    const sourceFile = filesCopy.find(
      (file) => file.order! - 1 === source.index
    );
    const destinationFile = filesCopy.find(
      (file) => file.order! - 1 === destination.index
    );

    if (!sourceFile || !destinationFile)
      throw new Error("Failed to find the dragged Files.");

    const [removed] = filesCopy.splice(source.index, 1);

    // Insert the dragged item at its new position
    filesCopy.splice(destination.index, 0, removed);

    // Update the order property of each item based on its new index
    filesCopy.forEach((file, index) => {
      file.order = index + 1;
    });

    setFiles(filesCopy);
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-6 overflow-hidden p-4",
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
