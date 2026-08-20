import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import fabric from "@/assets/fabric.jpg";
import nairobiWrap from "@/assets/nairobi-wrap-dress.jpg";
import malindiKaftan from "@/assets/malindi-kaftan.jpg";
import eldoretBomber from "@/assets/eldoret-bomber.jpg";
import kisiiTwoPiece from "@/assets/kisii-two-piece.jpg";
import lamuShirtDress from "@/assets/lamu-shirt-dress.jpg";
import meruWaistcoat from "@/assets/meru-waistcoat.jpg";
import thikaDashiki from "@/assets/thika-dashiki.jpg";
import kitaleKidsShirt from "@/assets/kitale-kids-shirt.jpg";
import naivashaSkirt from "@/assets/naivasha-skirt.jpg";
import taitaSafariVest from "@/assets/taita-safari-vest.jpg";
import machakosJumpsuit from "@/assets/machakos-jumpsuit.jpg";
import garissaKanzu from "@/assets/garissa-kanzu.jpg";
import nyeriPeplum from "@/assets/nyeri-peplum.jpg";
import kerichoTrench from "@/assets/kericho-trench.jpg";
import turkanaPoncho from "@/assets/turkana-poncho.jpg";
import bungomaShorts from "@/assets/bungoma-shorts.jpg";
import kakamegaShirt from "@/assets/kakamega-shirt.jpg";
import embuHeadwrap from "@/assets/embu-headwrap.jpg";
import kituiTote from "@/assets/kitui-tote.jpg";
import mombasaBowTie from "@/assets/mombasa-bow-tie.jpg";
import isioloSandals from "@/assets/isiolo-sandals.jpg";
import homabayScrunchies from "@/assets/homabay-scrunchies.jpg";
import kongoweaFabric from "@/assets/kongowea-fabric.jpg";

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  compareAt?: number;
  image: string;
  category: "Women" | "Men" | "Accessories" | "Fabric";
  tag?: string;
  sizes: string[];
  county: string;
  stock: number;
};

const WOMEN = ["S", "M", "L", "XL", "XXL"];
const MEN = ["S", "M", "L", "XL"];
const ONE = ["One size"];

