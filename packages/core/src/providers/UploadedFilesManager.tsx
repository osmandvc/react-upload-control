"use client";

import React, { createContext, useState } from "react";
import { useIntl } from "react-intl";

import { nanoid } from "nanoid";
import { toast } from "sonner";
import { FormattedMessage } from "react-intl";

import { SUPPORTED_MIME_TYPES } from "@/src/utils/file-types";
import { blobToBase64 } from "@/src/utils/image-processing";

import { useStateMachine } from "../hooks";
import {
  FileDropError,
  FileDropErrorType,
  FilePreProcessor,
  UploadFileResult,
  UploadedFile,
  UploadedFileItemStage,
  UploadedFilePublic,
  UploadedFilesManagerProps,
  FileUploadConfig,
} from "../types";
import { isFileDropError } from "../utils";

export interface ContextProps {
  files: UploadedFile[];
  smStatus: string;
  updateFile: (name: string, uploadedFileProps: Partial<UploadedFile>) => void;
  uploadAllFiles: () => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  deleteAllFiles: () => Promise<void>;
  addFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  updateFileStage: (name: string, status: UploadedFileItemStage) => void;
  getFile: (id: string) => UploadedFile | undefined;
  smStatusIs: (...args: string[]) => boolean;
  smStatusIsnt: (...args: string[]) => boolean;
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  resetControl: (files: UploadedFile[]) => void;
  getValidationInfo: () => { types: string[]; maxFileSizeMb: number };
  disableSorting: boolean;
}

const UploadedFilesContext = createContext<ContextProps | undefined>(undefined);

const defaultConfig: FileUploadConfig = {
  mimeTypes: SUPPORTED_MIME_TYPES.filter((type) => type.startsWith("image")),
  multiple: true,
  maxFileSizeMb: 10,
  resetOnFinish: false,
  disableSorting: false,
};

