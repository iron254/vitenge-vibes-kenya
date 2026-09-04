import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-sm bg-accent font-display text-lg font-bold text-accent-foreground edge-ink">
            K
          </span>
          <span className="font-display text-xl font-bold leading-none">
            Kitenge<span className="text-terracotta">Duka</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground underline decoration-accent decoration-2 underline-offset-8" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open cart"
            className="relative inline-flex items-center gap-2 rounded-sm bg-foreground px-3 py-2 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            className="md:hidden rounded-sm border border-border p-2"
            aria-label="Toggle menu"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav className="grid gap-1 border-t border-border px-4 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenu(false)}
              className="rounded-sm px-2 py-2 text-sm font-medium hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
