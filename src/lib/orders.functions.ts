import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

async function currentUserId(): Promise<string | null> {
  try {
    const request = getRequest();
    const authHeader = request?.headers?.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7);
    if (token.split(".").length !== 3) return null;
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data, error } = await client.auth.getClaims(token);
    if (error || !data?.claims?.sub) return null;
    return data.claims.sub as string;
  } catch {
    return null;
  }
}

const itemSchema = z.object({
  name: z.string().min(1).max(200),
  size: z.string().min(1).max(40),
  price: z.number().int().min(0).max(10_000_000),
  qty: z.number().int().min(1).max(99),
  image: z.string().max(500).optional(),
});

const createSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().regex(/^254(7|1)\d{8}$/),
  town: z.string().min(1).max(120),
  items: z.array(itemSchema).min(1).max(50),
});

const makeReference = () =>
  `Q${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`;

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const subtotal = data.items.reduce((n, i) => n + i.price * i.qty, 0);
    const delivery = subtotal >= 5000 ? 0 : 350;
    const total = subtotal + delivery;
    const reference = makeReference();

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        reference,
        customer_name: data.name,
        phone: data.phone,
        town: data.town,
        subtotal,
        delivery,
        total,
        status: "paid",
      })
      .select("id, reference")
      .single();

    if (error || !order) throw new Error(error?.message ?? "Could not save the order");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      data.items.map((i) => ({
        order_id: order.id,
        product_name: i.name,
        size: i.size,
        unit_price: i.price,
        qty: i.qty,
        image: i.image ?? null,
      })),
    );

    if (itemsError) throw new Error(itemsError.message);

    return { reference: order.reference, total, subtotal, delivery };
  });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ reference: z.string().min(4).max(40) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, reference, customer_name, phone, town, subtotal, delivery, total, status, created_at")
      .eq("reference", data.reference)
      .maybeSingle();

    if (!order) return null;

    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_name, size, unit_price, qty, image")
      .eq("order_id", order.id);

    const { id: _id, ...publicOrder } = order;
    return { order: publicOrder, items: items ?? [] };
  });
