export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === "undefined") {
      reject(new Error("FileReader API is not supported in this environment"));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
}
