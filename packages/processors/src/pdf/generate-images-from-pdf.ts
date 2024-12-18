import { ScaledImage } from "../types";
import * as pdfjsLib from "pdfjs-dist";

// Configure pdf.js worker to use jsDelivr CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

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
  props: Props
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
  console.log("in");

  // Remove the data URL prefix if present
  const pdfData = base64Uri.replace(/^data:application\/pdf;base64,/, "");

  // Load the PDF using pdf.js
  const pdfBytes = Uint8Array.from(atob(pdfData), (c) => c.charCodeAt(0));
  const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
  const pages: ScaledImage[] = [];

  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not get 2D context from canvas");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  try {
    for (let i = 0; i < pdf.numPages; i++) {
      if (maxNumPages > 0 && i >= maxNumPages) break;

      // Get the page
      const page = await pdf.getPage(i + 1);

      // Calculate scale to fit within maxWidth/maxHeight while maintaining aspect ratio
      const viewport = page.getViewport({ scale: 1.0 });
      const scale = Math.min(
        maxWidth! / viewport.width,
        maxHeight! / viewport.height
      );

      // Set canvas size
      const scaledViewport = page.getViewport({ scale });
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;

      // Convert to desired format
      const dataUrl = canvas.toDataURL(targetFormat, targetQuality);

      // Create file object
      const file = await fetch(dataUrl)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new File([blob], `${name}_page${i + 1}`, { type: targetFormat })
        );
      console.log(file);

      pages.push({
        uriBase64: dataUrl,
        img: undefined,
        width: scaledViewport.width,
        height: scaledViewport.height,
        scale,
        mimeType: targetFormat!,
        file,
      });
    }
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }

  return pages;
}
