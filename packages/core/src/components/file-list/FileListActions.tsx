import React from "react";

import { FileDeleteAllButton, FileUploadAllButton } from "../../actions";
import { useUploadFilesProvider } from "../../providers";
import { FormattedMessage } from "react-intl";

export const FileListActions = () => {
  const { smStatusIs } = useUploadFilesProvider();

  return (
    <div className="flex items-center justify-center w-full">
      {(smStatusIs("IDLE") || smStatusIs("ERROR")) && (
        <div className="flex items-center w-full gap-2">
          <FileDeleteAllButton />
          <FileUploadAllButton />
        </div>
      )}
      {smStatusIs("SUCCESS") && (
        <span className="text-sm">
          <FormattedMessage id="FileListActions.successText" />
        </span>
      )}
    </div>
  );
};
