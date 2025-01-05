import React, { useRef } from "react";
import { FormattedMessage } from "react-intl";

import { useUploadFilesProvider } from "../providers/UploadedFilesManager";

import { Button } from "../ui/button/Button";
import { FolderIcon } from "../ui/icons";
import { cn } from "../utils";
import { FileLoaderAction } from "../types";

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
      {!onlyIcon && <FormattedMessage id="FileLoaderFileSystem.text" />}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
        multiple
      />
    </Button>
  );
};
