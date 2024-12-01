import React from "react";
import { useIntl } from "react-intl"; // Import useIntl from react-intl

import { useUploadFilesProvider } from "../providers/UploadedFilesManager";
import { CheckIcon } from "../ui/icons";
import { Button } from "@/src/ui/button/Button";

export const FileUploadAllButton = () => {
  const { uploadAllFiles, files, smStatusIs } = useUploadFilesProvider();
  const intl = useIntl(); // Use useIntl from react-intl

  return (
    <Button
      variant="success"
      size="sm"
      className="flex-grow max-w-2xl"
      disabled={!files.length || smStatusIs("PROCESSING")}
      endContent={<CheckIcon size="20px" />}
      onClick={uploadAllFiles}
    >
      {smStatusIs("ERROR")
        ? intl.formatMessage({ id: "FileUploadAllButton.retry" })
        : intl.formatMessage({ id: "FileUploadAllButton.accept" })}
    </Button>
  );
};
