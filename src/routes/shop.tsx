import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Vitenge Clothing Online in Kenya | KitengeDuka" },
      {
        name: "description",
        content:
          "Browse Vitenge dresses, camp shirts, blazers and headwraps tailored in Kenya. Filter by category and pay with M-Pesa.",
      },
      { property: "og:title", content: "Shop Vitenge Clothing | KitengeDuka" },
      { property: "og:description", content: "Kenyan-made Vitenge pieces, paid for with M-Pesa." },
    ],
  }),
  component: Shop,
});

const categories = ["All", "Women", "Men", "Accessories", "Fabric"] as const;
const sorts = ["Featured", "Price: low to high", "Price: high to low"] as const;

function Shop() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Featured");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    let out: Product[] = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (p.name + p.subtitle + p.county).toLowerCase().includes(query.toLowerCase()),
    );
    if (sort === "Price: low to high") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "Price: high to low") out = [...out].sort((a, b) => b.price - a.price);
    return out;
  }, [category, sort, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">Duka</p>
        <h1 className="mt-2 font-display text-5xl font-bold">All Vitenge</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every piece is made-to-order in Kenya. Prices in Kenyan shillings, payment via M-Pesa.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-border py-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                category === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search kitenge…"
            aria-label="Search products"
            className="rounded-sm border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
            aria-label="Sort products"
            className="rounded-sm border border-input bg-card px-3 py-2 text-sm"
          >
            {sorts.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{list.length} pieces</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">Nothing here. Try another filter.</p>
      )}
    </div>
  );
}
