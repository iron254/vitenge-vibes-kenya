import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts, type Product } from "@/lib/products";
import fabricFallback from "@/assets/fabric.jpg";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  compare_at: number | null;
  image_key: string | null;
  image_url: string | null;
  category: string;
  sizes: string[];
  county: string;
  stock: number;
  sort_order: number;
  active: boolean;
};

const imageByKey: Record<string, string> = Object.fromEntries(
  staticProducts.map((p) => [p.id, p.image]),
);
imageByKey["p1"] = imageByKey["shati-jua"] ?? fabricFallback;
imageByKey["p2"] = imageByKey["gauni-bahari"] ?? fabricFallback;
imageByKey["p4"] = imageByKey["kilemba-set"] ?? fabricFallback;

export function resolveImage(row: Pick<ProductRow, "image_key" | "image_url">) {
  if (row.image_url) return row.image_url;
  if (row.image_key && imageByKey[row.image_key]) return imageByKey[row.image_key]!;
  return fabricFallback;
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    price: row.price,
    ...(row.compare_at ? { compareAt: row.compare_at } : {}),
    image: resolveImage(row),
    category: (row.category as Product["category"]) ?? "Women",
    sizes: row.sizes?.length ? row.sizes : ["One size"],
    county: row.county,
    stock: row.stock,
  };
}

export async function fetchCatalog(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
    initialData: staticProducts,
    staleTime: 30_000,
  });
}
