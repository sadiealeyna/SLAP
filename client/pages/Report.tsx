import { useEffect, useMemo, useState } from "react";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string || "SLAP";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string || "template_kx86xsp";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string || "U1eCskqCSr48R44v1";
const FROM_EMAIL = import.meta.env.VITE_EMAILJS_TO_EMAIL as string || "slap.student.project@gmail.com";

export default function Report() {
  const [grade, setGrade] = useState("9th");
  const [school, setSchool] = useState("");
  const [principalEmail, setPrincipalEmail] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [yourName, setYourName] = useState("");

  const [sending, setSending] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const reporterName = anonymous ? "Anonymous" : yourName || "(no name)";

  const emailSubject = useMemo(() => `${grade} student report — ${school || "(no school provided)"}`, [grade, school]);

  const emailBody = useMemo(() => {
    return `Hello Principal,\n\nA report has been submitted via the Student Legislative Accountability Project (SLAP):\n\nGrade: [${grade}]\nSchool: [${school}]\nReporter: [${reporterName}]\n\nThis message was sent on behalf of SLAP (slap.student.project@gmail.com).`;
  }, [grade, school, reporterName]);

  useEffect(() => {
    setResultMessage(null);
  }, [grade, school, principalEmail, anonymous, yourName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultMessage(null);

    // Basic validation
    if (!school.trim()) {
      setResultMessage("Please enter your school name.");
      return;
    }
    if (!principalEmail.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(principalEmail)) {
      setResultMessage("Please enter a valid principal email.");
      return;
    }

    setSending(true);

    const templateParams = {
      // common aliases to increase compatibility with different EmailJS template variable names
      to_email: principalEmail,
      to: principalEmail,
      recipient_email: principalEmail,
      recipient: principalEmail,

      from_email: FROM_EMAIL,
      from: FROM_EMAIL,
      sender: FROM_EMAIL,

      subject: emailSubject,
      title: emailSubject,

      message: emailBody,
      body: emailBody,
      text: emailBody,

      grade: grade,
      school: school,
      reporter: reporterName,
      reporter_name: reporterName,
    } as Record<string, string>;

    try {
      // Prefer the EmailJS SDK if available — it's more robust with CORS and error messages.
      const sendWithSdk = async () => {
        // Load SDK if not present
        if (typeof (window as any).emailjs === "undefined") {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://cdn.emailjs.com/sdk/2.3.2/email.min.js";
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load EmailJS SDK"));
            document.head.appendChild(s);
          });
        }

        const emailjs = (window as any).emailjs;
        if (!emailjs.__initialized) {
          try {
            emailjs.init(PUBLIC_KEY);
            emailjs.__initialized = true;
          } catch (e) {
            // ignore
          }
        }

        return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      };

      let sendResult: any = null;

      // Debugging: log template params so we can inspect what is being sent
      try {
        console.debug("EmailJS template_params:", templateParams);
      } catch (e) {
        // ignore
      }

      try {
        sendResult = await sendWithSdk();
      } catch (sdkErr) {
        // SDK failed — fallback to REST API and capture detailed errors
        console.warn("EmailJS SDK send failed, falling back to REST API:", sdkErr);

        const resp = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: SERVICE_ID,
            template_id: TEMPLATE_ID,
            user_id: PUBLIC_KEY,
            template_params: templateParams,
          }),
        });

        if (!resp.ok) {
          let msg = `Status ${resp.status}`;
          try {
            const json = await resp.clone().json();
            msg = json?.error || JSON.stringify(json) || msg;
          } catch (_) {
            try {
              const txt = await resp.clone().text();
              msg = txt || msg;
            } catch (_) {
              // ignore
            }
          }
          throw new Error(msg);
        }

        sendResult = await resp.text();
      }

      console.log("Email send result:", sendResult);
      setResultMessage("Report sent — email delivered to the principal.");
      // Clear form except keep anonymous setting
      setSchool("");
      setPrincipalEmail("");
      setYourName("");
    } catch (err: any) {
      console.error("Send failed:", err);
      setResultMessage(`Failed to send report: ${err?.message || String(err)}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-[60vh]">
      <section className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Report</h1>
          <p className="mt-2 text-foreground/80">Fill out the form below and we will email your school's principal.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6 rounded-lg border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex w-full flex-col">
                <span className="text-sm font-medium">Grade</span>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="mt-2 rounded-md border px-3 py-2 text-sm"
                >
                  <option>9th</option>
                  <option>10th</option>
                  <option>11th</option>
                  <option>12th</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="flex w-full flex-col">
                <span className="text-sm font-medium">School name</span>
                <input
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                  className="mt-2 rounded-md border px-3 py-2 text-sm"
                  placeholder="e.g. Lincoln High School"
                />
              </label>

              <label className="flex w-full flex-col">
                <span className="text-sm font-medium">Principal’s email</span>
                <input
                  value={principalEmail}
                  onChange={(e) => setPrincipalEmail(e.target.value)}
                  required
                  type="email"
                  className="mt-2 rounded-md border px-3 py-2 text-sm"
                  placeholder="principal@school.edu"
                />
              </label>

              <div className="flex items-center gap-3">
                <input
                  id="anonymous"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  type="checkbox"
                  className="h-5 w-5 rounded border"
                />
                <label htmlFor="anonymous" className="text-sm">Send anonymously</label>
              </div>

              {!anonymous && (
                <label className="flex w-full flex-col">
                  <span className="text-sm font-medium">Your name</span>
                  <input
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    className="mt-2 rounded-md border px-3 py-2 text-sm"
                    placeholder="Your full name"
                  />
                </label>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={sending}
                className={`w-full rounded-full bg-primary px-5 py-3 text-center text-base font-semibold text-primary-foreground shadow-lg transition-opacity ${sending ? "opacity-60" : "hover:shadow-xl"}`}
              >
                {sending ? "Sending…" : "Send Report"}
              </button>
            </div>

            {resultMessage && (
              <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-800">{resultMessage}</div>
            )}

            <div className="mt-4">
              <h3 className="text-sm font-semibold">Email preview</h3>

              <div className="mt-3 rounded-lg border bg-white p-4 text-sm text-foreground shadow-sm">
                <div className="mb-2 text-xs text-foreground/70">To: {principalEmail || "[principal@example.edu]"}</div>
                <div className="mb-2 text-xs text-foreground/70">From: {FROM_EMAIL}</div>
                <div className="mb-4 text-xs text-foreground/70">Subject: {emailSubject}</div>

                <div className="rounded-md bg-slate-50 p-4 text-foreground">
                  <p className="mb-4">Dear {school || "[School Name]"},</p>

                  <p className="mb-3 leading-relaxed">
                    I am writing to inform you of a concern regarding compliance with California’s Menstrual Equity Act (AB 367), which requires public schools serving grades 6–12 to provide free menstrual products in all women’s restrooms, all‑gender restrooms, and at least one men’s restroom.
                  </p>

                  <p className="mb-3 leading-relaxed">
                    At <strong>{school || "[School Name]"}</strong>, students have reported issues with access to menstrual products. We ask that you please review this matter and ensure that your school is in full compliance with state law so that all students have equitable access to these essential resources.
                  </p>

                  <p className="mb-3">Thank you for your attention to this important issue.</p>

                  <p className="mt-4">Reported by: <strong>{anonymous ? "Anonymous Student Report" : (yourName || "(no name)")}</strong></p>

                  <p className="mt-6">Sincerely,<br/>SLAP (slap.student.project@gmail.com)</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
