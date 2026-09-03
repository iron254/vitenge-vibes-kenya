import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, HeartOff, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KES } from "@/lib/products";
import { useSession, useIsAdmin } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My orders and favourites | KitengeDuka" },
      {
        name: "description",
        content: "View your past Vitenge orders, receipts and the favourite orders you saved for reordering.",
      },
      { property: "og:title", content: "My account | KitengeDuka" },
      { property: "og:description", content: "Your Vitenge order history and saved favourites." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Account,
});

type OrderRow = {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  town: string;
  subtotal: number;
  delivery: number;
  total: number;
  status: string;
  created_at: string;
  order_items: { product_name: string; size: string; unit_price: number; qty: number }[];
};

function Account() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useSession();
  const isAdmin = useIsAdmin(user?.id);

  const orders = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(product_name, size, unit_price, qty)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as OrderRow[];
    },
  });

  const favourites = useQuery({
    queryKey: ["my-favourites", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("favorite_orders").select("id, order_id, label");
      if (error) throw error;
      return data;
    },
  });

  const favByOrder = new Map((favourites.data ?? []).map((f) => [f.order_id, f]));

  const toggleFavourite = async (order: OrderRow) => {
    const existing = favByOrder.get(order.id);
    if (existing) {
      await supabase.from("favorite_orders").delete().eq("id", existing.id);
    } else {
      await supabase.from("favorite_orders").insert({
        user_id: user!.id,
        order_id: order.id,
        label: order.reference,
      });
    }
    qc.invalidateQueries({ queryKey: ["my-favourites", user?.id] });
  };

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const list = orders.data ?? [];
  const saved = list.filter((o) => favByOrder.has(o.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">Account</p>
          <h1 className="mt-2 font-display text-4xl font-bold">My orders</h1>
          <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-sm border border-border px-4 py-2 text-sm font-semibold hover:border-foreground"
            >
              Manage products
            </Link>
          )}
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-sm bg-foreground px-4 py-2 text-sm font-semibold text-background"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {saved.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Favourite orders</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {saved.map((o) => (
              <Link
                key={o.id}
                to="/order/$reference"
                params={{ reference: o.reference }}
                className="rounded-full border border-accent px-4 py-1.5 text-sm font-semibold"
              >
                {o.reference} · {KES(o.total)}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 space-y-4">
        {orders.isLoading && <p className="text-sm text-muted-foreground">Loading your orders…</p>}
        {!orders.isLoading && list.length === 0 && (
          <p className="rounded-sm border border-border p-8 text-center text-sm text-muted-foreground">
            No orders yet.{" "}
            <Link to="/shop" className="underline underline-offset-4">
              Start shopping
            </Link>
            .
          </p>
        )}

        {list.map((o) => (
          <article key={o.id} className="rounded-sm border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold">{o.reference}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleString("en-KE")} · {o.town} · {o.status}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-bold">{KES(o.total)}</span>
                <button
                  onClick={() => toggleFavourite(o)}
                  aria-label={favByOrder.has(o.id) ? "Remove from favourites" : "Save as favourite"}
                  className="rounded-sm border border-border p-2 hover:border-foreground"
                >
                  {favByOrder.has(o.id) ? (
                    <HeartOff className="h-4 w-4" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {o.order_items?.map((i, idx) => (
                <li key={idx}>
                  {i.qty} × {i.product_name} (size {i.size}) — {KES(i.unit_price * i.qty)}
                </li>
              ))}
            </ul>
            <Link
              to="/order/$reference"
              params={{ reference: o.reference }}
              className="mt-3 inline-block text-sm font-semibold underline underline-offset-4"
            >
              View receipt
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
