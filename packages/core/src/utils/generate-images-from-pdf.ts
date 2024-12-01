import { ScaledImage } from "../types";

interface Props {
  base64Uri: string;
  maxWidth?: number;
  maxHeight?: number;
  targetFormat?: string;
  targetQuality?: number;
  maxNumPages: number;
  name: string;
}

const defaultProps: Partial<Props> = {
  maxWidth: 595 * 2,
  maxHeight: 842 * 2,
  targetFormat: "image/jpeg",
  targetQuality: 0.9,
  maxNumPages: 0,
};

export async function createImagesFromPdf(
  props: Props,
): Promise<ScaledImage[]> {
  const {
    name,
    base64Uri,
    maxWidth,
    maxHeight,
    targetFormat,
    targetQuality,
    maxNumPages,
  } = {
    ...defaultProps,
    ...props,
  };

  if (!base64Uri) throw new Error("No image uri provided.");

  // load library the first time on-demand, will be cached automatically
  const { getResolvedPDFJS } = await import("unpdf");

  const pages: ScaledImage[] = [];
  const { getDocument } = await getResolvedPDFJS();

  const doc = await getDocument(base64Uri).promise;

  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  for (let i = 1; i <= doc.numPages; i++) {
    if (maxNumPages > 0 && i > maxNumPages) break;

    const page = await doc.getPage(i);

    // determine original dimensions
    const { width: w, height: h } = page.getViewport({ scale: 1 });
    const scale = Math.min(maxWidth! / w, maxHeight! / h);

    // scale viewport to desired dimension
    const viewport = page.getViewport({ scale });
    const { width, height } = viewport;
    canvas.height = height;
    canvas.width = width;

    await page.render({ canvasContext: context, viewport }).promise;
    const dataUrl = canvas.toDataURL(targetFormat, targetQuality);
    const file = await fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        return new File([blob], `${name}_page${i}`, { type: targetFormat });
      });

    pages.push({
      uriBase64: dataUrl,
      img: undefined,
      width,
      height,
      scale,
      mimeType: targetFormat!,
      file,
    });
  }

  doc.destroy();

  return pages;
}
