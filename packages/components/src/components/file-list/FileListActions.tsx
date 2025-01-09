import { FileDeleteAllButton, FileUploadAllButton } from "../../actions";
import { useUploadFilesProvider } from "@osmandvc/react-upload-control";

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
          Files successfully uploaded.
        </span>
      )}
    </div>
  );
};
