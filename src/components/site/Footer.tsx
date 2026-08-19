import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-bold">
            Kitenge<span className="text-accent">Duka</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">
            Vitenge cut and sewn by Kenyan tailors. Pay the way we all pay — M-Pesa.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-sm bg-mpesa px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-mpesa-foreground">
            Pay with M-Pesa
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Duka</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/shop" className="hover:text-accent">Shop all</Link></li>
            <li><Link to="/about" className="hover:text-accent">Our story</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact & sizing</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Find us</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0769 535 484</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Biashara St, Nairobi</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href="mailto:oluochraymond6@gmail.com" className="hover:text-accent">oluochraymond6@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-4 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} KitengeDuka · Made in Kenya
      </div>
    </footer>
  );
}
