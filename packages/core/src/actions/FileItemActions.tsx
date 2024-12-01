import React from "react";

import { IconCheck } from "@tabler/icons-react";

import { useUploadFilesProvider } from "../providers/UploadedFilesManager";
import { UploadedFileItemStage } from "../types";
import { Button } from "../ui/button/Button";

type Props = {
  id: string;
  stage?: UploadedFileItemStage;
};

export const FileItemActions = ({ id, stage }: Props) => {
  const { deleteFile } = useUploadFilesProvider();

  return (
    <div className="flex items-center gap-2 p-2">
      {(!stage ||
        stage === UploadedFileItemStage.IDLE ||
        stage === UploadedFileItemStage.FAILED) && (
        <Button
          isIconOnly
          icon="DeleteIcon"
          variant="default"
          size="sm"
          className="text-gray-400 data-[hover=true]:bg-gray-200"
          onClick={() => deleteFile(id)}
        />
      )}
      {stage === UploadedFileItemStage.FINISHED && (
        <div className="p-2">
          <IconCheck color="green" />
        </div>
      )}
    </div>
  );
};
