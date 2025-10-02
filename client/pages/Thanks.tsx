import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Thanks() {
  useEffect(() => {
    // load canvas-confetti and fire
    const loadAndFire = async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load confetti'));
          document.head.appendChild(s);
        });

        const confetti = (window as any).confetti;
        if (confetti) {
          // burst confetti a few times
          for (let i = 0; i < 6; i++) {
            confetti({
              particleCount: 100,
              spread: 60,
              origin: { x: Math.random(), y: Math.random() * 0.4 },
            });
          }
        }
      } catch (e) {
        // silent
        console.warn('Confetti load failed', e);
      }
    };

    loadAndFire();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-lg text-center py-24">
        <div className="rounded-2xl border bg-white p-10 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-extrabold">Thank you for submitting your report</h1>
          <p className="mt-4 text-foreground/80">Your report has been sent to the school's administration. We appreciate you taking action to improve menstrual equity on campus.</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Return home</Link>
            <Link to="/report" className="rounded-full border px-5 py-2 text-sm">File another report</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
