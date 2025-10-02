export default function Law() {
  return (
    <main className="min-h-[60vh]">
      <section className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">California Menstrual Equity Act (AB 367)</h1>

          <p className="mt-4 text-foreground/80 leading-relaxed">
            AB 367 requires public schools serving grades 6–12 to provide free menstrual products in all women’s restrooms, at least one men’s restroom, and all‑gender restrooms. The goal of the law is simple: ensure equitable access to menstrual products so that every student can attend school with dignity and without disruption.
          </p>

          <h2 className="mt-8 text-xl font-bold">Key requirements</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-foreground/80">
            <li>Free menstrual products must be readily available to students.</li>
            <li>Products should be stocked in multiple restrooms across campus.</li>
            <li>Schools must maintain a system to replenish products regularly.</li>
            <li>Noncompliance can be reported through programs like SLAP.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold">Why it matters</h2>
          <p className="mt-3 text-foreground/80 leading-relaxed">
            Lack of access to menstrual products harms attendance, participation, and student dignity. Students who can’t get the supplies they need may miss class or avoid activities, which negatively affects learning and wellbeing. Ensuring free, reliable access helps keep students in school and affirms their right to full participation.
          </p>

          <h2 className="mt-8 text-xl font-bold">Resources</h2>
          <p className="mt-3 text-foreground/80 leading-relaxed">
            Official text of the law:
            <a
              className="ml-1 font-medium text-primary underline"
              href="https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202120220AB367"
              target="_blank"
              rel="noreferrer"
            >
              Read AB 367 (leginfo.ca.gov)
            </a>
          </p>

          <div className="mt-8 rounded-lg border-l-4 border-primary/60 bg-primary/5 p-4">
            <p className="font-semibold">Have concerns?</p>
            <p className="mt-2 text-foreground/80">
              If your school is not meeting these requirements, you can submit a report through SLAP so administrators can be notified and take action.
            </p>
            <div className="mt-3">
              <a href="/report" className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:shadow-md">File a Report</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
