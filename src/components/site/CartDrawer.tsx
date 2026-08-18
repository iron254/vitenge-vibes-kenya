import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Minus, Plus, Smartphone, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { KES } from "@/lib/products";

const TILL = "5203041";

type Stage = "cart" | "details" | "pending" | "done";

export function CartDrawer() {
  const { lines, subtotal, count, open, setOpen, remove, setQty, clear } = useCart();
  const [stage, setStage] = useState<Stage>("cart");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [town, setTown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState("");

  const delivery = subtotal === 0 || subtotal >= 5000 ? 0 : 350;
  const total = subtotal + delivery;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const normalize = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (/^0(7|1)\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
    if (/^254(7|1)\d{8}$/.test(digits)) return digits;
    if (/^(7|1)\d{8}$/.test(digits)) return `254${digits}`;
    return null;
  };

  const pay = () => {
    const msisdn = normalize(phone);
    if (!name.trim()) return setError("Tafadhali weka jina lako (your name).");
    if (!town.trim()) return setError("Add the town for delivery.");
    if (!msisdn) return setError("Enter a valid Safaricom number, e.g. 0712 345 678.");
    setError(null);
    setStage("pending");
    window.setTimeout(() => {
      setRef(`Q${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
      setStage("done");
      clear();
    }, 2600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close cart"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-lift animate-rise">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-bold">
            {stage === "cart" ? `Kikapu (${count})` : stage === "done" ? "Malipo yamekamilika" : "Lipa na M-Pesa"}
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-sm p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {stage === "cart" && (
            lines.length === 0 ? (
              <p className="mt-16 text-center text-sm text-muted-foreground">
                Your kikapu is empty. Add a kitenge piece to begin.
              </p>
            ) : (
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li key={line.id} className="flex gap-3 rounded-sm border border-border p-2">
                    <img src={line.image} alt={line.name} loading="lazy" className="h-20 w-16 rounded-sm object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{line.name}</p>
                      <p className="text-xs text-muted-foreground">Size {line.size}</p>
                      <p className="mt-1 text-sm font-bold">{KES(line.price * line.qty)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => remove(line.id)} aria-label="Remove item" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-2 rounded-sm border border-border px-1">
                        <button aria-label="Decrease" onClick={() => setQty(line.id, line.qty - 1)}><Minus className="h-3.5 w-3.5" /></button>
                        <span className="text-sm tabular-nums">{line.qty}</span>
                        <button aria-label="Increase" onClick={() => setQty(line.id, line.qty + 1)}><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}

          {stage === "details" && (
            <div className="space-y-4">
              <div className="rounded-sm bg-mpesa/10 p-3 text-sm">
                <p className="font-semibold text-foreground">Buy Goods Till {TILL}</p>
                <p className="text-muted-foreground">An STK push will pop up on your phone. Enter your M-Pesa PIN to confirm.</p>
              </div>
              <Field label="Jina kamili / Full name" value={name} onChange={setName} placeholder="Achieng Wanjiru" />
              <Field label="Namba ya simu / Safaricom number" value={phone} onChange={setPhone} placeholder="0712 345 678" inputMode="tel" />
              <Field label="Delivery town / estate" value={town} onChange={setTown} placeholder="Kisumu CBD" />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            </div>
          )}

          {stage === "pending" && (
            <div className="mt-20 flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-mpesa" />
              <p className="font-display text-lg font-bold">Check your phone</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                We sent an M-Pesa request of {KES(total)} to {phone}. Enter your PIN to complete payment.
              </p>
            </div>
          )}

          {stage === "done" && (
            <div className="mt-16 flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-mpesa" />
              <p className="font-display text-xl font-bold">Asante sana, {name.split(" ")[0]}!</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Payment received. M-Pesa code <span className="font-bold text-foreground">{ref}</span>. We'll call you before delivery to {town}.
              </p>
              <button
                onClick={() => { setStage("cart"); setOpen(false); }}
                className="rounded-sm bg-foreground px-4 py-2 text-sm font-semibold text-background"
              >
                Continue shopping
              </button>
            </div>
          )}
        </div>

        {(stage === "cart" || stage === "details") && lines.length > 0 && (
          <div className="space-y-3 border-t border-border px-5 py-4">
            <Row label="Subtotal" value={KES(subtotal)} />
            <Row label="Delivery" value={delivery === 0 ? "Free" : KES(delivery)} />
            <Row label="Total" value={KES(total)} bold />
            {stage === "cart" ? (
              <button
                onClick={() => setStage("details")}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-mpesa px-4 py-3 text-sm font-bold text-mpesa-foreground transition-transform hover:-translate-y-0.5"
              >
                <Smartphone className="h-4 w-4" /> Lipa na M-Pesa
              </button>
            ) : (
              <button
                onClick={pay}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-mpesa px-4 py-3 text-sm font-bold text-mpesa-foreground transition-transform hover:-translate-y-0.5"
              >
                Send STK push · {KES(total)}
              </button>
            )}
            <p className="text-center text-[11px] text-muted-foreground">M-Pesa is our only payment method. No cards, no cash on delivery.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-display text-base font-bold" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "" : "text-foreground"}>{value}</span>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, inputMode,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; inputMode?: "tel";
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}
