import React from "react";
import { useIntl } from "react-intl"; // Import useIntl from react-intl

import { useUploadFilesProvider } from "../providers/UploadedFilesManager";
import { Button } from "../ui/button/Button";
import { ResetIcon } from "../ui/icons";

export const FileDeleteAllButton = () => {
  const { files, deleteAllFiles, smStatusIs } = useUploadFilesProvider();
  const intl = useIntl(); // Use useIntl from react-intl

  return (
    <Button
      variant="default"
      color="default"
      size="sm"
      endContent={<ResetIcon size="18px" />}
      disabled={!files.length || smStatusIs("PROCESSING")}
      onClick={deleteAllFiles}
    >
      {intl.formatMessage({ id: "FileDeleteAllButton.reset" })}{" "}
      {/* Use formatMessage */}
    </Button>
  );
};
