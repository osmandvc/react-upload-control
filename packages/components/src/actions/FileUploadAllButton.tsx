import { useUploadFilesProvider } from "@osmandvc/react-upload-control";
import { CheckIcon } from "../ui/icons";
import { Button } from "../ui/button/Button";

export const FileUploadAllButton = () => {
  const { uploadAllFiles, files, smStatusIs } = useUploadFilesProvider();

  return (
    <Button
      variant="default"
      size="sm"
      className="flex-grow max-w-2xl bg-primary/10 text-primary hover:bg-primary/20"
      disabled={!files.length || smStatusIs("PROCESSING")}
      endContent={<CheckIcon size="20px" />}
      onClick={uploadAllFiles}
    >
      {smStatusIs("ERROR") ? "Retry" : "Confirm Files"}
    </Button>
  );
};
