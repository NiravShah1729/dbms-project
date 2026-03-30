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
    if (count === 0) return 'bg-muted/50';
    if (count <= 2) return 'bg-green-900/40';
    if (count <= 5) return 'bg-green-700/60';
    if (count <= 10) return 'bg-green-500/80';
    return 'bg-green-400';
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Practice Heatmap (Last 30 Days)</h3>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const entry = data.find((d) => d.submission_date.startsWith(day));
          const count = entry ? entry.count : 0;
          return (
            <div
              key={day}
              title={`${day}: ${count} submissions`}
              className={`h-4 w-4 rounded-sm transition-transform hover:scale-125 cursor-help ${getIntensity(count)}`}
            />
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground uppercase">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-muted/50" />
          <div className="h-3 w-3 rounded-sm bg-green-900/40" />
          <div className="h-3 w-3 rounded-sm bg-green-700/60" />
          <div className="h-3 w-3 rounded-sm bg-green-500/80" />
          <div className="h-3 w-3 rounded-sm bg-green-400" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
