import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-foreground/70">
          © 2025 SLAP Project
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/report" className="hover:underline">Report</Link>
          <Link to="/law" className="hover:underline">Law</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
