import React from "react";

import { FileLoaderActions } from "../../loaders";
import { FileLoaderActionsProps } from "../../types";

import { FileDropArea } from "./FileDropArea";
import { Separator } from "../../ui/seperator";
import { cn } from "../../lib/cn";

export const FileDropSmall = ({
  children,
  disableCamera,
  disableFileSystem,
  className,
}: FileLoaderActionsProps & {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col max-w-2xl rounded-lg border bg-background",
        className
      )}
    >
      <div className="flex justify-between items-center">
        <FileDropArea isMinimal />
        <Separator orientation="vertical" />
        <div className="mx-2 md:flex-1">
          <FileLoaderActions
            disableCamera={disableCamera}
            disableFileSystem={disableFileSystem}
            isMinimal
          />
        </div>
      </div>
      {children && <Separator />}
      <div>{children}</div>
    </div>
  );
};
