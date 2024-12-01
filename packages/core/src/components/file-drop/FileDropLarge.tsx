import React from "react";

import { FileLoaderActions } from "../../loaders";
import { FileLoaderActionsProps } from "../../types";
import { cn } from "../../utils";
import { FileDropArea } from "./FileDropArea";
import { Card, CardContent } from "@/src/ui/card";
import { IconLoader2 } from "@tabler/icons-react";

export const FileDropLarge = ({
  children,
  disableCamera,
  disableFileSystem,
  className,
  disabled,
}: FileLoaderActionsProps & {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative">
      <Card className={cn("p-4 w-full", className)}>
        <CardContent className="space-y-2 w-full">
          <FileDropArea />
          <FileLoaderActions
            disableCamera={disableCamera}
            disableFileSystem={disableFileSystem}
          />
          {children}
        </CardContent>
      </Card>
      {disabled && (
        <div className="flex absolute inset-0 justify-center items-center w-full h-full bg-opacity-80 backdrop-blur-sm cursor-default">
          <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};
