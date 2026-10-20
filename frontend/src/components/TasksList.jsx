import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, Repeat } from 'lucide-react';

export function TasksList({ tasks, onAdd, onUpdate, onDelete }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState('BOOLEAN');
  const [newTaskGoal, setNewTaskGoal] = useState('');
  const [isRecurring, setIsRecurring] = useState(true);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    onAdd({
      title: newTaskTitle,
      type: newTaskType,
      goalValue: newTaskType === 'NUMERIC' ? parseFloat(newTaskGoal) : 0,
      recurring: isRecurring
    });
    setNewTaskTitle('');
    setNewTaskGoal('');
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full max-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Today's Tasks</h3>
        <span className="text-[10px] uppercase tracking-wider text-white/30 bg-white/5 px-2 py-1 rounded-full px-2">Live Sync</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 custom-scrollbar">
        {tasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{task.title}</p>
                {task.recurring && <Repeat size={10} className="text-neon-cyan opacity-40" />}
              </div>
              {task.type === 'NUMERIC' && (
                <div className="flex items-center gap-3 mt-2">
                  <input 
                    type="range" 
                    min="0" 
                    max={task.goalValue} 
                    value={task.currentValue || 0}
                    onChange={(e) => onUpdate(task.id, parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                  />
                  <span className="text-xs text-white/50 w-12 text-right">
                    {Math.round(task.currentValue || 0)}/{task.goalValue}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 ml-4">
              {task.type === 'BOOLEAN' && (
                <button
                  onClick={() => onUpdate(task.id, task.currentValue > 0 ? 0 : 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    task.currentValue > 0 ? 'bg-neon-cyan text-black' : 'bg-white/10 text-white/30 hover:bg-white/20'
                  }`}
                >
                  <Check size={16} />
                </button>
              )}
              <button 
                onClick={() => onDelete(task.id)}
                className="text-white/50 hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <p className="text-white/40 text-sm text-center mt-10">No tasks for today. Add one below!</p>
        )}
      </div>

      <div className="space-y-2 mt-auto">
        <form onSubmit={handleAdd} className="bg-black/40 p-1 rounded-2xl border border-white/5 flex gap-2">
          <input 
            type="text"
            placeholder="New task..."
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            className="bg-transparent border-none outline-none px-4 py-2 w-full text-sm placeholder:text-white/30"
          />
          {newTaskTitle && (
            <div className="flex items-center gap-1 bg-zinc-800 rounded-xl px-2">
              <select 
                value={newTaskType} 
                onChange={e => setNewTaskType(e.target.value)}
                className="bg-transparent text-[10px] border-none outline-none py-1"
              >
                <option value="BOOLEAN">Check</option>
                <option value="NUMERIC">Limit</option>
              </select>
              <button
                type="button"
                onClick={() => setIsRecurring(!isRecurring)}
                className={`p-1 rounded-md transition-colors ${isRecurring ? 'text-neon-cyan' : 'text-white/20'}`}
                title={isRecurring ? "Daily Habit" : "One-off Task"}
              >
                <Repeat size={12} />
              </button>
            </div>
          )}
          {newTaskType === 'NUMERIC' && newTaskTitle && (
            <input 
              type="number"
              placeholder="Goal"
              value={newTaskGoal}
              onChange={e => setNewTaskGoal(e.target.value)}
              className="bg-zinc-800 text-xs rounded-xl px-2 w-16 border-none outline-none"
            />
          )}
          <button type="submit" className="bg-neon-violet hover:bg-neon-violet/80 text-white p-2 rounded-xl transition-colors shrink-0">
            <Plus size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
