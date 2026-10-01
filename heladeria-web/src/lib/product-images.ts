const imageMap: Record<string, string> = {
  "1/4": "/assets/products/pot1-4Kg.png",
  "1/2": "/assets/products/pote1-2Kg.png",
  "1kg": "/assets/products/pote1Kg.png",
  "1 kg": "/assets/products/pote1Kg.png",
  "cucurucho": "/assets/products/heladosporgusto.png",
  "palito de crema": "/assets/products/palitodecrema.jpg",
  "palito": "/assets/products/heladosporgusto.png",
  "pote": "/assets/products/pote1Kg.png",
  "postre": "/assets/products/heladosporgusto.png",
};

const fallbackImage = "/assets/products/heladosporgusto.png";

export function getProductImage(productName: string): string {
  const lower = productName.toLowerCase();
  for (const [keyword, img] of Object.entries(imageMap)) {
    if (lower.includes(keyword)) return img;
  }
  return fallbackImage;
}
