import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Ruler, Scissors, Smartphone, Truck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import fabricImg from "@/assets/fabric.jpg";
import { products, KES } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KitengeDuka — Kenyan Vitenge Fashion, M-Pesa Checkout" },
      {
        name: "description",
        content:
          "Handmade Vitenge dresses, shirts, blazers and accessories tailored in Kenya. Order online and pay with M-Pesa only. Countrywide delivery.",
      },
      { property: "og:title", content: "KitengeDuka — Kenyan Vitenge Fashion" },
      {
        property: "og:description",
        content: "Vitenge cut and sewn by Kenyan tailors. M-Pesa checkout, delivered countrywide.",
      },
    ],
  }),
  component: Home,
});

const testimonials = [
  { name: "Wanjiku M.", town: "Thika", text: "I got my dress within two days. The quality is excellent!" },
  { name: "Brian O.", town: "Kisumu", text: "The blazer fits perfectly and M-Pesa checkout took ten seconds." },
  { name: "Amina S.", town: "Mombasa", text: "Prints are bold and the tailoring is clean. I will definitely come back." },
];

function Home() {
  const featured = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="h-2 w-2 rounded-full bg-mpesa" /> M-Pesa only checkout
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] text-balance-tight md:text-6xl">
              Vitenge for the <span className="text-terracotta">everyday</span> Kenyan.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Bold wax prints, cut and sewn by tailors in Nairobi, Kisumu and Mombasa. Order today, pay with M-Pesa,
              we will deliver anywhere in Kenya.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-sm bg-foreground px-5 py-3 text-sm font-bold text-background transition-transform hover:-translate-y-0.5"
              >
                Shop the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center rounded-sm border border-foreground px-5 py-3 text-sm font-bold transition-colors hover:bg-muted"
              >
                Meet our tailors
              </Link>
            </div>
            <dl className="mt-10 grid max-w-sm grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                ["1,400+", "Orders sewn"],
                ["47", "Counties served"],
                ["4.8★", "Customer rating"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold">{value}</dt>
                  <dd className="text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 -rotate-2 rounded-sm kitenge-pattern" aria-hidden />
            <img
              src={heroImg}
              alt="Kenyan woman wearing a bold Kitenge print dress"
              width={1408}
              height={1760}
              className="relative aspect-[4/5] w-full rounded-sm object-cover edge-ink"
            />
            <div className="absolute bottom-4 left-4 rounded-sm bg-background/95 px-4 py-3 edge-ink">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Bahari Maxi</p>
              <p className="font-display text-lg font-bold">{KES(4900)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Smartphone, title: "Pay with M-Pesa", body: "STK push to your Safaricom line. No cards needed." },
            { icon: Scissors, title: "Tailored locally", body: "Every piece sewn by Kenyan artisans, not imported." },
            { icon: Truck, title: "Countrywide delivery", body: "Free above KSh 5,000. 1–3 days via matatu courier." },
            { icon: Ruler, title: "Free size advice", body: "WhatsApp us measurements for a custom fit." },
          ].map((f) => (
            <div key={f.title} className="rounded-sm border border-border p-5 transition-colors hover:border-foreground">
              <f.icon className="h-6 w-6 text-terracotta" />
              <p className="mt-3 font-display text-lg font-bold">{f.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">New arrivals</p>
            <h2 className="mt-2 font-display text-4xl font-bold">This week&apos;s drop</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4">
            See everything
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Fabric story */}
      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <img
            src={fabricImg}
            alt="Stacked bolts of colourful Kitenge wax print fabric"
            loading="lazy"
            width={1400}
            height={900}
            className="rounded-sm object-cover"
          />
          <div>
            <h2 className="font-display text-4xl font-bold">Every print has a story</h2>
            <p className="mt-4 text-primary-foreground/80">
              We source wax prints from Gikomba and Kongowea markets, wash and pre-shrink every metre, then hand them to
              tailors who have been cutting kitenge for decades. Nothing here is mass produced.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["100% cotton wax print", "Pre-shrunk and colour-fast", "Made-to-order sizes up to XXXL"].map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="h-1.5 w-6 bg-accent" /> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-4xl font-bold">What customers say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="rounded-sm bg-card p-6 edge-ink">
              <p className="text-sm leading-relaxed">“{t.text}”</p>
              <footer className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t.name} · {t.town}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* M-Pesa CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-sm kitenge-pattern p-1">
          <div className="rounded-sm bg-background px-6 py-12 text-center">
            <h2 className="font-display text-4xl font-bold">Ready? Pay with M-Pesa.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Add to your cart, enter your Safaricom number, approve the STK push. That&apos;s it.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-mpesa px-6 py-3 text-sm font-bold text-mpesa-foreground transition-transform hover:-translate-y-0.5"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
