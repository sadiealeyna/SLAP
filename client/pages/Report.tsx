import { Link } from "react-router-dom";

export default function Report() {
  return (
    <main className="min-h-[60vh]">
      <section className="container py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Report a Violation</h1>
        <p className="mt-3 text-foreground/80 max-w-2xl">
          This is a placeholder for the report form. Tell me what fields and flow you want and I will build the full form and email flow next.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:shadow-md transition-shadow">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
