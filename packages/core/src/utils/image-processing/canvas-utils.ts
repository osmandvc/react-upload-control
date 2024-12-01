interface ReturnProps {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export function getScaledCanvas(
  img: HTMLImageElement | HTMLCanvasElement,
  scale: number = 1,
  imageSmoothingEnabled: boolean = true,
): ReturnProps {
  const { width, height } = img;
  const canvas = document.createElement("canvas");

  canvas.width = width * scale;
  canvas.height = height * scale;

  const context = canvas.getContext("2d")!;
  context.imageSmoothingEnabled = imageSmoothingEnabled;

  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  return {
    canvas,
    context,
  };
}

export function getRotatedImageCanvas(
  image: HTMLImageElement,
  angle: 0 | 90 | 180 | 270 = 90,
): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement("canvas");

  canvas.height = angle === 0 || angle === 180 ? image.height : image.width;
  canvas.width = angle === 0 || angle === 180 ? image.width : image.height;

  const context = canvas.getContext("2d")!;
  context.rotate((90 * Math.PI) / 180);
  context.translate(0, -canvas.width); // TODO: make work for 0, 180, 270

  context.drawImage(image, 0, 0);

  return canvas;
}
