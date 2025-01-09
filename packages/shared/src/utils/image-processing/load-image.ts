import { ScaledImage, ScaledImageBinary } from "../../types";

const getMimeType = (uriBase64: string) => {
  // eg. "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA..."
  return uriBase64.split(",")?.[0].split(";")?.[0].split(":")?.[1];
};

export async function loadImageBinary(
  uri: string,
  type: string = "image/jpeg",
  quality: number = 0.9
): Promise<ScaledImageBinary> {
  const canvas: any = document.createElement("canvas");
  const ctx: any = canvas.getContext("2d");
  if (!ctx) throw new Error("2d-Context not supported in this browser");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high"; // [low, medium, high] Reference:https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = uri;
    img.crossOrigin = "anonymous";
    img.onerror = reject;
    // using onload since decode(...) not supported yet in all browsers
    img.onload = async () => {
      const { width, height } = img;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);

      // convert image to blob
      const canvasBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, type, quality)
      );
      const imgBlob = canvasBlob as Blob;
      // convert blob to clamped array
      const imgArray = new Uint8Array(await imgBlob.arrayBuffer());

      resolve({
        uri,
        uriBase64: "",
        img,
        imgBlob,
        imgArray,
        width,
        height,
        mimeType: imgBlob.type,
        scale: 1,
      });
    };
  });
}

export async function loadImageBase64(uriBase64: string): Promise<ScaledImage> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = uriBase64;
    img.crossOrigin = "anonymous";
    img.onerror = reject;
    // using onload since decode(...) not supported yet in all browsers
    img.onload = () => {
      const { width, height } = img;

      resolve({
        uriBase64,
        img,
        width,
        height,
        mimeType: getMimeType(uriBase64),
        scale: 1,
      });
    };
  });
}