const UploadedFilesManager = (props: UploadedFilesManagerProps) => {
  const { children, config = defaultConfig, handlers, initFiles } = props;

  const { onUpload, onFinish, onAddFileError, onDelete, preProcessFiles } =
    handlers;

  const {
    mimeTypes = defaultConfig.mimeTypes!,
    multiple = defaultConfig.multiple,
    maxFileSizeMb = defaultConfig.maxFileSizeMb!,
    maxFiles,
    resetOnFinish = defaultConfig.resetOnFinish,
    disableSorting = defaultConfig.disableSorting!,
  } = config;

  const [files, setFiles] = useState(initFiles ?? []);

  const { smStatus, smSetStatus, smStatusIs, smStatusIsnt } =
    useStateMachine("IDLE");
  const intl = useIntl();

  function toastError(error: FileDropError | unknown) {
    isFileDropError(error)
      ? toast.error(error.error.text)
      : toast.error(
          <FormattedMessage
            id="UploadedFilesManager.unknownError"
            values={{ error: String(error) }}
          />
        );
  }

  function getValidationInfo() {
    return {
      types: mimeTypes.map((type) => type.split("/")[1]),
      maxFileSizeMb,
    };
  }

  function checkIfAllFilesFinished(files: UploadedFile[]) {
    if (!files.length || smStatusIs("PROCESSING")) return false;

    return files.every(
      (file) => file.uploadStatus.stage === UploadedFileItemStage.FINISHED
    );
  }

  function validateFiles(filesInput: File[] | UploadedFilePublic[]) {
    let validFiles: (File | UploadedFilePublic)[] = [];
    let errors: FileDropError[] = [];
    const errorHandler = onAddFileError ?? toastError;

    if (!multiple && filesInput.length > 1) {
      errors.push({
        error: {
          type: FileDropErrorType.MULTIPLE_NOT_ALLOWED,
          text: intl.formatMessage({
            id: "UploadedFilesManager.multipleError",
          }),
        },
      });
      errorHandler(errors[0]);
      return { validFiles, errors };
    }

    if (
      maxFiles &&
      (filesInput.length > maxFiles ||
        filesInput.length + files.length > maxFiles)
    ) {
      errors.push({
        error: {
          text: intl.formatMessage(
            {
              id: "UploadedFilesManager.maxFilesNumberError",
            },
            {
              maxFiles,
            }
          ),
          type: FileDropErrorType.MAX_FILES_NUMBER,
        },
      });
      errorHandler(errors[0]);
      return { validFiles, errors };
    }
    filesInput.forEach((file) => {
      if (!mimeTypes.includes(file.type)) {
        const error = {
          error: {
            text: intl.formatMessage(
              { id: "UploadedFilesManager.invalidFileError" },
              {
                mimeTypes: mimeTypes.toString(),
                fileName: file.name,
              }
            ),

            type: FileDropErrorType.INVALID_FILE,
          },
        };
        errors.push(error);
        errorHandler(error);
      } else if (file.size! * Math.pow(10, -6) > maxFileSizeMb) {
        const error = {
          error: {
            text: intl.formatMessage(
              { id: "UploadedFilesManager.fileSizeError" },
              {
                fileName: file.name,
              }
            ),
            type: FileDropErrorType.MAXSIZE,
          },
        };
        errors.push(error);
        errorHandler(error);
      } else {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  }

  async function applyPreProcessingAndUpdateFiles(
    uploadedFile: UploadedFilePublic,
    preProcessFiles: FilePreProcessor,
    currentFiles: UploadedFilePublic[]
  ): Promise<UploadedFilePublic[] | undefined> {
    const updatedFiles = [...currentFiles];

    // get pre-processing function, if set. null = ignore, undefined = not found, other = default, if set
    let preProcessFunction = preProcessFiles?.[uploadedFile.type]; // undefined | null | function
    if (preProcessFunction === undefined)
      preProcessFunction = preProcessFiles?.other ?? null;
    if (!preProcessFunction) {
      return currentFiles;
    }

    const preProcessedFiles = await preProcessFunction([uploadedFile]);
    if (!preProcessedFiles) {
      console.error(
        `Preprocessing failed for file ${uploadedFile.name} of type ${uploadedFile.type}.`
      );
      return currentFiles;
    }

    // Replace the original files with the processed ones
    if (!currentFiles || !uploadedFile.id || !preProcessedFiles) return;
    const index = updatedFiles.findIndex((file) => file.id === uploadedFile.id);
    updatedFiles.splice(
      index,
      1,
      ...preProcessedFiles.map((file) => ({ ...file, id: nanoid() }))
    );
    return updatedFiles;
  }

  async function handlePreProcessing(processedFiles: UploadedFilePublic[]) {
    let finishedFiles: UploadedFilePublic[] = [...processedFiles];

    for (const uploadedFile of processedFiles) {
      if (!preProcessFiles) return;
      const updatedFiles = await applyPreProcessingAndUpdateFiles(
        uploadedFile,
        preProcessFiles,
        finishedFiles
      );
      finishedFiles = updatedFiles ?? finishedFiles;
    }

    const { validFiles, errors } = validateFiles(finishedFiles);
    if (!!errors.length && !validFiles.length) return;

    return validFiles;
  }

  async function transformFiles(filesInput: File[]) {
    const { validFiles, errors } = validateFiles(filesInput);

    if (!!errors.length && !validFiles.length) return;

    let maxOrder =
      files.reduce((acc, file) => Math.max(acc, file.order!), 0) + 1;

    // Building UploadedFiles
    const processedFiles = await Promise.all(
      validFiles.map(async (file) => {
        if (!(file instanceof File)) {
          throw new Error("Invalid file type");
        }

        const base64String = (await blobToBase64(file as File)) as string;

        const uploadedFile: UploadedFilePublic = {
          id: nanoid(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          base64Uri: base64String,
          previewImg: {
            imgBase64Uri: file.type.includes("image") ? base64String : "",
          },
        };

        return uploadedFile;
      })
    );

    const finishedFiles = preProcessFiles
      ? await handlePreProcessing(processedFiles)
      : processedFiles;

    if (!finishedFiles) return;

    return finishedFiles
      .map((file) => {
        const uploadedFile: UploadedFile = {
          ...(file as UploadedFilePublic),
          order: maxOrder,
          uploadStatus: {
            stage: UploadedFileItemStage.IDLE,
            progress: 0,
          },
        };
        maxOrder += 1;
        return uploadedFile;
      })
      .sort((a, b) => a.order! - b.order!);
  }

  async function addFiles(files: File[]) {
    const errorHandler = onAddFileError ?? toastError;
    try {
      smSetStatus("PROCESSING");

      const transformedFiles = await transformFiles(files);

      if (transformedFiles)
        setFiles((prevFiles) => [...prevFiles, ...transformedFiles]);
    } catch (error) {
      errorHandler(error);
    } finally {
      smSetStatus("IDLE");
    }
  }

  function getFile(id: string) {
    return files.find((file) => file.id === id);
  }

  function reorderFiles(files: UploadedFile[]) {
    return files.map((file, index) => ({
      ...file,
      order: index + 1,
    }));
  }

  function updateFile(id: string, uploadedFileProps: Partial<UploadedFile>) {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, ...uploadedFileProps } : file
      )
    );
  }

  function removeFile(id: string) {
    return files.filter((file) => file.id !== id);
  }

  async function deleteFile(fileId: string) {
    const file = getFile(fileId);
    if (!file) throw new Error(`File with ID ${fileId} not found.`);

    if (file.uploadStatus.stage !== UploadedFileItemStage.FINISHED) {
      const updatedFiles = removeFile(file.id);
      if (onDelete) onDelete([file]);
      if (checkIfAllFilesFinished(updatedFiles)) {
        smSetStatus("SUCCESS");

        handleFinish(reorderFiles(updatedFiles));
      }

      if (!updatedFiles.length) smSetStatus("IDLE");

      setFiles(reorderFiles(updatedFiles));
    }
  }

  function onProgressChange(
    fileId: string,
    progress: number,
    error?: {
      text: string;
      code: string;
    }
  ) {
    let stage = getFile(fileId)?.uploadStatus.stage;

    if (progress >= 0 && progress <= 100) {
      if (error) {
        stage = UploadedFileItemStage.FAILED;
      } else if (progress === 100) {
        stage = UploadedFileItemStage.FINISHED;
      } else if (stage !== UploadedFileItemStage.FINISHED) {
        stage = UploadedFileItemStage.UPLOADING;
      }

      updateFile(fileId, {
        uploadStatus: { progress, error, stage },
      });
    }
  }

  async function uploadAllFiles() {
    if (!onUpload)
      throw new Error("Provider has no onUpload function defined.");
    smStatusIs("ERROR") ? smSetStatus("RETRY") : smSetStatus("PROCESSING");
    try {
      const results = await onUpload(
        files.filter(
          (file) => file.uploadStatus.stage !== UploadedFileItemStage.FINISHED
        ),
        onProgressChange
      );

      // All Uploads successful
      const [isAllSuccess, allFiles] = handleResults(results);
      if (isAllSuccess) {
        smSetStatus("IDLE");
        handleFinish(allFiles);
      } else {
        smSetStatus("ERROR");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleResults(
    results: UploadFileResult[]
  ): [boolean, UploadedFile[]] {
    const allFiles = [...files];
    let isAllSuccess = true;
    // Files-Array with updated states
    results.forEach(({ fileId, success, error, metadata }) => {
      const file = allFiles.find((file) => file.id === fileId);
      if (!file) return;
      if (success)
        file.uploadStatus = {
          progress: 100,
          stage: UploadedFileItemStage.FINISHED,
          error: undefined,
        };
      if (!success) {
        file.uploadStatus = {
          progress: 100,
          stage: UploadedFileItemStage.FAILED,
          error,
        };
        isAllSuccess = false;
      }
      file.metadata = metadata ?? {};
    });
    return [isAllSuccess, allFiles];
  }

  function handleFinish(files: UploadedFile[]) {
    if (onFinish) onFinish(files);
    resetOnFinish ? resetControl() : smSetStatus("FINISHED");
  }

  async function deleteAllFiles() {
    try {
      smSetStatus("PROCESSING");
      const uploadedFiles = files.filter(
        (file) => file.uploadStatus.stage === UploadedFileItemStage.FINISHED
      );
      if (uploadedFiles.length && onDelete) await onDelete(uploadedFiles);
      setFiles([]);
      smSetStatus("IDLE");
    } catch (error) {
      console.error(error);
      smSetStatus("ERROR");
    }
  }

  function updateFileStage(id: string, stage: UploadedFileItemStage) {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id !== id) return file;
        const newFile: UploadedFile = {
          ...file,
        };
        newFile.uploadStatus.stage = stage;
        return newFile;
      })
    );
  }

  function resetControl() {
    smSetStatus("IDLE");
    setFiles([]);
  }

  return (
    <UploadedFilesContext.Provider
      value={{
        files,
        addFiles,
        removeFile,
        updateFile,
        uploadAllFiles,
        deleteFile,
        deleteAllFiles,
        updateFileStage,
        getFile,
        smStatus,
        smStatusIs,
        smStatusIsnt,
        setFiles,
        resetControl,
        getValidationInfo,
        disableSorting,
      }}
    >
      {children}
    </UploadedFilesContext.Provider>
  );
};

function useUploadFilesProvider() {
  const context = React.useContext(UploadedFilesContext);
  if (context === undefined) {
    throw new Error(
      "useUploadFilesProvider must be used within a UploadFilesContext"
    );
  }
  return context;
}

export { UploadedFilesManager, useUploadFilesProvider };
