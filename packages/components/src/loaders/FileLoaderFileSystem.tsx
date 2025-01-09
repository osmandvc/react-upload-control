import React, { useRef } from "react";

import { useUploadFilesProvider } from "@osmandvc/react-upload-control";

import { Button } from "../ui/button/Button";
import { FolderIcon } from "../ui/icons";

import { FileLoaderAction } from "../types";
import { cn } from "../lib/cn";

export const FileLoaderFileSystem = (props: FileLoaderAction) => {
  const defaultProps: Partial<FileLoaderAction> = {
    onlyIcon: false,
  };

  const { onlyIcon, className } = { ...defaultProps, ...props };

  const { addFiles } = useUploadFilesProvider();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files.length > 0) {
      const inputFiles = Array.from(e.target.files);
      addFiles(inputFiles);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        className="hidden"
        multiple
      />
      <Button
        className={cn(
          `${
            !onlyIcon && "justify-start"
          } rounded-lg  text-default-500 hover:text-primary hover:bg-primary/10 md:justify-center`,
          className
        )}
        onClick={handleButtonClick}
        startContent={
          <FolderIcon className="flex-shrink-0 pointer-events-none" />
        }
        isIconOnly={onlyIcon}
        variant="link"
      >
        {!onlyIcon && "Browse Files"}
      </Button>
    </>
  );
};
