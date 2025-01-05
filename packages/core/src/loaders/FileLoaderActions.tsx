import React from "react";

import { FileLoaderFileSystem } from "./FileLoaderFileSystem";
import { FileLoaderCamera } from "./FileLoaderCamera";
import { FileLoaderActionsProps } from "../types";
import FileLoaderClipboard from "./FileLoaderClipboard";

export const FileLoaderActions = (props: FileLoaderActionsProps) => {
  const defaultProps: FileLoaderActionsProps = {
    disableCamera: false,
    disableFileSystem: false,
    disableClipboard: false,
    isMinimal: false,
  };

  const { disableCamera, disableFileSystem, disableClipboard, isMinimal } = {
    ...defaultProps,
    ...props,
  };
  return (
    <>
      {!isMinimal && (
        <div className="flex flex-col gap-2">
          {!disableFileSystem && (
            <FileLoaderFileSystem className="text-sm md:justify-start" />
          )}
          {!disableCamera && (
            <FileLoaderCamera className="text-sm md:justify-start" />
          )}
          {!disableClipboard && (
            <FileLoaderClipboard className="text-sm md:justify-start" />
          )}
        </div>
      )}
      {isMinimal && (
        <>
          <div className="flex gap-2 sm:hidden">
            {!disableFileSystem && (
              <FileLoaderFileSystem onlyIcon className="text-xs" />
            )}
            {!disableCamera && (
              <FileLoaderCamera onlyIcon className="text-xs" />
            )}
            {!disableClipboard && (
              <FileLoaderClipboard onlyIcon className="text-xs" />
            )}
          </div>
          <div className="hidden gap-2 sm:flex">
            {!disableFileSystem && <FileLoaderFileSystem className="text-xs" />}
            {!disableCamera && <FileLoaderCamera className="text-xs" />}
            {!disableClipboard && <FileLoaderClipboard className="text-xs" />}
          </div>
        </>
      )}
    </>
  );
};
