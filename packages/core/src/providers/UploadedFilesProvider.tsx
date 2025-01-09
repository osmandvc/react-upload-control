import { UploadedFilesManager } from "./UploadedFilesManager";

import { UploadedFilesProviderProps } from "../types";

import { Toaster } from "sonner";

export const UploadedFilesProvider = (props: UploadedFilesProviderProps) => {
  const { children } = props;

  return (
    <>
      <Toaster expand visibleToasts={5} toastOptions={{ duration: 3500 }} />
      <UploadedFilesManager {...props}>{children}</UploadedFilesManager>
    </>
  );
};
