import React, { useMemo, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useUploadFilesProvider } from "../../providers";
import { FileListProps, UploadedFileItemStage } from "../../types";
import { FileListItem } from "./FileListItem";
import { Card, CardContent } from "@/src/ui/card";

export const FileList = ({ onDragEnd }: FileListProps) => {
  const { files, smStatusIsnt } = useUploadFilesProvider();
  const hasFiles = !!files.length;

  // Memoize sensors to prevent recreation on each render
  const sensors = useSensors(
    useSensor(PointerSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Memoize file IDs array to prevent unnecessary re-renders of SortableContext
  const fileIds = useMemo(() => files.map((f) => f.id), [files]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = files.findIndex((file) => file.id === active.id);
      const newIndex = files.findIndex((file) => file.id === over.id);

      onDragEnd({
        source: { index: oldIndex },
        destination: { index: newIndex },
      });
    },
    [files, onDragEnd]
  );

  if (!hasFiles) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Card className="p-2">
        <CardContent>
          <SortableContext
            items={fileIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
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
                />
              ))}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};
