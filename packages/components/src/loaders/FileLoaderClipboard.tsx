import React, { useEffect } from "react";
import { FileLoaderAction } from "../types";
import { Button } from "../ui/button";

import { ClipboardIcon } from "../ui/icons";
import { useUploadFilesProvider } from "@osmandvc/react-upload-control";
import { cn } from "../lib/cn";

export const FileLoaderClipboard = (props: FileLoaderAction) => {
  const defaultProps: Partial<FileLoaderAction> = {
    onlyIcon: false,
  };

  const { onlyIcon, className } = { ...defaultProps, ...props };
  const { addFiles, getValidationInfo } = useUploadFilesProvider();

  const handleClipboardRead = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      let files = [];
      const { types } = getValidationInfo();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const mimeType = type.split("/")[1];
          if (types.includes(mimeType)) {
            const blob = await clipboardItem.getType(type);
            const file = new File(
              [blob],
              `clipboard-${Date.now()}.${type.split("/")[1]}`,
              { type }
            );
            files.push(file);
          }
        }
      }
      if (files.length > 0) {
        addFiles(files);
      }
    } catch (error) {
      console.error("Failed to read clipboard contents:", error);
    }
  };

  return (
    <Button
      className={cn(
        `${
          !onlyIcon && "justify-start"
        } rounded-lg  text-default-500 hover:text-primary hover:bg-primary/10 md:justify-center`,
        className
      )}
      onClick={handleClipboardRead}
      startContent={
        <ClipboardIcon className="flex-shrink-0 pointer-events-none" />
      }
      isIconOnly={onlyIcon}
      variant="link"
    >
      {!onlyIcon && "Insert from Clipboard"}
    </Button>
  );
};

export default FileLoaderClipboard;
