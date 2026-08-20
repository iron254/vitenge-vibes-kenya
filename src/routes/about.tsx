import { createFileRoute } from "@tanstack/react-router";
import fabricImg from "@/assets/fabric.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Kenyan Tailors Behind KitengeDuka" },
      {
        name: "description",
        content:
          "KitengeDuka works with tailors in Nairobi, Kisumu and Mombasa to turn market wax prints into modern Kenyan clothing.",
      },
      { property: "og:title", content: "Our Story — KitengeDuka" },
      { property: "og:description", content: "The Kenyan tailors and markets behind every Kitenge piece we sell." },
    ],
  }),
  component: About,
});

const steps = [
  { n: "01", t: "Sourcing", d: "We walk Gikomba and Kongowea weekly, choosing wax prints by hand." },
  { n: "02", t: "Cutting", d: "Fabric is washed, pre-shrunk and cut to your chosen size." },
  { n: "03", t: "Sewing", d: "Five tailor workshops sew the pieces, paid per garment, fairly." },
  { n: "04", t: "Delivery", d: "Packed in Nairobi and sent countrywide once your order is confirmed." },
];

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-display text-5xl font-bold">Sisi ni nani</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        KitengeDuka started at a single stall on Biashara Street in 2019. We wanted kitenge that fits how Kenyans
        actually dress today — office, church, campus, harusi — without importing anything.
      </p>

      <img
        src={fabricImg}
        alt="Colourful Kitenge fabric bolts at a Kenyan market"
        loading="lazy"
        width={1400}
        height={900}
        className="mt-10 w-full rounded-sm object-cover edge-ink"
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {steps.map((s) => (
          <div key={s.n} className="rounded-sm border border-border p-6">
            <span className="font-display text-3xl font-bold text-accent">{s.n}</span>
            <p className="mt-2 font-display text-xl font-bold">{s.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-sm bg-primary p-8 text-primary-foreground">
        <h2 className="font-display text-3xl font-bold">Why we keep it simple</h2>
        <p className="mt-3 text-primary-foreground/80">
          Ordering happens straight from your phone. Fewer middlemen keeps our fees low, our prices honest and
          confirmation instant.
        </p>
      </div>
    </div>
  );
}
