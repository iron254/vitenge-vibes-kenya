import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { getOrder } from "@/lib/orders.functions";
import { KES } from "@/lib/products";

export const Route = createFileRoute("/order/$reference")({
  loader: ({ params }) => getOrder({ data: { reference: params.reference } }),
  head: () => ({
    meta: [
      { title: "Order confirmation — KitengeDuka" },
      { name: "description", content: "Your KitengeDuka order details, items and delivery information." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order confirmation — KitengeDuka" },
      { property: "og:description", content: "Your KitengeDuka order details, items and delivery information." },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const data = Route.useLoaderData();
  const { reference } = Route.useParams();

  if (!data) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Order not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We couldn't find an order with reference {reference}.
        </p>
        <Link to="/shop" className="mt-6 inline-block rounded-sm bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
          Back to shop
        </Link>
      </section>
    );
  }

  const { order, items } = data;

  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-12 w-12 text-mpesa" />
        <h1 className="mt-4 font-display text-3xl font-bold">
          Thank you, {order.customer_name.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order <span className="font-bold text-foreground">{order.reference}</span> is confirmed. We'll call{" "}
          {order.phone} before delivery to {order.town}.
        </p>
      </div>

      <ul className="mt-10 divide-y divide-border rounded-sm border border-border">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 p-3">
            {item.image && (
              <img src={item.image} alt={item.product_name} loading="lazy" className="h-16 w-14 rounded-sm object-cover" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.product_name}</p>
              <p className="text-xs text-muted-foreground">Size {item.size} · Qty {item.qty}</p>
            </div>
            <p className="text-sm font-bold">{KES(item.unit_price * item.qty)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2 rounded-sm border border-border p-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span><span className="text-foreground">{KES(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery</span><span className="text-foreground">{order.delivery === 0 ? "Free" : KES(order.delivery)}</span>
        </div>
        <div className="flex justify-between font-display text-base font-bold">
          <span>Total</span><span>{KES(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/shop" className="inline-block rounded-sm bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
