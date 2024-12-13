import React from "react";

import { FileDeleteAllButton, FileUploadAllButton } from "../../actions";
import { useUploadFilesProvider } from "../../providers";
import { FormattedMessage } from "react-intl";

export const FileListActions = () => {
  const { smStatusIsnt, smStatusIs } = useUploadFilesProvider();

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex gap-2 items-center w-full">
        {smStatusIsnt("PROCESSING") && <FileDeleteAllButton />}
        {(smStatusIs("IDLE") || smStatusIs("ERROR")) && <FileUploadAllButton />}
      </div>
      {smStatusIs("FINISHED") && (
        <span className="self-end text-xs text-primary text-nowrap">
          <FormattedMessage id="FileListActions.successText" />
        </span>
      )}
    </div>
  );
};
