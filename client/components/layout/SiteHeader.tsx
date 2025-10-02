import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:text-foreground hover:bg-muted"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-extrabold">S</span>
          <span className="font-bold tracking-tight">SLAP</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navItemClass} end>
            Home
          </NavLink>
          <NavLink to="/report" className={navItemClass}>
            Report
          </NavLink>
          <NavLink to="/law" className={navItemClass}>
            California Law
          </NavLink>
          <NavLink to="/data" className={navItemClass}>
            Data
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/report"
            className="hidden md:inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:shadow-md transition-shadow"
          >
            File a Report
          </Link>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-2 flex flex-col">
            <NavLink to="/" className={navItemClass} end onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/report" className={navItemClass} onClick={() => setOpen(false)}>
              Report
            </NavLink>
            <NavLink to="/law" className={navItemClass} onClick={() => setOpen(false)}>
              California Law
            </NavLink>
            <NavLink to="/data" className={navItemClass} onClick={() => setOpen(false)}>
              Data
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
