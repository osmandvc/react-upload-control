import { UploadedFilesManager } from "./UploadedFilesManager";
import { UploadedFilesProviderProps } from "../types";
import { useState, useEffect } from "react";

export const UploadedFilesProvider = (props: UploadedFilesProviderProps) => {
  const { children, handlers } = props;
  const [ToasterComponent, setToasterComponent] = useState<any>(null);

  useEffect(() => {
    if (!handlers?.onAddFileError) {
      import("sonner")
        .then((mod) => {
          setToasterComponent(() => mod.Toaster);
        })
        .catch(() => {
          console.error(
            "sonner is not installed. Please install sonner or provide an onAddFileError handler."
          );
        });
    }
  }, [handlers?.onAddFileError]);

  return (
    <>
      {!handlers?.onAddFileError && ToasterComponent && (
        <ToasterComponent
          expand
          visibleToasts={5}
          toastOptions={{ duration: 3500 }}
        />
      )}
      <UploadedFilesManager {...props}>{children}</UploadedFilesManager>
    </>
  );
};
