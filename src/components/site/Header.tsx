import { Link } from "react-router-dom";
import { LOGO_URL, useCart } from "@/lib/store";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const count = items.reduce((n, i) => n + i.qty, 0);

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={LOGO_URL} alt="CRIC NINJA" className="h-12 w-12 rounded-full ring-2 ring-primary/40" />
          <div className="hidden flex-col leading-none sm:flex">
            <span className="display text-xl font-bold tracking-widest">CRIC NINJA</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Premium Cricket Bats</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card transition-colors hover:border-primary hover:text-primary"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-sm font-semibold uppercase tracking-wider"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
