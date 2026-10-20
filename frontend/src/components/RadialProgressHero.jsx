import { motion } from 'framer-motion';

export function RadialProgressHero({ data }) {
  // Compute overall progress
  let totalScore = 0;
  const count = data.length;

  data.forEach((task) => {
    let progress = 0;
    if (task.goalValue > 0) {
      progress = Math.min(100, (task.currentValue || 0) / task.goalValue * 100);
    } else if (task.type === "BOOLEAN") {
      progress = (task.currentValue > 0) ? 100 : 0;
    }
    totalScore += progress;
  });

  const average = count === 0 ? 0 : Math.round(totalScore / count);
  const circleCircumference = 2 * Math.PI * 120;
  const strokeDashoffset = circleCircumference - (average / 100) * circleCircumference;

  return (
    <div className="glass-panel p-8 flex flex-col items-center justify-center relative overflow-hidden h-full">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-neon-cyan">Daily</span> Completion
      </h2>
      <div className="relative flex items-center justify-center w-[260px] h-[260px]">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="130"
            cy="130"
            r="120"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="16"
            fill="none"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="130"
            cy="130"
            r="120"
            stroke="var(--color-neon-cyan)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circleCircumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              strokeDasharray: circleCircumference,
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            className="text-6xl font-bold tracking-tighter"
            key={average}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {average}%
          </motion.span>
          <span className="text-white/50 text-sm mt-1 uppercase tracking-widest">Achieved</span>
        </div>
      </div>
    </div>
  );
}
