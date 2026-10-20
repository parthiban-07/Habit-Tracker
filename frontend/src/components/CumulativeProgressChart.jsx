import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function CumulativeProgressChart({ tasks }) {
  // Generate hours from 8 AM to 10 PM
  const hours = Array.from({ length: 15 }, (_, i) => i + 8);
  
  const totalGoal = tasks.reduce((acc, t) => acc + (t.goalValue || 1), 0);
  
  const chartData = hours.map(hour => {
    // Calculate cumulative actual progress up to this hour
    const cumulativeActual = tasks.reduce((acc, t) => {
      if (!t.updatedAt) return acc;
      const [h] = t.updatedAt.split(':').map(Number);
      if (h <= hour) {
        return acc + (t.currentValue || 0);
      }
      return acc;
    }, 0);

    return {
      time: `${hour}:00`,
      actual: cumulativeActual,
      target: totalGoal
    };
  });

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            interval={2}
          />
          <YAxis hide domain={[0, Math.max(totalGoal * 1.1, 1)]} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
            itemStyle={{ padding: '0px' }}
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth={1} 
            strokeDasharray="5 5" 
            dot={false}
            activeDot={false}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#00f3ff" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#00f3ff', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
