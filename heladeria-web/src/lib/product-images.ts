const imageMap: Record<string, string> = {
  "bombón": "/assets/products/chocolate.jpg",
  "torta": "/assets/products/strawberry.jpg",
  "postre": "/assets/products/pistachio.jpg",
  "palito": "/assets/products/vanilla.jpg",
  "pote": "/assets/products/vanilla.jpg",
  "helado pote": "/assets/products/vanilla.png",
  "helado 1/4": "/assets/products/pot1-4Kg.png",
  "helado 1/2": "/assets/products/pote1-2Kg.png",
  "helado 1kg": "/assets/products/pote1Kg.png",
  "helado cucurucho": "/assets/products/heladosporgusto.png",
};

const fallbackImage = "/assets/products/vanilla.jpg";

export function getProductImage(productName: string): string {
  const lower = productName.toLowerCase();
  for (const [keyword, img] of Object.entries(imageMap)) {
    if (lower.includes(keyword)) return img;
  }
  return fallbackImage;
}
