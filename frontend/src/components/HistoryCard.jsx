import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import { CumulativeProgressChart } from './CumulativeProgressChart';

export function HistoryCard({ date, tasks, aiData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalGoal = tasks.reduce((acc, t) => acc + (t.goalValue || 1), 0);
  const totalActual = tasks.reduce((acc, t) => acc + (t.currentValue || 0), 0);
  
  // Use AI score if available, otherwise calculate
  const percentage = aiData ? Math.round(aiData.dailyScore) : (totalGoal > 0 ? Math.round((totalActual / totalGoal) * 100) : 0);

  return (
    <div 
      className="glass-panel p-6 h-full flex flex-col overflow-hidden transition-all duration-300 relative group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Percentage Headline */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Yesterday's Efficiency</p>
          <h2 className="text-5xl font-bold text-neon-cyan mb-2 leading-tight">
            {percentage}% <span className="text-lg font-normal text-white/40">Success</span>
          </h2>
          {aiData?.remarks && (
            <p className="text-white/60 text-sm italic line-clamp-1 max-w-md">"{aiData.remarks}"</p>
          )}
        </div>
        <div className="bg-neon-cyan/10 p-3 rounded-2xl text-neon-cyan">
          <Calendar size={24} />
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <CumulativeProgressChart tasks={tasks} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-white/20 text-xs font-semibold">
        <span>{isExpanded ? 'Click to collapse' : 'Click to review tasks'}</span>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown size={14} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/40 -mx-6 px-6 -mb-6 mt-6 pt-6 pb-6 border-t border-white/5"
          >
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <h4 className="text-xs font-bold text-white/40 uppercase mb-4 tracking-widest">Process Review</h4>
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  {(task.currentValue >= (task.goalValue || 1)) ? (
                    <CheckCircle2 size={16} className="text-neon-cyan shrink-0" />
                  ) : (
                    <Circle size={16} className="text-white/20 shrink-0" />
                  )}
                  <div className="flex-1 text-sm font-medium">{task.title}</div>
                  <div className="text-xs text-white/40">
                    {task.currentValue}/{task.goalValue}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-sm text-white/40 py-4 text-center italic">No tasks recorded for this day.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
