import React, { useMemo, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { FileListProps, UploadedFileItemStage } from "../../types";
import { FileListItem } from "./FileListItem";
import { Card, CardContent } from "../../ui/card";
import { useUploadFilesProvider } from "@osmandvc/react-upload-control";

export const FileList = ({ onDragEnd }: FileListProps) => {
  const { files, smStatusIsnt, disableSorting } = useUploadFilesProvider();
  const hasFiles = !!files.length;

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fileIds = useMemo(() => files.map((f) => f.id), [files]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = fileIds.findIndex((id) => id === active.id);
      const newIndex = fileIds.findIndex((id) => id === over.id);

      onDragEnd?.({
        source: { index: oldIndex },
        destination: { index: newIndex },
      });
    },
    [fileIds, onDragEnd]
  );

  if (!hasFiles) return null;

  // TODO: Clean up and move to own component
  if (disableSorting) {
    return (
      <Card className="p-2">
        <CardContent>
          <div className="flex overflow-y-auto overflow-x-hidden flex-col gap-2 max-h-72 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex flex-col rounded border duration-150 transition-transform-colors-opacity"
              >
                <FileListItem
                  name={file.name}
                  size={file.size}
                  id={file.id}
                  uploadStatus={file.uploadStatus}
                  previewImgSrc={file.previewImg?.imgBase64Uri}
                  count={files.length}
                  disabled={true}
                  disableSorting={disableSorting}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      autoScroll={{
        acceleration: 1,
        threshold: {
          x: 0, // Disable horizontal scrolling
          y: 0.2,
        },
        interval: 5,
      }}
    >
      <Card className="p-2">
        <CardContent>
          <SortableContext
            items={fileIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex overflow-y-auto overflow-x-hidden flex-col gap-2 max-h-72 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {files.map((file) => (
                <FileListItem
                  key={file.id}
                  name={file.name}
                  size={file.size}
                  id={file.id}
                  uploadStatus={file.uploadStatus}
                  previewImgSrc={file.previewImg?.imgBase64Uri}
                  order={file.order}
                  count={files.length}
                  disabled={
                    smStatusIsnt("IDLE") ||
                    file.uploadStatus.stage === UploadedFileItemStage.FINISHED
                  }
                  disableSorting={disableSorting}
                />
              ))}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};
