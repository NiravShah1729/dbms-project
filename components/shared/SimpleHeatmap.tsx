'use client';

interface HeatmapProps {
  data: { submission_date: string; count: number }[];
}

export default function SimpleHeatmap({ data }: HeatmapProps) {
  // Simplification: Showing last 30 days
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-slate-200'; // Accurate grey-300 feel
    if (count <= 2) return 'bg-emerald-200';
    if (count <= 5) return 'bg-emerald-400';
    if (count <= 10) return 'bg-emerald-600';
    return 'bg-emerald-800';
  };

  return (
    <div className="rounded-[2rem] border bg-card/50 backdrop-blur-xl p-8 shadow-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">Practice Intensity</h3>
        <div className="text-[10px] font-black text-indigo-600 bg-indigo-600/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
          Last 30 Days
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2.5">
        {days.map((day) => {
          const entry = data.find((d) => d.submission_date.startsWith(day));
          const count = entry ? (typeof entry.count === 'string' ? parseInt(entry.count) : entry.count) : 0;
          return (
            <div
              key={day}
              className={`h-4.5 w-4.5 rounded-sm transition-all hover:scale-125 cursor-help ${getIntensity(count)} shadow-sm hover:ring-2 hover:ring-indigo-500/20`}
              title={`${new Date(day).toLocaleDateString()}: ${count} submissions`}
            />
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
          <span>Less</span>
          <div className="flex gap-1 mx-1">
            <div className="h-2.5 w-2.5 rounded-sm bg-slate-200" />
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-200" />
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-800" />
          </div>
          <span>More</span>
        </div>
        <div className="text-[9px] font-bold text-muted-foreground italic">
          Consistent practice builds mastery.
        </div>
      </div>
    </div>
  );
}

