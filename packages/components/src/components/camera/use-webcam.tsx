import { useCallback, useEffect, useRef, useState } from "react";

import {
  getScaledCanvas,
  useMobileDetect,
  useStateMachine,
} from "@osmandvc/react-upload-control-shared";

import ReactWebcam from "./custom-react-webcam";

export type WebcamOutputProps = {
  imageUriBase64: string | undefined;
  imageData: ImageData | undefined;
};

type WebcamProps = {
  outputImageUriBase64: boolean;
  outputImageData: boolean;
  targetWidth: number;
  targetHeight: number;
  screenshotFormat: "image/jpeg" | "image/webp" | "image/png" | undefined;
  screenshotQuality: number;
  imageSmoothing: boolean;
  mirrored: boolean;
  videoConstraints: any;
  onCapture(img: WebcamOutputProps): void;
  onUserMediaError(error: string | DOMException): void;
  onToggleDevice(): void;
};

const defaultProps: WebcamProps = {
  outputImageUriBase64: true,
  outputImageData: false,
  targetWidth: 595 * 2, // = 1190
  targetHeight: 842 * 2, // = 1684
  screenshotFormat: "image/jpeg",
  screenshotQuality: 0.9,
  imageSmoothing: true,
  mirrored: false,
  videoConstraints: {
    width: { min: 576, ideal: 720, max: 1080 },
    //height: { min: 1024, ideal: 1280, max: 1920 }, // causes Overconstrained error
    height: { ideal: 1280, max: 1920 },
    aspectRatio: 16 / 9,
  },
  onCapture: () => undefined,
  onUserMediaError: () => undefined,
  onToggleDevice: () => undefined,
};

export function useWebcam(props: Partial<WebcamProps>) {
  const {
    outputImageUriBase64,
    outputImageData,
    targetWidth,
    targetHeight,
    screenshotFormat,
    screenshotQuality,
    imageSmoothing,
    mirrored,
    onCapture,
    onUserMediaError,
  } = { ...defaultProps, ...props };
  const videoConstraints = {
    ...defaultProps.videoConstraints,
    ...props.videoConstraints,
  };
  const {
    smStatus,
    smSetStatus,
    smError,
    smErrorString,
    status: { LOADING, READY, ERROR },
  } = useStateMachine("LOADING");
  const webcamRef = useRef<ReactWebcam>(null);
  const detectMobile = useMobileDetect();
  const [aspectRatio, setAspectRatio] = useState<any>(
    videoConstraints.aspectRatio
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [mirrorMode, setMirrorMode] = useState<boolean>(mirrored);
  const [deviceCount, setDeviceCount] = useState<number>();
  let { width, height } = videoConstraints;

  // TODO: fix video constraints for Android/ios, since it is vice versa
  if (detectMobile.isAndroid) {
    width = videoConstraints.height;
    height = videoConstraints.width;
  }

  useEffect(() => {
    const determineDeviceCount = async () => {
      const devices = await getDevices();
      setDeviceCount(devices?.length ?? 0);
      return devices?.length ?? 0;
    };
    determineDeviceCount();
  }, []);

  async function getDevices(): Promise<MediaDeviceInfo[] | undefined> {
    // Fetch available video devices
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device) => device.kind === "videoinput");
    } catch (error) {
      console.error(error);
    }
  }

  function doCaptureImage() {
    let canvas = webcamRef.current?.getCanvas();
    if (!canvas) return;

    // check if image needs to be downscaled for the analysis
    const scaleFactor =
      1 / Math.max(canvas.width / targetWidth, canvas.height / targetHeight);

    const { canvas: rCanvas, context: rContext } = getScaledCanvas(
      canvas,
      scaleFactor,
      true
    );

    // TODO: add filters to optimize image?
    //resizeCtx.filter = "brightness(130%)";

    const output: WebcamOutputProps = {
      imageUriBase64: undefined,
      imageData: undefined,
    };

    if (outputImageUriBase64) {
      output.imageUriBase64 = rCanvas.toDataURL(
        screenshotFormat,
        screenshotQuality
      );
    }
    if (outputImageData) {
      output.imageData = rContext.getImageData(
        0,
        0,
        rCanvas.width,
        rCanvas.height
      );
    }

    onCapture(output);
  }

  function doRotateDevice() {
    // TODO: rotate device
    setAspectRatio(1 / aspectRatio);
  }

  function doMirrorDevice() {
    setMirrorMode(!mirrorMode);
  }

  async function doNextDevice() {
    const videoDevices = await getDevices();
    if (!videoDevices) {
      smSetStatus(ERROR, new Error("Problem beim Suchen der Kamera(s)."));
      return;
    }

    const currentIndex = videoDevices.findIndex(
      (device) => device.deviceId === selectedDeviceId
    );

    // If not found or on initial load, start with the first camera
    let nextIndex = 0;
    if (videoDevices.length > 1) {
      nextIndex =
        currentIndex === -1 ? 1 : (currentIndex + 1) % videoDevices.length;
    }

    smSetStatus(LOADING);
    setSelectedDeviceId(videoDevices[nextIndex].deviceId);
    smSetStatus(READY);
  }

  const handleUserMedia = (stream: MediaStream) => {
    smSetStatus(READY);
  };

  function handleUserMediaError(error: string | DOMException) {
    smSetStatus(ERROR, error);
    console.error(error);
    onUserMediaError(error);
  }

  const WebcamComponent = useCallback(
    () => (
      <ReactWebcam
        id="webcam"
        ref={webcamRef}
        className="w-full h-full"
        minScreenshotWidth={targetWidth}
        minScreenshotHeight={targetHeight}
        audio={false}
        screenshotFormat={screenshotFormat}
        screenshotQuality={screenshotQuality}
        imageSmoothing={imageSmoothing}
        mirrored={mirrorMode}
        videoConstraints={{
          ...videoConstraints,
          width,
          height,
          aspectRatio,
          deviceId: selectedDeviceId,
        }}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedDeviceId, mirrorMode, aspectRatio]
  );

  return {
    WebcamComponent,
    userMediaStatus: smStatus,
    userMediaError: smError,
    userMediaErrorString: smErrorString,
    getDevices,
    deviceCount,
    selectedDeviceId,
    setSelectedDeviceId,
    doCaptureImage,
    doRotateDevice,
    doMirrorDevice,
    doNextDevice,
  };
}
