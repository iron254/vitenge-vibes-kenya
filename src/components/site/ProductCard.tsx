import { useState } from "react";
import { KES, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState(product.sizes[0]!);

  return (
    <article className="group flex flex-col overflow-hidden rounded-sm bg-card edge-ink transition-transform duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden bg-sand">
        <img
          src={product.image}
          alt={`${product.name} in Kitenge print`}
          loading="lazy"
          width={900}
          height={1100}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-sm bg-terracotta px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-background">
            {product.tag}
          </span>
        )}
        {product.stock <= 4 && (
          <span className="absolute right-3 top-3 rounded-sm bg-background/90 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive">
            {product.stock} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg font-bold leading-tight">{product.name}</h3>
          <p className="text-xs italic text-muted-foreground">{product.subtitle} · {product.county}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold">{KES(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-muted-foreground line-through">{KES(product.compareAt)}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded-sm border px-2 py-1 text-xs font-semibold transition-colors ${
                size === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={() => add(product, size)}
          className="mt-auto rounded-sm bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground transition-colors hover:bg-terracotta hover:text-background"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
