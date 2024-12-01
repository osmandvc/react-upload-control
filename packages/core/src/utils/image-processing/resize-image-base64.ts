import { ScaledImage } from "@/src/types";

import { getScaledCanvas } from "./canvas-utils";
import { loadImageBase64 } from "./load-image";

interface Props {
  base64Uri: string;
  maxWidth?: number;
  maxHeight?: number;
  targetFormat?: string;
  targetQuality?: number;
}

const defaultProps: Partial<Props> = {
  maxWidth: 595 * 2,
  maxHeight: 842 * 2,
  targetFormat: "image/jpeg",
  targetQuality: 0.9,
};

interface ReturnProps {
  imageUriBase64: string;
  width: number;
  height: number;
  scale: number;
  format: string;
}

export async function resizeImageBase64(props: Props): Promise<ScaledImage[]> {
  const { base64Uri, maxWidth, maxHeight, targetFormat, targetQuality } = {
    ...defaultProps,
    ...props,
  };

  if (!base64Uri) throw new Error("No image uri provided.");

  const { img, width, height, mimeType } = await loadImageBase64(base64Uri);

  const scale = Math.min(maxWidth! / width, maxHeight! / height);
  const { canvas } = getScaledCanvas(img!, scale);

  return [
    {
      uriBase64: canvas.toDataURL(targetFormat, targetQuality),
      img,
      width: canvas.width,
      height: canvas.height,
      scale,
      mimeType: targetFormat!,
    },
  ];
}
