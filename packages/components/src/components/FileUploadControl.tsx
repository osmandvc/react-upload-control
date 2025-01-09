import "../styles/tailwind.css";
import { arrayMove } from "@dnd-kit/sortable";
import { cn } from "../lib/cn";
import { DndResult, FileUploadControlProps } from "../types";
import { FileList, FileListActions, FileListContainer } from "./file-list";
import { FileDropLarge, FileDropSmall } from "./file-drop";
import { useUploadFilesProvider } from "@osmandvc/react-upload-control";

/**
 * The Default File-Upload-Control Component with a Drop-Area and a List which displays the Files.
 */
export const FileUploadControl = ({
  className,
  children,
  disableCamera,
  disableFileSystem,
  size = "auto",
}: FileUploadControlProps) => {
  const { files, setFiles, smStatusIs } = useUploadFilesProvider();
  const hasFiles = !!files.length;

  function handleOnDragEnd(result: DndResult) {
    const { source, destination } = result;

    // If dropped outside the list or at the same position, do nothing
    if (!destination || source.index === destination.index) {
      return;
    }

    setFiles((prevFiles) => {
      const newFiles = arrayMove(prevFiles, source.index, destination.index);
      return newFiles.map((file, index) => ({ ...file, order: index + 1 }));
    });
  }

  return (
    <div
      className={cn(
        "grid grid-rows-[auto,1fr] gap-6 p-4 w-full h-full ",
        className
      )}
    >
      <div
        className={cn("transition-all duration-300 ease-in-out origin-top", {
          "opacity-0 scale-y-0 h-0": !(
            smStatusIs("IDLE") || smStatusIs("PROCESSING")
          ),
          "opacity-100 scale-y-100":
            smStatusIs("IDLE") || smStatusIs("PROCESSING"),
        })}
      >
        <FileDropSmall
          disableCamera={disableCamera}
          disabled={smStatusIs("PROCESSING")}
          disableFileSystem={disableFileSystem}
          className={cn({
            flex: size === "sm",
            hidden: size === "lg",
            "flex xsh:hidden": size === "auto",
            "blur-sm": smStatusIs("PROCESSING"),
          })}
        >
          {children}
        </FileDropSmall>
        <FileDropLarge
          disableCamera={disableCamera}
          disableFileSystem={disableFileSystem}
          disabled={smStatusIs("PROCESSING")}
          className={cn({
            flex: size === "lg",
            hidden: size === "sm",
            "hidden xsh:flex": size === "auto",
          })}
        >
          {children}
        </FileDropLarge>
      </div>
      <div
        className={cn("min-h-0 transition-all duration-300 ease-in-out", {
          "opacity-0": !hasFiles,
          "opacity-100": hasFiles,
        })}
      >
        {hasFiles && (
          <FileListContainer>
            <FileListActions />
            <FileList onDragEnd={handleOnDragEnd} />
          </FileListContainer>
        )}
      </div>
    </div>
  );
};
