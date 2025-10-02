import { Link } from "react-router-dom";

export default function Index() {
  return (
    <main className="">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="container py-16 md:py-24 text-center text-white">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold backdrop-blur">
            Students • Rights • Action
          </div>
          <h1 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Student Legislative Accountability Project (SLAP)
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-white/80">
            Holding schools accountable to California’s Menstrual Equity Law.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/report"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-shadow"
            >
              File a Report
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
            >
              How it works
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background" />
      </section>

      {/* About */}
      <section className="container py-16 md:py-24" id="about">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">About the Project</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              SLAP is a student-powered initiative to ensure every campus follows California’s Menstrual Equity Law. We provide a simple way for students to report missing supplies or policy violations so administrators can act quickly. Together, we make schools more equitable, respectful, and responsive to student needs.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Use this site to submit a report in under two minutes. You can choose to remain anonymous or include your name. Your report is sent directly to your school’s administration.
            </p>
            <div className="mt-6">
              <Link to="/report" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:shadow-md transition-shadow">Start a Report</Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border p-6 bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center font-extrabold">1</div>
                <div>
                  <div className="font-bold">Real issues, real impact</div>
                  <div className="text-sm text-foreground/70">Reports help administrators identify gaps and respond faster.</div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center font-extrabold">2</div>
                <div>
                  <div className="font-bold">Privacy first</div>
                  <div className="text-sm text-foreground/70">You decide what to share and whether to include your name.</div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center font-extrabold">3</div>
                <div>
                  <div className="font-bold">Simple and fast</div>
                  <div className="text-sm text-foreground/70">Designed to work on any device in under two minutes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-16 md:py-24" id="how">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-600/10 to-transparent" />
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center">How it Works</h2>
          <ol className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            <li className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center font-extrabold">1</div>
              <h3 className="mt-4 font-bold">Fill out the report form</h3>
              <p className="mt-2 text-sm text-foreground/80">Tell us what’s missing or what happened at your school.</p>
            </li>
            <li className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center font-extrabold">2</div>
              <h3 className="mt-4 font-bold">Choose anonymous or named</h3>
              <p className="mt-2 text-sm text-foreground/80">You control your privacy. Share your name only if you want.</p>
            </li>
            <li className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center font-extrabold">3</div>
              <h3 className="mt-4 font-bold">Email goes to your school admin</h3>
              <p className="mt-2 text-sm text-foreground/80">We route the report to administrators so they can take action.</p>
            </li>
          </ol>
          <div className="mt-10 text-center">
            <Link to="/report" className="inline-flex rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow hover:shadow-md transition-shadow">Report Now</Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Your voice moves policy</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            When students speak up, schools respond. Submit a report today and help make your campus better for everyone.
          </p>
          <div className="mt-6">
            <Link to="/report" className="inline-flex rounded-full bg-white px-6 py-3 text-base font-semibold text-foreground shadow hover:shadow-lg transition-shadow">
              Start Reporting
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container py-8">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-lg font-semibold">Contact</h3>
          <p className="mt-2 text-foreground/80">Email: <a className="font-medium text-primary underline" href="mailto:slap.student.project@gmail.com">slap.student.project@gmail.com</a></p>
        </div>
      </section>
    </main>
  );
}
