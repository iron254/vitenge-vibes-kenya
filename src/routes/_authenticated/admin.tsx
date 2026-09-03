import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KES } from "@/lib/products";
import { resolveImage, type ProductRow } from "@/lib/catalog";
import { useSession, useIsAdmin } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Manage the Vitenge catalogue | KitengeDuka Admin" },
      {
        name: "description",
        content: "Add, edit and remove Vitenge clothing, fabrics and accessories in the KitengeDuka catalogue.",
      },
      { property: "og:title", content: "Catalogue admin | KitengeDuka" },
      { property: "og:description", content: "Manage products, fabrics and accessories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const CATEGORIES = ["Women", "Men", "Accessories", "Fabric"] as const;

type Draft = {
  id?: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  compare_at: number | null;
  image_url: string;
  category: string;
  sizes: string;
  county: string;
  stock: number;
  active: boolean;
};

const emptyDraft = (): Draft => ({
  slug: "",
  name: "",
  subtitle: "",
  price: 0,
  compare_at: null,
  image_url: "",
  category: "Women",
  sizes: "S, M, L, XL",
  county: "Nairobi",
  stock: 10,
  active: true,
});

function Admin() {
  const qc = useQueryClient();
  const { user } = useSession();
  const isAdmin = useIsAdmin(user?.id);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error: err } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      return data as ProductRow[];
    },
  });

  const save = async () => {
    if (!draft) return;
    setError(null);
    const payload = {
      slug: draft.slug.trim() || draft.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: draft.name.trim(),
      subtitle: draft.subtitle.trim(),
      price: Number(draft.price) || 0,
      compare_at: draft.compare_at ? Number(draft.compare_at) : null,
      image_url: draft.image_url.trim() || null,
      category: draft.category,
      sizes: draft.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      county: draft.county.trim() || "Nairobi",
      stock: Number(draft.stock) || 0,
      active: draft.active,
    };
    if (!payload.name) return setError("Name is required.");
    const res = draft.id
      ? await supabase.from("products").update(payload).eq("id", draft.id)
      : await supabase.from("products").insert(payload);
    if (res.error) return setError(res.error.message);
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["catalog"] });
  };

  const remove = async (row: ProductRow) => {
    if (!window.confirm(`Delete ${row.name}?`)) return;
    const { error: err } = await supabase.from("products").delete().eq("id", row.id);
    if (err) return setError(err.message);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["catalog"] });
  };

  if (user && !isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Admins only</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This account can’t manage the catalogue.{" "}
          <Link to="/account" className="underline underline-offset-4">
            Back to my account
          </Link>
        </p>
      </div>
    );
  }

  const rows = (products.data ?? []).filter((r) => filter === "All" || r.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">Admin</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Catalogue</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add, edit and delete clothing, fabrics and accessories.
          </p>
        </div>
        <button
          onClick={() => setDraft(emptyDraft())}
          className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground"
        >
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
              filter === c ? "border-foreground bg-foreground text-background" : "border-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}

      {draft && (
        <div className="mt-6 grid gap-3 rounded-sm border border-border p-4 sm:grid-cols-2">
          <h2 className="font-display text-xl font-bold sm:col-span-2">
            {draft.id ? "Edit product" : "New product"}
          </h2>
          <Text label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <Text label="Subtitle" value={draft.subtitle} onChange={(v) => setDraft({ ...draft, subtitle: v })} />
          <Text
            label="Price (KES)"
            value={String(draft.price)}
            onChange={(v) => setDraft({ ...draft, price: Number(v.replace(/\D/g, "")) })}
          />
          <Text
            label="Compare-at price (optional)"
            value={draft.compare_at ? String(draft.compare_at) : ""}
            onChange={(v) => setDraft({ ...draft, compare_at: v ? Number(v.replace(/\D/g, "")) : null })}
          />
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="mt-1 w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <Text label="Sizes (comma separated)" value={draft.sizes} onChange={(v) => setDraft({ ...draft, sizes: v })} />
          <Text label="County" value={draft.county} onChange={(v) => setDraft({ ...draft, county: v })} />
          <Text
            label="Stock"
            value={String(draft.stock)}
            onChange={(v) => setDraft({ ...draft, stock: Number(v.replace(/\D/g, "")) })}
          />
          <Text
            label="Image URL (optional)"
            value={draft.image_url}
            onChange={(v) => setDraft({ ...draft, image_url: v })}
          />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
            />
            Visible in the shop
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button onClick={save} className="rounded-sm bg-foreground px-4 py-2.5 text-sm font-bold text-background">
              Save
            </button>
            <button
              onClick={() => setDraft(null)}
              className="rounded-sm border border-border px-4 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-2">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Visible</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60">
                <td className="flex items-center gap-3 py-2">
                  <img src={resolveImage(r)} alt={r.name} className="h-12 w-10 rounded-sm object-cover" />
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                  </div>
                </td>
                <td>{r.category}</td>
                <td>{KES(r.price)}</td>
                <td>{r.stock}</td>
                <td>{r.active ? "Yes" : "No"}</td>
                <td className="whitespace-nowrap text-right">
                  <button
                    aria-label={`Edit ${r.name}`}
                    onClick={() =>
                      setDraft({
                        id: r.id,
                        slug: r.slug,
                        name: r.name,
                        subtitle: r.subtitle,
                        price: r.price,
                        compare_at: r.compare_at,
                        image_url: r.image_url ?? "",
                        category: r.category,
                        sizes: (r.sizes ?? []).join(", "),
                        county: r.county,
                        stock: r.stock,
                        active: r.active,
                      })
                    }
                    className="rounded-sm border border-border p-2 hover:border-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Delete ${r.name}`}
                    onClick={() => remove(r)}
                    className="ml-2 rounded-sm border border-border p-2 text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}
