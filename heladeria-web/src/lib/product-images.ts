const imageMap: Record<string, string> = {
  "vainilla": "/assets/products/vanilla.jpg",
  "chocolate": "/assets/products/chocolate.jpg",
  "pistacho": "/assets/products/pistachio.jpg",
  "frutilla": "/assets/products/strawberry.jpg",
  "mango": "/assets/products/mango.jpg",
  "dulce de leche": "/assets/products/cookies.jpg",
  "crema": "/assets/products/vanilla.jpg",
  "limón": "/assets/products/mango.jpg",
  "tramontana": "/assets/products/cookies.jpg",
  "granizado": "/assets/products/chocolate.jpg",
  "kitkat": "/assets/products/cookies.jpg",
  "bombón": "/assets/products/chocolate.jpg",
  "torta": "/assets/products/strawberry.jpg",
  "postre": "/assets/products/pistachio.jpg",
  "palito": "/assets/products/vanilla.jpg",
  "pote": "/assets/products/vanilla.jpg",
  "helado pote": "/assets/products/vanilla.jpg",
  "helado palito": "/assets/products/strawberry.jpg",
};

const fallbackImage = "/assets/products/vanilla.jpg";

export function getProductImage(productName: string): string {
  const lower = productName.toLowerCase();
  for (const [keyword, img] of Object.entries(imageMap)) {
    if (lower.includes(keyword)) return img;
  }
  return fallbackImage;
}
