import { cn } from "@/src/utils";
import React, { PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

export const FileListContainer = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("flex flex-col flex-1 gap-6", className)}>
      {children}
    </div>
  );
};
