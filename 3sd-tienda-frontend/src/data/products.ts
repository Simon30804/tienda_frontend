export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: string;
  description: string;
  specifications?: string[];
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  slug: string;
  extra_images?: string[];
  related_products?: string[];
  published: number;
}

//     name: "MacBook Pro 16\" M3 Max",
//     description: "El portátil profesional más potente con chip M3 Max, pantalla Liquid Retina XDR de 16 pulgadas y hasta 22 horas de batería.",
//     price: 2499,
//     originalPrice: 2799,
//     image: "https://images.unsplash.com/photo-1642943038577-eb4a59549766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcwOTY4NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Computadoras",
//     brand: "Apple",
//     rating: 4.9,
//     reviews: 1250,
//     inStock: true,
//     sku: true,
//     specs: ["Chip M3 Max", "36GB RAM", "1TB SSD", "Pantalla 16\" Retina XDR"]
//   },
//   {
//     id: "2",
//     name: "iPhone 15 Pro Max",
//     description: "El smartphone más avanzado con chip A17 Pro, cámara de 48MP y diseño en titanio.",
//     price: 1199,
//     image: "https://images.unsplash.com/photo-1741061963623-24ad9b3c0f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzcwODk4OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Smartphones",
//     brand: "Apple",
//     rating: 4.8,
//     reviews: 3420,
//     inStock: true,
//     featured: true,
//     specs: ["A17 Pro", "256GB", "Cámara 48MP", "Titanio"]
//   },
//   {
//     id: "3",
//     name: "Sony WH-1000XM5",
//     description: "Auriculares premium con cancelación de ruido líder en la industria y sonido de alta resolución.",
//     price: 399,
//     originalPrice: 449,
//     image: "https://images.unsplash.com/photo-1572119244337-bcb4aae995af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW98ZW58MXx8fHwxNzcwOTYxMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Audio",
//     brand: "Sony",
//     rating: 4.7,
//     reviews: 2840,
//     inStock: true,
//     featured: true,
//     specs: ["Cancelación de ruido", "30h batería", "LDAC", "Multipoint"]
//   },
//   {
//     id: "4",
//     name: "Canon EOS R6 Mark II",
//     description: "Cámara mirrorless profesional de 24MP con video 4K 60fps y estabilización de imagen de 8 stops.",
//     price: 2499,
//     image: "https://images.unsplash.com/photo-1694055839361-302387897f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBkaWdpdGFsJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwOTA0NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Cámaras",
//     brand: "Canon",
//     rating: 4.9,
//     reviews: 567,
//     inStock: true,
//     featured: false,
//     specs: ["24MP Full-Frame", "4K 60fps", "IBIS 8 stops", "Dual Pixel AF"]
//   },
//   {
//     id: "5",
//     name: "iPad Pro 12.9\" M2",
//     description: "El tablet más potente con chip M2, pantalla Liquid Retina XDR y soporte para Apple Pencil.",
//     price: 1099,
//     originalPrice: 1299,
//     image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBpcGFkJTIwZGV2aWNlfGVufDF8fHx8MTc3MDk0NTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Tablets",
//     brand: "Apple",
//     rating: 4.8,
//     reviews: 1890,
//     inStock: true,
//     featured: true,
//     specs: ["Chip M2", "12.9\" Retina XDR", "128GB", "5G"]
//   },
//   {
//     id: "6",
//     name: "Logitech G Pro X Superlight",
//     description: "Ratón gaming inalámbrico ultraligero diseñado para profesionales de esports.",
//     price: 159,
//     image: "https://images.unsplash.com/photo-1629429408719-a64b3ae484e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMG1vdXNlfGVufDF8fHx8MTc3MDkyODU5OXww&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Gaming",
//     brand: "Logitech",
//     rating: 4.6,
//     reviews: 4560,
//     inStock: true,
//     featured: false,
//     specs: ["63g peso", "25K DPI", "70h batería", "HERO Sensor"]
//   },
//   {
//     id: "7",
//     name: "Apple Watch Series 9",
//     description: "Smartwatch con pantalla always-on, sensores de salud avanzados y chip S9.",
//     price: 429,
//     image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwd2VhcmFibGV8ZW58MXx8fHwxNzcwOTcwMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Wearables",
//     brand: "Apple",
//     rating: 4.7,
//     reviews: 2340,
//     inStock: true,
//     featured: false,
//     specs: ["Chip S9", "GPS + Cellular", "ECG", "Always-On Retina"]
//   },
//   {
//     id: "8",
//     name: "AirPods Pro 2",
//     description: "Auriculares inalámbricos con cancelación de ruido adaptativa y audio espacial personalizado.",
//     price: 249,
//     originalPrice: 279,
//     image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzcwOTM5MDYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Audio",
//     brand: "Apple",
//     rating: 4.8,
//     reviews: 5670,
//     inStock: true,
//     featured: true,
//     specs: ["Cancelación activa", "Audio espacial", "USB-C", "30h batería"]
//   },
//   {
//     id: "9",
//     name: "Samsung Galaxy S24 Ultra",
//     description: "Smartphone flagship con S Pen, cámara de 200MP y pantalla AMOLED de 6.8\".",
//     price: 1199,
//     image: "https://images.unsplash.com/photo-1741061963623-24ad9b3c0f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzcwODk4OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Smartphones",
//     brand: "Samsung",
//     rating: 4.7,
//     reviews: 2190,
//     inStock: true,
//     featured: false,
//     specs: ["Snapdragon 8 Gen 3", "12GB RAM", "Cámara 200MP", "S Pen"]
//   },
//   {
//     id: "10",
//     name: "Dell XPS 15",
//     description: "Portátil premium con pantalla OLED 4K, procesador Intel Core i9 y diseño ultrafino.",
//     price: 1899,
//     originalPrice: 2099,
//     image: "https://images.unsplash.com/photo-1642943038577-eb4a59549766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcwOTY4NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Computadoras",
//     brand: "Dell",
//     rating: 4.6,
//     reviews: 890,
//     inStock: true,
//     featured: false,
//     specs: ["Intel Core i9", "32GB RAM", "1TB SSD", "OLED 4K"]
//   },
//   {
//     id: "11",
//     name: "Bose QuietComfort Ultra",
//     description: "Auriculares premium con audio espacial inmersivo y cancelación de ruido de clase mundial.",
//     price: 429,
//     image: "https://images.unsplash.com/photo-1572119244337-bcb4aae995af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW98ZW58MXx8fHwxNzcwOTYxMTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Audio",
//     brand: "Bose",
//     rating: 4.7,
//     reviews: 1560,
//     inStock: true,
//     featured: false,
//     specs: ["Audio espacial", "24h batería", "ANC avanzada", "Bluetooth 5.3"]
//   },
//   {
//     id: "12",
//     name: "Razer Blade 16",
//     description: "Portátil gaming de alto rendimiento con RTX 4090 y pantalla Mini LED de 240Hz.",
//     price: 3499,
//     image: "https://images.unsplash.com/photo-1642943038577-eb4a59549766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcwOTY4NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Gaming",
//     brand: "Razer",
//     rating: 4.8,
//     reviews: 678,
//     inStock: false,
//     featured: true,
//     specs: ["RTX 4090", "32GB DDR5", "2TB SSD", "240Hz Mini LED"]
//   },
// ];

export const categories = [
  "Todos",
  "Computadoras",
  "Smartphones",
  "Audio",
  "Cámaras",
  "Tablets",
  "Gaming",
  "Wearables",
];

export const brands = [
  "Todas",
  "Apple",
  "Sony",
  "Canon",
  "Logitech",
  "Samsung",
  "Dell",
  "Bose",
  "Razer",
];
