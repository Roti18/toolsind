export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image load error"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

export function createCanvasForImage(img: HTMLImageElement, maxWidth: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const ratio = img.width / img.height;
  let targetWidth = img.width;
  let targetHeight = img.height;

  if (img.width > maxWidth) {
    targetWidth = maxWidth;
    targetHeight = Math.round(maxWidth / ratio);
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  return { canvas, ctx };
}
