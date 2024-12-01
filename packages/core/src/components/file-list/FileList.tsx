import React from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import { useUploadFilesProvider } from "../../providers";
import { FileListProps, UploadedFileItemStage } from "../../types";
import { FileListItem } from "./FileListItem";
import { Card, CardContent } from "@/src/ui/card";

export const FileList = ({ onDragEnd }: FileListProps) => {
  const { files, smStatusIsnt } = useUploadFilesProvider();
  const hasFiles = !!files.length;

  if (!hasFiles) return null;

  // container is scrollable, overflow-hidden instead auto is only set
  // because of react-dnd issue: https://github.com/atlassian/react-beautiful-dnd/issues/131#issuecomment-1634398431
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="file-upload-control"
        type="UploadedFile"
        isDropDisabled={smStatusIsnt("IDLE")}
      >
        {(provided: any, snapshot: any) => (
          <Card className="p-2">
            <CardContent
              className={`duration-75 transition-transform-colors-opacity ${
                snapshot.isDraggingOver ? "bg-primary/10" : ""
              }`}
            >
              <div className="flex flex-col gap-2" ref={provided.innerRef}>
                {files.map((file, index) => (
                  <Draggable
                    key={file.id}
                    draggableId={file.id}
                    index={index}
                    isDragDisabled={
                      smStatusIsnt("IDLE") ||
                      file.uploadStatus.stage === UploadedFileItemStage.FINISHED
                    }
                  >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <FileListItem
                          key={file.id}
                          name={file.name}
                          size={file.size}
                          id={file.id}
                          uploadStatus={file.uploadStatus}
                          previewImgSrc={file.previewImg?.imgBase64Uri}
                          order={file.order}
                          count={files.length}
                          draggableProvided={hasFiles ? provided : undefined}
                          draggableSnapshot={snapshot}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </CardContent>
          </Card>
        )}
      </Droppable>
    </DragDropContext>
  );
};
