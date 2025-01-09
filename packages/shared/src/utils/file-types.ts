function invertObject(obj: any) {
  const newObj: any = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    // If the value already exists in the new object, append the key
    if (newObj.hasOwnProperty(value)) {
      newObj[value].push(key);
    } else {
      // If the value does not exist, create a new array with the key
      newObj[value] = [key];
    }
  });

  return newObj;
}

export const SUPPORTED_EXTENSIONS_OBJECT = {
  // pdf
  ".pdf": "application/pdf",
  // image formats
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  // Office formats
  ".doc": "application/msword",
  ".dot": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".dotx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  ".docm": "application/vnd.ms-word.document.macroEnabled.12",
  ".dotm": "application/vnd.ms-word.template.macroEnabled.12",
  ".xls": "application/vnd.ms-excel",
  ".xlt": "application/vnd.ms-excel",
  ".xla": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xltx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
  ".xltm": "application/vnd.ms-excel.template.macroEnabled.12",
  ".xlam": "application/vnd.ms-excel.addin.macroEnabled.12",
  ".xlsb": "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pot": "application/vnd.ms-powerpoint",
  ".pps": "application/vnd.ms-powerpoint",
  ".ppa": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".potx":
    "application/vnd.openxmlformats-officedocument.presentationml.template",
  ".ppsx":
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  ".ppam": "application/vnd.ms-powerpoint.addin.macroEnabled.12",
  ".pptm": "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
  ".potm": "application/vnd.ms-powerpoint.template.macroEnabled.12",
  ".ppsm": "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
};
export const SUPPORTED_EXTENSIONS = Object.keys(SUPPORTED_EXTENSIONS_OBJECT);

export const SUPPORTED_MIME_OBJECT = invertObject(SUPPORTED_EXTENSIONS_OBJECT);
export const SUPPORTED_MIME_TYPES = Object.keys(SUPPORTED_MIME_OBJECT);

export const SUPPORTED_FILE_LIST =
  SUPPORTED_EXTENSIONS.concat(SUPPORTED_MIME_TYPES).join(",");
