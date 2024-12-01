import { cn } from "@/src/utils";
import React, { PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

export const FileListContainer = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("flex flex-1 flex-col gap-6", className)}>
      {children}
    </div>
  );
};
