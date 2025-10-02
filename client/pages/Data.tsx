import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  yes: "#4CAF50",
  no: "#F44336",
  both: "#FFC107",
  nr: "#9E9E9E",
};

// Dataset provided by user (percentages). Keys are YYYY-MM-DD
const RAW_DATA: Record<string, { yes: number; no: number; both: number; reported: number }> = {
  "2023-10-21": { yes: 1, no: 13, both: 0, reported: 14 },
  "2023-10-22": { yes: 1, no: 9, both: 1, reported: 11 },
  "2023-10-23": { yes: 0, no: 10, both: 0, reported: 10 },
  "2023-10-24": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-10-25": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-10-28": { yes: 1, no: 9, both: 0, reported: 10 },
  "2023-10-29": { yes: 0, no: 6, both: 0, reported: 6 },
  "2023-10-30": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-10-31": { yes: 1, no: 10, both: 0, reported: 11 },
  "2023-11-01": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-04": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-05": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-06": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-07": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-08": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-11": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-12": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-13": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-14": { yes: 0, no: 12, both: 0, reported: 12 },
  "2023-11-15": { yes: 0, no: 12, both: 0, reported: 12 },
};

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function shortLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Data() {
  const start = new Date(2023, 9, 21); // Oct 21, 2023
  const end = new Date(2023, 10, 15); // Nov 15, 2023

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
          yes: raw.yes,
          no: raw.no,
          both: raw.both,
          reported: raw.reported,
        };
      }
      return { date, yes: 0, no: 0, both: 0, reported: 0 };
    });
  }, [dates]);

  const [selected, setSelected] = useState<string>(fullData[0].date);
  const [heatmap, setHeatmap] = useState(false);

  const computeAggregates = (entries: { yes: number; no: number; both: number; reported: number }[]) => {
    const totals = { yes: 0, no: 0, both: 0, reported: 0 };
    entries.forEach((e) => {
      totals.yes += e.yes;
      totals.no += e.no;
      totals.both += e.both;
      totals.reported += e.reported;
    });
    return totals;
  };

  const displayAggregates = useMemo(() => {
    const day = fullData.find((d) => d.date === selected)!;
    return { yes: day.yes, no: day.no, both: day.both, reported: day.reported };
  }, [selected, fullData]);

  // build pie data excluding NR; calculate percentages so they add up to 100
  const pieData = useMemo(() => {
    const yes = displayAggregates.yes || 0;
    const no = displayAggregates.no || 0;
    const both = displayAggregates.both || 0;
    const total = yes + no + both;
    if (total === 0) return [];
    const raw = [
      { name: "Yes", value: yes, color: COLORS.yes },
      { name: "No", value: no, color: COLORS.no },
      { name: "Both", value: both, color: COLORS.both },
    ].filter((d) => d.value > 0);
    // compute percentages and ensure sum to 100
    let sum = 0;
    const withPct = raw.map((d, i) => {
      const pct = i === raw.length - 1 ? 100 - sum : Math.round((d.value / total) * 100);
      sum += pct;
      return { ...d, value: pct };
    });
    return withPct;
  }, [displayAggregates]);

  const majorityFor = (d: { yes: number; no: number; both: number }) => {
    const arr = [
      { k: "yes", v: d.yes },
      { k: "no", v: d.no },
      { k: "both", v: d.both },
    ];
    arr.sort((a, b) => b.v - a.v);
    return arr[0].k as keyof typeof COLORS;
  };

  return (
    <main className="min-h-[60vh]">
      <section className="container py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Data Dashboard</h1>
        <p className="mt-2 text-foreground/80 max-w-3xl">
          This dashboard shows how a law meant to guarantee menstrual equity plays out in practice. Each square represents a day of data collection of High Schools across the San Diego school district. green means products were available, red means they weren’t, and yellow means inconsistent.
        </p>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start">
          <div className="md:w-1/2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={heatmap} onChange={(e) => setHeatmap(e.target.checked)} className="h-4 w-4" />
                  <span className="text-sm">Heatmap mode</span>
                </label>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2">
              {fullData.map((d) => ({ key: d.date, label: shortLabel(new Date(d.date)), dates: [d.date] })).map((cell) => {
                // compute aggregate for the cell
                const entries = fullData.filter((f) => cell.dates.includes(f.date)).map((f) => ({ yes: f.yes, no: f.no, both: f.both, reported: f.reported }));
                const agg = computeAggregates(entries);
                const maj = majorityFor(agg);
                const isSelected = cell.dates.includes(selected);

                // calendar color: make dates that would be green show as gray
                let bg = maj === "yes" ? COLORS.nr : COLORS[maj];
                if (heatmap && maj === "no") {
                  // darker red for higher no proportion
                  const intensity = agg.reported ? Math.min(1, agg.no / agg.reported) : 0;
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
                      <Pie data={pieData} dataKey="value" outerRadius={80} innerRadius={40}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-2">
                  {(() => {
                    const total = displayAggregates.reported || 0;
                    if (total === 0) {
                      return <div className="text-sm">No schools reported on this date.</div>;
                    }
                    const yes = displayAggregates.yes || 0;
                    const no = displayAggregates.no || 0;
                    const both = displayAggregates.both || 0;
                    // compute percentages, ensure sum to 100
                    const parts = [
                      { k: 'yes', v: yes, color: COLORS.yes },
                      { k: 'no', v: no, color: COLORS.no },
                      { k: 'both', v: both, color: COLORS.both },
                    ].filter(p => p.v > 0);
                    let acc = 0;
                    const withPct = parts.map((p, i) => {
                      const pct = i === parts.length - 1 ? 100 - acc : Math.round((p.v / total) * 100);
                      acc += pct;
                      return { ...p, pct };
                    });

                    return (
                      <>
                        {withPct.map((p) => (
                          <div key={p.k} className="text-sm">
                            {p.k === 'yes' ? 'Yes' : p.k === 'no' ? 'No' : 'Both'}: <span className="font-semibold" style={{ color: p.color }}>{p.pct}%</span>
                          </div>
                        ))}
                        <div className="mt-3 text-sm text-foreground/70">{total} schools reported on this date.</div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="mt-6 text-xs text-foreground/70">Hover or click dates to explore specific days.</div>
            </div>
          </div>
        </div>

        <section className="container py-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold">Conclusion</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              We collected data from every high school in the district through daily student reports. On average, more than half of schools participated each day, and over the course of the study period we captured input from every school at least once. While this dataset is not perfect and reflects the limitations of voluntary reporting, the results show a consistent trend: schools still have significant work to do in meeting the state mandate for menstrual product availability. Patterns also emerged when comparing access across communities, schools with higher proportions of minority students were less likely to report available products, while schools in higher-income areas showed somewhat greater access. These disparities highlight how inequities in implementation persist, even when a policy promises universal access.
            </p>
          </div>
        </section>

      </section>
    </main>
  );
}