export const products: Product[] = [
  {
    id: "shati-jua",
    name: "Sun Camp Shirt",
    subtitle: "Short-sleeve men's shirt",
    price: 2800,
    compareAt: 3500,
    image: p1,
    category: "Men",
    tag: "Bestseller",
    sizes: MEN,
    county: "Nairobi",
    stock: 6,
  },
  {
    id: "gauni-bahari",
    name: "Bahari Maxi Dress",
    subtitle: "One-piece flowing maxi",
    price: 4900,
    image: p2,
    category: "Women",
    tag: "New drop",
    sizes: WOMEN,
    county: "Mombasa",
    stock: 3,
  },
  {
    id: "koti-msitu",
    name: "Forest Tailored Blazer",
    subtitle: "Men's fitted blazer",
    price: 6500,
    compareAt: 7800,
    image: p3,
    category: "Men",
    tag: "Limited",
    sizes: ["M", "L", "XL"],
    county: "Kisumu",
    stock: 4,
  },
  {
    id: "kilemba-set",
    name: "Headwrap + Tote Set",
    subtitle: "Matching accessories",
    price: 1950,
    image: p4,
    category: "Accessories",
    sizes: ONE,
    county: "Nakuru",
    stock: 12,
  },
  {
    id: "nairobi-wrap-dress",
    name: "Nairobi Wrap Dress",
    subtitle: "Tie-waist midi wrap",
    price: 4200,
    image: nairobiWrap,
    category: "Women",
    tag: "Bestseller",
    sizes: WOMEN,
    county: "Nairobi",
    stock: 9,
  },
  {
    id: "malindi-kaftan",
    name: "Malindi Kaftan",
    subtitle: "Loose coastal kaftan",
    price: 3600,
    image: malindiKaftan,
    category: "Women",
    sizes: WOMEN,
    county: "Kilifi",
    stock: 7,
  },
  {
    id: "eldoret-bomber",
    name: "Eldoret Bomber Jacket",
    subtitle: "Lined kitenge bomber",
    price: 5400,
    compareAt: 6200,
    image: eldoretBomber,
    category: "Men",
    sizes: MEN,
    county: "Uasin Gishu",
    stock: 5,
  },
  {
    id: "kisii-two-piece",
    name: "Kisii Two-Piece Set",
    subtitle: "Crop top and wide trousers",
    price: 5200,
    image: kisiiTwoPiece,
    category: "Women",
    tag: "New drop",
    sizes: WOMEN,
    county: "Kisii",
    stock: 4,
  },
  {
    id: "lamu-shirt-dress",
    name: "Lamu Shirt Dress",
    subtitle: "Button-through shirt dress",
    price: 3900,
    image: lamuShirtDress,
    category: "Women",
    sizes: WOMEN,
    county: "Lamu",
    stock: 8,
  },
  {
    id: "meru-waistcoat",
    name: "Meru Waistcoat",
    subtitle: "Formal kitenge waistcoat",
    price: 3100,
    image: meruWaistcoat,
    category: "Men",
    sizes: MEN,
    county: "Meru",
    stock: 10,
  },
  {
    id: "thika-dashiki",
    name: "Thika Dashiki Top",
    subtitle: "Classic embroidered dashiki",
    price: 2400,
    image: thikaDashiki,
    category: "Men",
    sizes: MEN,
    county: "Kiambu",
    stock: 14,
  },
  {
    id: "kitale-kids-shirt",
    name: "Kitale Boys Shirt",
    subtitle: "Kids' short-sleeve shirt",
    price: 1400,
    image: kitaleKidsShirt,
    category: "Men",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    county: "Trans Nzoia",
    stock: 16,
  },
  {
    id: "naivasha-skirt",
    name: "Naivasha A-Line Skirt",
    subtitle: "High-waist midi skirt",
    price: 2600,
    image: naivashaSkirt,
    category: "Women",
    sizes: WOMEN,
    county: "Nakuru",
    stock: 11,
  },
  {
    id: "taita-safari-vest",
    name: "Taita Safari Vest",
    subtitle: "Utility vest with kitenge lining",
    price: 3300,
    image: taitaSafariVest,
    category: "Men",
    sizes: MEN,
    county: "Taita-Taveta",
    stock: 8,
  },
  {
    id: "machakos-jumpsuit",
    name: "Machakos Jumpsuit",
    subtitle: "Wide-leg kitenge jumpsuit",
    price: 5600,
    image: machakosJumpsuit,
    category: "Women",
    tag: "Limited",
    sizes: WOMEN,
    county: "Machakos",
    stock: 3,
  },
  {
    id: "garissa-kanzu",
    name: "Garissa Long Kanzu",
    subtitle: "Trimmed formal kanzu",
    price: 4700,
    image: garissaKanzu,
    category: "Men",
    sizes: MEN,
    county: "Garissa",
    stock: 5,
  },
  {
    id: "nyeri-peplum",
    name: "Nyeri Peplum Top",
    subtitle: "Structured peplum blouse",
    price: 2900,
    image: nyeriPeplum,
    category: "Women",
    sizes: WOMEN,
    county: "Nyeri",
    stock: 9,
  },
  {
    id: "kericho-trench",
    name: "Kericho Trench Coat",
    subtitle: "Lightweight printed trench",
    price: 7200,
    image: kerichoTrench,
    category: "Women",
    tag: "Limited",
    sizes: WOMEN,
    county: "Kericho",
    stock: 2,
  },
  {
    id: "turkana-poncho",
    name: "Turkana Poncho",
    subtitle: "Loose printed poncho",
    price: 3300,
    image: turkanaPoncho,
    category: "Women",
    sizes: ONE,
    county: "Turkana",
    stock: 7,
  },
  {
    id: "bungoma-shorts",
    name: "Bungoma Tailored Shorts",
    subtitle: "Knee-length kitenge shorts",
    price: 2100,
    image: bungomaShorts,
    category: "Men",
    sizes: MEN,
    county: "Bungoma",
    stock: 13,
  },
  {
    id: "kakamega-shuka-shirt",
    name: "Kakamega Long Shirt",
    subtitle: "Long-sleeve print shirt",
    price: 3200,
    image: kakamegaShirt,
    category: "Men",
    sizes: MEN,
    county: "Kakamega",
    stock: 8,
  },
  {
    id: "embu-headwrap",
    name: "Embu Headwrap",
    subtitle: "Pre-tied gele headwrap",
    price: 900,
    image: embuHeadwrap,
    category: "Accessories",
    sizes: ONE,
    county: "Embu",
    stock: 25,
  },
  {
    id: "kitui-tote",
    name: "Kitui Market Tote",
    subtitle: "Lined kitenge tote bag",
    price: 1500,
    image: kituiTote,
    category: "Accessories",
    tag: "Bestseller",
    sizes: ONE,
    county: "Kitui",
    stock: 18,
  },
  {
    id: "mombasa-bow-tie",
    name: "Mombasa Bow Tie & Pocket Square",
    subtitle: "Groomsmen accessory pair",
    price: 1200,
    image: mombasaBowTie,
    category: "Accessories",
    sizes: ONE,
    county: "Mombasa",
    stock: 20,
  },
  {
    id: "isiolo-sandals",
    name: "Isiolo Print Sandals",
    subtitle: "Kitenge-wrapped flat sandals",
    price: 2200,
    image: isioloSandals,
    category: "Accessories",
    sizes: ["36", "37", "38", "39", "40"],
    county: "Isiolo",
    stock: 10,
  },
  {
    id: "homabay-scrunchies",
    name: "Homa Bay Scrunchie Pack",
    subtitle: "Set of five print scrunchies",
    price: 600,
    image: homabayScrunchies,
    category: "Accessories",
    sizes: ONE,
    county: "Homa Bay",
    stock: 30,
  },
  {
    id: "gikomba-fabric-6m",
    name: "Gikomba Wax Print · 6m",
    subtitle: "Cotton wax fabric by the roll",
    price: 3500,
    image: fabric,
    category: "Fabric",
    sizes: ["6 metres"],
    county: "Nairobi",
    stock: 15,
  },
  {
    id: "kongowea-fabric-3m",
    name: "Kongowea Wax Print · 3m",
    subtitle: "Cotton wax fabric half roll",
    price: 1900,
    image: kongoweaFabric,
    category: "Fabric",
    sizes: ["3 metres"],
    county: "Mombasa",
    stock: 22,
  },
];

export const KES = (value: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
