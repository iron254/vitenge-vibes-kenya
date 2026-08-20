import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Sizing Help — KitengeDuka Nairobi" },
      {
        name: "description",
        content:
          "Talk to KitengeDuka about sizing, custom Vitenge orders and delivery. Based on Biashara Street, Nairobi.",
      },
      { property: "og:title", content: "Contact KitengeDuka" },
      { property: "og:description", content: "Sizing help, custom orders and delivery support." },
    ],
  }),
  component: Contact,
});

const faqs = [
  { q: "Which payment methods do you accept?", a: "Payment details are confirmed at checkout." },
  { q: "How long is delivery?", a: "Nairobi 1 day, other counties 2–3 days through our courier partners." },
  { q: "Can I order a custom size?", a: "Yes. WhatsApp your bust, waist and length measurements and we sew to fit." },
  { q: "Do you accept returns?", a: "Exchanges within 7 days if the piece is unworn and tags are intact." },
];

function Contact() {
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-14 md:grid-cols-2">
      <div>
        <h1 className="font-display text-5xl font-bold">Karibu, sema nasi</h1>
        <p className="mt-4 text-muted-foreground">
          Sizing questions, bulk orders for weddings, or help with an order — we reply within a few hours.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-terracotta" /> 0769 535 484</li>
          <li className="flex items-center gap-3"><MessageCircle className="h-5 w-5 text-mpesa" /> WhatsApp 0769 535 484</li>
          <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> Biashara Street, Nairobi CBD</li>
        </ul>

        <div className="mt-10 space-y-2">
          <h2 className="font-display text-2xl font-bold">Maswali</h2>
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-sm border border-border">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
              >
                {f.q}
                <span className="text-accent">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <p className="px-4 pb-3 text-sm text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="h-fit rounded-sm bg-card p-6 edge-ink"
      >
        <h2 className="font-display text-2xl font-bold">Send a message</h2>
        {["Jina / Name", "Phone number", "Message"].map((label) =>
          label === "Message" ? (
            <label key={label} className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
              <textarea
                required
                rows={4}
                className="mt-1 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </label>
          ) : (
            <label key={label} className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
              <input
                required
                className="mt-1 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </label>
          ),
        )}
        <button className="mt-5 w-full rounded-sm bg-foreground px-4 py-3 text-sm font-bold text-background">
          Tuma ujumbe
        </button>
        {sent && <p className="mt-3 text-sm font-semibold text-mpesa">Thank you! We'll get back to you shortly.</p>}
      </form>
    </div>
  );
}
