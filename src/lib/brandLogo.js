import { SITE_LOGO_SRC } from "@/components/ra/Logo";

export const BRAND_BLUE = "#1B2C54";

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function tintLoadedImage(img, hex = BRAND_BLUE) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  if (!canvas.width || !canvas.height) return img.src;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const { r, g, b } = hexToRgb(hex);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] === 0) continue;
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

let cachedBlueLogo = "";
let loadingBlueLogo = null;

export function getBlueLogoSrc() {
  if (cachedBlueLogo) return Promise.resolve(cachedBlueLogo);
  if (loadingBlueLogo) return loadingBlueLogo;

  loadingBlueLogo = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        cachedBlueLogo = tintLoadedImage(img, BRAND_BLUE);
      } catch {
        cachedBlueLogo = SITE_LOGO_SRC;
      }
      resolve(cachedBlueLogo);
    };
    img.onerror = () => resolve(SITE_LOGO_SRC);
    img.src = SITE_LOGO_SRC;
  });

  return loadingBlueLogo;
}

export async function tintBrandLogos(element, hex = BRAND_BLUE) {
  const images = [...element.querySelectorAll("img[data-brand-logo]")];
  if (!images.length) return;

  let blueSrc = "";
  try {
    blueSrc = await getBlueLogoSrc();
  } catch {
    blueSrc = "";
  }

  for (const img of images) {
    if (img.dataset.tinted === "1") continue;
    try {
      if (blueSrc && blueSrc !== SITE_LOGO_SRC) {
        img.src = blueSrc;
      } else if (img.naturalWidth) {
        img.src = tintLoadedImage(img, hex);
      }
      img.style.filter = "none";
      img.dataset.tinted = "1";
    } catch {
      img.style.filter =
        "brightness(0) saturate(100%) invert(13%) sepia(28%) saturate(2200%) hue-rotate(201deg) brightness(55%) contrast(110%)";
    }
  }
}
