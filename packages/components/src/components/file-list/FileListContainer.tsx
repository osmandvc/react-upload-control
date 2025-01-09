import React, { PropsWithChildren } from "react";
import { cn } from "../../lib/cn";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

export const FileListContainer = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("flex flex-col flex-1 gap-2", className)}>
      {children}
    </div>
  );
};
