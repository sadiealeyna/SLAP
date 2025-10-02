import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  yes: "#4CAF50",
  no: "#F44336",
  both: "#FFC107",
  nr: "#9E9E9E",
};

// Dataset provided by user (percentages). Keys are YYYY-MM-DD
const RAW_DATA: Record<string, { yes?: number; no?: number; both?: number; nr?: number }> = {
  "2023-10-11": { yes: 0, no: 100, both: 0, nr: 0 },
  "2023-10-14": { yes: 0, no: 85, both: 0, nr: 15 },
  "2023-10-15": { yes: 0, no: 50, both: 10, nr: 40 },
  "2023-10-16": { yes: 0, no: 65, both: 0, nr: 35 },
  "2023-10-17": { yes: 0, no: 70, both: 0, nr: 30 },
  "2023-10-18": { yes: 0, no: 55, both: 0, nr: 45 },
  "2023-10-21": { yes: 0, no: 60, both: 0, nr: 40 },
  "2023-10-22": { yes: 6, no: 81, both: 6, nr: 7 },
  "2023-10-23": { yes: 0, no: 65, both: 0, nr: 35 },
  "2023-10-24": { yes: 0, no: 70, both: 0, nr: 30 },
  "2023-10-25": { yes: 0, no: 45, both: 0, nr: 55 },
  "2023-10-28": { yes: 6, no: 75, both: 0, nr: 19 },
  "2023-10-29": { yes: 0, no: 60, both: 0, nr: 40 },
  "2023-10-30": { yes: 0, no: 68, both: 0, nr: 32 },
  "2023-10-31": { yes: 0, no: 63, both: 0, nr: 37 },
  "2023-11-01": { yes: 0, no: 65, both: 0, nr: 35 },
  "2023-11-04": { yes: 0, no: 62, both: 0, nr: 38 },
  "2023-11-05": { yes: 0, no: 43, both: 0, nr: 57 },
  "2023-11-06": { yes: 0, no: 48, both: 0, nr: 52 },
  "2023-11-07": { yes: 0, no: 52, both: 0, nr: 48 },
  "2023-11-08": { yes: 0, no: 52, both: 0, nr: 48 },
  "2023-11-11": { yes: 0, no: 48, both: 0, nr: 52 },
  "2023-11-12": { yes: 0, no: 38, both: 0, nr: 62 },
  "2023-11-13": { yes: 0, no: 67, both: 0, nr: 33 },
  "2023-11-14": { yes: 0, no: 0, both: 0, nr: 100 },
  "2023-11-15": { yes: 0, no: 0, both: 0, nr: 100 },
  "2023-11-18": { yes: 0, no: 0, both: 0, nr: 100 },
  "2023-11-19": { yes: 0, no: 0, both: 0, nr: 100 },
  "2023-11-20": { yes: 0, no: 0, both: 0, nr: 100 },
  "2023-11-21": { yes: 0, no: 0, both: 0, nr: 100 },
  "2023-11-22": { yes: 0, no: 0, both: 0, nr: 100 },
};

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function shortLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Data() {
  const start = new Date(2023, 9, 11); // Oct 11, 2023
  const end = new Date(2023, 10, 22); // Nov 22, 2023

  const dates: string[] = useMemo(() => {
    const arr: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      arr.push(formatDate(new Date(d)));
    }
    return arr;
  }, []);

  const fullData = useMemo(() => {
    return dates.map((date) => {
      const raw = RAW_DATA[date];
      if (raw) {
        return {
          date,
          yes: raw.yes ?? 0,
          no: raw.no ?? 0,
          both: raw.both ?? 0,
          nr: raw.nr ?? 0,
        };
      }
      return { date, yes: 0, no: 0, both: 0, nr: 100 };
    });
  }, [dates]);

  const [selected, setSelected] = useState<string>(fullData[0].date);
  const [weekly, setWeekly] = useState(false);
  const [heatmap, setHeatmap] = useState(false);

  const weeks = useMemo(() => {
    // group by 7-day blocks starting from the first date
    const w: { label: string; dates: string[] }[] = [];
    for (let i = 0; i < fullData.length; i += 7) {
      const block = fullData.slice(i, i + 7);
      w.push({ label: `${shortLabel(new Date(block[0].date))} – ${shortLabel(new Date(block[block.length - 1].date))}`, dates: block.map((b) => b.date) });
    }
    return w;
  }, [fullData]);

  const computeAggregates = (entries: { yes: number; no: number; both: number; nr: number }[]) => {
    const totals = { yes: 0, no: 0, both: 0, nr: 0 };
    entries.forEach((e) => {
      totals.yes += e.yes;
      totals.no += e.no;
      totals.both += e.both;
      totals.nr += e.nr;
    });
    const n = entries.length;
    return {
      yes: Math.round(totals.yes / n),
      no: Math.round(totals.no / n),
      both: Math.round(totals.both / n),
      nr: Math.round(totals.nr / n),
    };
  };

  const displayAggregates = useMemo(() => {
    if (weekly) {
      const weekIndex = weeks.findIndex((w) => w.dates.includes(selected));
      const week = weeks[weekIndex] || weeks[0];
      const entries = fullData.filter((d) => week.dates.includes(d.date)).map((d) => ({ yes: d.yes, no: d.no, both: d.both, nr: d.nr }));
      return computeAggregates(entries);
    }
    const day = fullData.find((d) => d.date === selected)!;
    return { yes: day.yes, no: day.no, both: day.both, nr: day.nr };
  }, [weekly, selected, fullData, weeks]);

  const pieData = [
    { name: "Yes", value: displayAggregates.yes, color: COLORS.yes },
    { name: "No", value: displayAggregates.no, color: COLORS.no },
    { name: "Both", value: displayAggregates.both, color: COLORS.both },
    { name: "NR", value: displayAggregates.nr, color: COLORS.nr },
  ].filter((d) => d.value > 0);

  const majorityFor = (d: { yes: number; no: number; both: number; nr: number }) => {
    const arr = [
      { k: "yes", v: d.yes },
      { k: "no", v: d.no },
      { k: "both", v: d.both },
      { k: "nr", v: d.nr },
    ];
    arr.sort((a, b) => b.v - a.v);
    return arr[0].k as keyof typeof COLORS;
  };

  return (
    <main className="min-h-[60vh]">
      <section className="container py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Data Dashboard</h1>
        <p className="mt-2 text-foreground/80 max-w-3xl">
          This dashboard shows how a law meant to guarantee menstrual equity plays out in practice. Each square represents a school on a given day — green means products were available, red means they weren’t, yellow means inconsistent, and gray means no report.
        </p>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start">
          <div className="md:w-1/2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={weekly} onChange={(e) => setWeekly(e.target.checked)} className="h-4 w-4" />
                  <span className="text-sm">Weekly averages</span>
                </label>
                <label className="flex items-center gap-2 ml-4">
                  <input type="checkbox" checked={heatmap} onChange={(e) => setHeatmap(e.target.checked)} className="h-4 w-4" />
                  <span className="text-sm">Heatmap mode</span>
                </label>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2">
              {(weekly ? weeks.map((w, idx) => ({ key: w.label, label: w.label, dates: w.dates })) : fullData.map((d) => ({ key: d.date, label: shortLabel(new Date(d.date)), dates: [d.date] }))).map((cell) => {
                // compute aggregate for the cell
                const entries = fullData.filter((f) => cell.dates.includes(f.date)).map((f) => ({ yes: f.yes, no: f.no, both: f.both, nr: f.nr }));
                const agg = computeAggregates(entries);
                const maj = majorityFor(agg);
                const isSelected = cell.dates.includes(selected);

                let bg = COLORS[maj];
                if (heatmap && maj === "no") {
                  // darker red for higher no %
                  const intensity = Math.min(1, agg.no / 100);
                  bg = `rgba(244,67,54,${0.3 + intensity * 0.7})`;
                }

                return (
                  <button
                    key={cell.key}
                    onClick={() => setSelected(cell.dates[0])}
                    className={`aspect-square rounded-md border flex items-center justify-center text-xs font-semibold text-white shadow-sm transform transition-all hover:scale-105 hover:animate-pulse ${isSelected ? "ring-4 ring-primary/40" : ""}`}
                    style={{ background: bg }}
                    title={cell.label}
                  >
                    <span className="pointer-events-none">{cell.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-foreground/70">
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-sm bg-[#4CAF50]" /> <span>Yes</span>
                <span className="inline-block h-3 w-3 rounded-sm bg-[#F44336] ml-3" /> <span>No</span>
                <span className="inline-block h-3 w-3 rounded-sm bg-[#FFC107] ml-3" /> <span>Both</span>
                <span className="inline-block h-3 w-3 rounded-sm bg-[#9E9E9E] ml-3" /> <span>NR</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="text-lg font-bold">{weekly ? "Weekly" : "Daily"} summary — {weekly ? weeks.find((w) => w.dates.includes(selected))?.label : shortLabel(new Date(selected))}</h3>

              <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2" style={{ height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" outerRadius={80} innerRadius={30}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-sm">Yes: <span className="font-semibold text-[#4CAF50]">{displayAggregates.yes}%</span></div>
                  <div className="text-sm">No: <span className="font-semibold text-[#F44336]">{displayAggregates.no}%</span></div>
                  <div className="text-sm">Both: <span className="font-semibold text-[#FFC107]">{displayAggregates.both}%</span></div>
                  <div className="text-sm">NR: <span className="font-semibold text-[#9E9E9E]">{displayAggregates.nr}%</span></div>
                </div>
              </div>

              <div className="mt-6 text-xs text-foreground/70">
                Toggle "Weekly averages" to see aggregated data by week. Hover or click dates to explore specific days.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
