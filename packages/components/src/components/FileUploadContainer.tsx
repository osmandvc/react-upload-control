import { PropsWithChildren } from "react";
import { cn } from "../lib/cn";

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
  return <div className={cn(className, "w-full h-full")}>{children}</div>;
};
