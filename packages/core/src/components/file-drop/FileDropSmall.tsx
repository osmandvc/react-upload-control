import React, { PropsWithChildren } from "react";



import { FileLoaderActions } from "../../loaders";
import { FileLoaderActionsProps } from "../../types";
import { cn } from "../../utils";
import { FileDropArea } from "./FileDropArea";
import { Separator } from "@/src/ui/seperator";

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
      className={cn("flex flex-col rounded-lg border bg-background", className)}
    >
      <div className="flex items-center justify-between">
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
