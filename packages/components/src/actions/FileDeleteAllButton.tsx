import { useUploadFilesProvider } from "@osmandvc/react-upload-control";
import { Button } from "../ui/button/Button";
import { ResetIcon } from "../ui/icons";

export const FileDeleteAllButton = () => {
  const { files, deleteAllFiles, smStatusIs } = useUploadFilesProvider();

  return (
    <Button
      variant="default"
      color="default"
      size="sm"
      endContent={<ResetIcon size="18px" />}
      disabled={!files.length || smStatusIs("PROCESSING")}
      onClick={deleteAllFiles}
    >
      Reset
    </Button>
  );
};
