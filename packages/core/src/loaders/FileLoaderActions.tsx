import React from "react";

import { FileLoaderFileSystem } from ".";
import { FileLoaderCamera } from ".";
import { FileLoaderActionsProps } from "../types";

export const FileLoaderActions = (props: FileLoaderActionsProps) => {
  const defaultProps: FileLoaderActionsProps = {
    disableCamera: false,
    disableFileSystem: false,
    isMinimal: false,
  };

  const { disableCamera, disableFileSystem, isMinimal } = {
    ...defaultProps,
    ...props,
  };
  return (
    <>
      {!isMinimal && (
        <div className="flex flex-col gap-2">
          {!disableFileSystem && (
            <FileLoaderFileSystem className="md:justify-start" />
          )}
          {!disableCamera && <FileLoaderCamera className="md:justify-start" />}
        </div>
      )}
      {isMinimal && (
        <>
          <div className="flex gap-2 md:hidden">
            {!disableFileSystem && (
              <FileLoaderFileSystem onlyIcon className="text-xs" />
            )}
            {!disableCamera && (
              <FileLoaderCamera onlyIcon className="text-xs" />
            )}
          </div>
          <div className="hidden gap-2 md:flex">
            {!disableFileSystem && <FileLoaderFileSystem />}
            {!disableCamera && <FileLoaderCamera />}
          </div>
        </>
      )}
    </>
  );
};
