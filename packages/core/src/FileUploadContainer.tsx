import React from "react";
import { PropsWithChildren } from "react";

import { cn } from "./utils";

/**
 * The Default Container for the File Upload Control
 */

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

export const FileUploadContainer = ({
  className,
  children,
}: ContainerProps) => {
  return <div className={cn(className, "h-full w-full")}>{children}</div>;
};
