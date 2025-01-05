import { nanoid } from "nanoid";
import { PDFDocument } from "pdf-lib";

import { UploadedFileMetadata, UploadedFilePublic } from "../types";
import { createImagesFromPdf } from "./generate-images-from-pdf";

export async function processPdfToJpeg(
  files: UploadedFilePublic[]
): Promise<UploadedFilePublic[]> {
  const generatedPages: UploadedFilePublic[] = [];

  for (const file of files) {
    if (!file.base64Uri) continue;

    try {
      const pages = await createImagesFromPdf({
        base64Uri: file.base64Uri,
        maxNumPages: 0,
        name: file.name,
      });

      const pdfDoc = await PDFDocument.load(file.base64Uri);
      const transformedPages: UploadedFilePublic[] = pages.map(
        (scaledImage, i) => {
          let metadata: UploadedFileMetadata = {
            pageNumber: i + 1,
          };
          if (pdfDoc.getTitle()) metadata.title = pdfDoc.getTitle();
          if (pdfDoc.getAuthor()) metadata.author = pdfDoc.getAuthor();
          if (pdfDoc.getCreationDate())
            metadata.createdAt = pdfDoc.getCreationDate();
          if (pdfDoc.getCreator()) metadata.creator = pdfDoc.getCreator();
          if (pdfDoc.getModificationDate())
            metadata.modifiedAt = pdfDoc.getModificationDate();

          const transformedPage: UploadedFilePublic = {
            id: nanoid(),
            name: scaledImage.file?.name ?? `${file.name}_page${i}`,
            size: scaledImage.file?.size,
            file: scaledImage.file,
            type: scaledImage.mimeType,
            base64Uri: scaledImage.uriBase64,
            previewImg: {
              imgBase64Uri: scaledImage.uriBase64,
              width: scaledImage.width,
              height: scaledImage.height,
            },
            metadata,
          };
          return transformedPage;
        }
      );

      generatedPages.push(...transformedPages);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return generatedPages;
}
