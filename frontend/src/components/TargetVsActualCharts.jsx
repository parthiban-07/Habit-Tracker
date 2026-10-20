import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function TargetVsActualCharts({ data }) {
  const numericTasks = data.filter(t => t.type === 'NUMERIC');

  if (numericTasks.length === 0) {
    return (
      <div className="glass-panel p-6 flex items-center justify-center h-full min-h-[300px]">
        <p className="text-white/50">Add numeric tasks to see charts</p>
      </div>
    );
  }

  // Transform data for recharts
  const chartData = numericTasks.map(t => ({
    name: t.title,
    actual: t.currentValue || 0,
    target: t.goalValue || 1,
    progress: Math.min(100, ((t.currentValue || 0) / (t.goalValue || 1)) * 100)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg text-sm">
          <p className="font-semibold text-white mb-1">{label}</p>
          <p className="text-neon-cyan">Actual: {payload[0].value}</p>
          <p className="text-white/60">Target: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-6">Metrics <span className="text-white/50 font-normal">Target vs Actual</span></h3>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} width={80} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Bar dataKey="actual" fill="var(--color-neon-indigo)" radius={[0, 4, 4, 0]} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.progress >= 100 ? 'var(--color-neon-cyan)' : 'var(--color-neon-indigo)'} />
              ))}
            </Bar>
            <Bar dataKey="target" fill="rgba(255,255,255,0.2)" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
