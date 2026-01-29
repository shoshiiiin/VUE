import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a base64 image string to a WebP base64 string
 * @param base64Source - The input image as base64 string
 * @param quality - Quality from 0 to 1 (default 0.8)
 */
export async function convertToWebP(base64Source: string, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Source;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      // Convert to WebP
      const webpData = canvas.toDataURL("image/webp", quality);
      resolve(webpData);
    };
    img.onerror = (e) => reject(e);
  });
}

/**
 * Converts a base64 image string to a specific format (png/webp/jpeg)
 */
export async function convertImageFormat(base64Source: string, format: "png" | "webp" | "jpeg", quality = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Source;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const mimeType = `image/${format}`;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      resolve(dataUrl);
    };
    img.onerror = (e) => reject(e);
  });
}
