import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";

export type Product = {
  id: string;
  name: string;
  swahili: string;
  price: number;
  compareAt?: number;
  image: string;
  category: "Women" | "Men" | "Accessories" | "Fabric";
  tag?: string;
  sizes: string[];
  county: string;
  rating: number;
  stock: number;
};

export const products: Product[] = [
  {
    id: "shati-jua",
    name: "Jua Camp Shirt",
    swahili: "Shati la Jua",
    price: 2800,
    compareAt: 3500,
    image: p1,
    category: "Men",
    tag: "Bestseller",
    sizes: ["S", "M", "L", "XL"],
    county: "Nairobi",
    rating: 4.8,
    stock: 6,
  },
  {
    id: "gauni-bahari",
    name: "Bahari Maxi Dress",
    swahili: "Gauni la Bahari",
    price: 4900,
    image: p2,
    category: "Women",
    tag: "New drop",
    sizes: ["S", "M", "L", "XL", "XXL"],
    county: "Mombasa",
    rating: 4.9,
    stock: 3,
  },
  {
    id: "koti-msitu",
    name: "Msitu Tailored Blazer",
    swahili: "Koti la Msitu",
    price: 6500,
    compareAt: 7800,
    image: p3,
    category: "Men",
    tag: "Limited",
    sizes: ["M", "L", "XL"],
    county: "Kisumu",
    rating: 4.7,
    stock: 4,
  },
  {
    id: "kilemba-set",
    name: "Kilemba Headwrap + Tote",
    swahili: "Kilemba na Mkoba",
    price: 1950,
    image: p4,
    category: "Accessories",
    sizes: ["One size"],
    county: "Nakuru",
    rating: 4.6,
    stock: 12,
  },
];

export const KES = (value: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
