import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DAYS_OF_WEEK = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

export function WeeklyPlanner() {
  const [routines, setRoutines] = useState([]);
  const [newTasks, setNewTasks] = useState({
    MONDAY: '', TUESDAY: '', WEDNESDAY: '', THURSDAY: '', FRIDAY: '', SATURDAY: '', SUNDAY: ''
  });

  const fetchRoutines = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/weekly');
      if (res.ok) {
        const data = await res.json();
        setRoutines(data);
      }
    } catch (err) {
      console.error("Error fetching weekly routines:", err);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleAddTask = async (day) => {
    const taskName = newTasks[day];
    if (!taskName || !taskName.trim()) return;

    try {
      const res = await fetch('http://localhost:8080/api/weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: day,
          taskName: taskName.trim()
        })
      });
      if (res.ok) {
        setNewTasks({ ...newTasks, [day]: '' });
        fetchRoutines();
      }
    } catch (err) {
      console.error("Error adding weekly routine:", err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/weekly/${id}/toggle`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchRoutines();
      }
    } catch (err) {
      console.error("Error toggling weekly routine:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/weekly/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchRoutines();
      }
    } catch (err) {
      console.error("Error deleting weekly routine:", err);
    }
  };

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl w-full relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mt-32 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Weekly Blueprint</h3>
          <p className="text-white/50 text-xs">Schedule tasks on specific days of the week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 relative z-10">
        {DAYS_OF_WEEK.map((day) => {
          const dayRoutines = routines.filter(r => r.dayOfWeek === day);
          const isToday = day === currentDay;

          return (
            <div key={day} className={`flex flex-col bg-black/40 rounded-2xl border ${isToday ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.1)]' : 'border-white/5'} overflow-hidden min-h-[250px]`}>
              <div className={`text-center py-3 text-xs font-bold tracking-widest ${isToday ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-white/60'}`}>
                {day.substring(0, 3)}
              </div>
              
              <div className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
                {dayRoutines.length === 0 && (
                  <p className="text-[10px] text-white/30 text-center italic mt-2">No tasks set</p>
                )}
                {dayRoutines.map((routine) => (
                  <motion.div 
                    key={routine.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <button 
                      onClick={() => toggleTask(routine.id)}
                      className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all
                        ${routine.completed ? 'bg-neon-cyan border-neon-cyan' : 'border-white/20 hover:border-white/40'}`}
                    >
                      {routine.completed && <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <span className={`text-[11px] leading-tight flex-1 ${routine.completed ? 'text-white/40 line-through' : 'text-white/90'}`}>
                      {routine.taskName}
                    </span>
                    <button 
                      onClick={() => deleteTask(routine.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-opacity flex-shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="p-2 bg-white/5 border-t border-white/5">
                <input
                  type="text"
                  placeholder="Add..."
                  value={newTasks[day]}
                  onChange={(e) => setNewTasks({ ...newTasks, [day]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask(day)}
                  className="w-full bg-black/50 border border-white/10 rounded-md px-2 py-1.5 text-[11px] text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
