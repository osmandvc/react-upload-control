import React, { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";
import { FormattedMessage, useIntl } from "react-intl";

import { WebcamOutputProps, useWebcam } from "@/src/components/camera";
import { useUploadFilesProvider } from "../providers/UploadedFilesManager";
import { FileLoaderCameraProps } from "../types";

import { CameraIcon } from "../ui/icons";
import { addUniqueTimestamp, cn } from "../utils";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/src/ui/dialog";
import { Button } from "@/src/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/ui/select";

type CameraSelectItem = {
  value: string;
  label: string;
};

export const FileLoaderCamera = (props: FileLoaderCameraProps) => {
  const intl = useIntl();
  const defaultProps: Partial<FileLoaderCameraProps> = {
    onlyIcon: false,
  };

  const { onlyIcon, className } = { ...defaultProps, ...props };

  const { addFiles } = useUploadFilesProvider();
  const [devices, setDevices] = useState<CameraSelectItem[]>([]);
  const [open, setOpen] = useState(false);

  const {
    WebcamComponent,
    doCaptureImage,
    doRotateDevice,
    doMirrorDevice,
    userMediaStatus,
    setSelectedDeviceId: changeDevice,
    selectedDeviceId,
    getDevices,
  } = useWebcam({
    outputImageUriBase64: true,
    outputImageData: false,
    onCapture: handlePhotoResult,
  });

  useEffect(() => {
    const fetchDevices = async () => {
      const deviceList = await getDevices();

      if (!deviceList) return;
      const deviceOptions = deviceList.map((device, index) => ({
        value: device.deviceId,
        label: device.label || `Camera ${index + 1}`,
      }));
      setDevices(deviceOptions);

      if (deviceOptions.length > 0) {
        changeDevice(deviceOptions[0].value);
      }
    };

    fetchDevices();
  }, [userMediaStatus]);

  async function dataUrlToFile(
    dataUrl: string,
    fileName: string
  ): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: "image/png" });
  }

  async function handlePhotoResult({ imageUriBase64 }: WebcamOutputProps) {
    if (!imageUriBase64) return;
    const imageFile = await dataUrlToFile(
      imageUriBase64,
      `${addUniqueTimestamp("Snapshot_")}.png`
    );
    addFiles([imageFile]);
    setOpen(false);
  }

  function handleDeviceChange(value: string) {
    changeDevice(value);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              `${
                !onlyIcon && "justify-start"
              } rounded-lg text-default-500 hover:text-primary hover:bg-primary/10 md:justify-center`,
              className
            )}
            startContent={
              <CameraIcon className="flex-shrink-0 pointer-events-none" />
            }
            variant="link"
            isIconOnly={onlyIcon}
          >
            {!onlyIcon && <FormattedMessage id="FileLoaderCamera.text" />}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="FileLoaderCamera.cameraModalHeader" />
            </DialogTitle>
          </DialogHeader>
          {userMediaStatus === "READY" && (
            <div className="flex gap-2 justify-between items-center">
              {devices.length > 0 && selectedDeviceId && (
                <Select
                  value={selectedDeviceId}
                  onValueChange={handleDeviceChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={intl.formatMessage({
                        id: "FileLoaderCamera.dropDownPlaceholder",
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => (
                      <SelectItem key={device.value} value={device.value}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="flex gap-2 items-center">
                <Button
                  onClick={doRotateDevice}
                  isIconOnly
                  className="p-2 bg-gray-100 rounded-lg text-slate-900 sm:p-3"
                  icon="RotateIcon"
                ></Button>
                <Button
                  onClick={doMirrorDevice}
                  isIconOnly
                  className="p-2 bg-gray-100 rounded-lg text-slate-900 sm:p-3"
                  icon="MirrorIcon"
                ></Button>
              </div>
            </div>
          )}
          {userMediaStatus === "ERROR" && (
            <div className="grid place-items-center w-full h-full">Error</div>
          )}
          <div className="p-0">
            {userMediaStatus === "LOADING" && (
              <div className="grid place-items-center w-full h-full">
                Loading...
              </div>
            )}
            <WebcamComponent />
          </div>

          <DialogFooter className="flex w-full">
            <Button
              onClick={doCaptureImage}
              isIconOnly
              disabled={userMediaStatus === "LOADING"}
              className="flex-1 p-6 text-gray-300 rounded-lg bg-slate-950"
              icon="CameraIcon"
            ></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
