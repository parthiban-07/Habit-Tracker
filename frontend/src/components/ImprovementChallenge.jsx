import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ImprovementChallenge() {
  const [challenges, setChallenges] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRoutines, setNewRoutines] = useState('');
  const [newTotalDays, setNewTotalDays] = useState(21);
  const [expandedDay, setExpandedDay] = useState(null);

  const fetchChallenges = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch('http://localhost:8080/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          routines: newRoutines,
          totalDays: newTotalDays
        })
      });
      if (res.ok) {
        setNewTitle('');
        setNewRoutines('');
        setNewTotalDays(21);
        setIsCreating(false);
        fetchChallenges();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (challengeId, taskId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/challenges/${challengeId}/tasks/${taskId}/toggle`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchChallenges();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/challenges/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchChallenges();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 z-10 w-full">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Improvement Challenges</h3>
          <p className="text-white/50 text-xs">Track long-term habits & routines</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-xs font-semibold px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl hover:bg-neon-cyan/30 transition-colors"
        >
          {isCreating ? 'Cancel' : '+ New Challenge'}
        </button>
      </div>

      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 z-10"
        >
          <input
            type="text"
            placeholder="Challenge Title (e.g. 75 Hard, 21 Days of Code)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white mb-3 placeholder-white/30 focus:outline-none focus:border-neon-cyan/50"
          />
          <textarea
            placeholder="Routines (e.g. Read 10 pages, Workout, No sugar)"
            value={newRoutines}
            onChange={(e) => setNewRoutines(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white mb-3 placeholder-white/30 focus:outline-none focus:border-neon-cyan/50 min-h-[60px]"
          />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-white/70">Duration (Days):</span>
            <input
              type="number"
              min="1"
              max="365"
              value={newTotalDays}
              onChange={(e) => setNewTotalDays(parseInt(e.target.value) || 21)}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-20 focus:outline-none focus:border-neon-cyan/50"
            />
          </div>
          <button
            onClick={handleCreate}
            className="w-full font-medium py-2 bg-neon-cyan text-black rounded-lg hover:bg-[#00e5ff] transition-all"
          >
            Create Challenge
          </button>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar z-10 space-y-6">
        {challenges.length === 0 && !isCreating ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 pt-10">
            <span className="text-4xl mb-3">🏔️</span>
            <p className="text-sm">No active challenges.</p>
            <p className="text-xs mt-1">Start a new improvement task to track.</p>
          </div>
        ) : (
          challenges.map((challenge) => {
            const completedCount = challenge.completedDays ? challenge.completedDays.length : 0;
            const progressPercentage = Math.round((completedCount / challenge.totalDays) * 100) || 0;
            
            // Generate grid array
            const daysGrid = Array.from({ length: challenge.totalDays }, (_, i) => i + 1);

            return (
              <div key={challenge.id} className="relative p-4 rounded-2xl bg-white/5 border border-white/10 group">
                <button 
                  onClick={() => handleDelete(challenge.id)}
                  className="absolute top-4 right-4 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete challenge"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
                
                <div className="mb-4 pr-6">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-lg text-white">{challenge.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/20">
                      {progressPercentage}%
                    </span>
                  </div>
                  {challenge.routines && (
                    <p className="text-xs text-white/60 mb-3 whitespace-pre-line bg-black/20 p-2 rounded-lg border border-white/5">{challenge.routines}</p>
                  )}
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-neon-cyan rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-7 lg:grid-cols-10 gap-1.5 mt-2">
                  {daysGrid.map((day) => {
                    const isCompleted = challenge.completedDays?.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => setExpandedDay(expandedDay?.challengeId === challenge.id && expandedDay?.day === day ? null : {challengeId: challenge.id, day})}
                        className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-all duration-300
                          ${isCompleted 
                            ? 'bg-neon-cyan text-black shadow-[0_0_10px_rgba(0,255,255,0.4)] border border-neon-cyan/50' 
                            : expandedDay?.challengeId === challenge.id && expandedDay?.day === day
                              ? 'bg-white/10 text-white border-white/50'
                              : 'bg-black/40 text-white/40 border border-white/10 hover:border-white/30 hover:bg-white/5'
                          }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {expandedDay?.challengeId === challenge.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-sm font-semibold text-neon-cyan">Day {expandedDay.day} Tasks</h5>
                        <button onClick={() => setExpandedDay(null)} className="text-white/40 hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div className="space-y-3">
                      {challenge.dailyTasks && challenge.dailyTasks[expandedDay.day] ? (
                        challenge.dailyTasks[expandedDay.day].map(task => (
                          <label key={task.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 flex-shrink-0
                              ${task.completed ? 'bg-neon-cyan border-neon-cyan shadow-[0_0_8px_rgba(0,255,255,0.3)]' : 'border-white/20 group-hover:border-white/40 bg-black/50'}`}>
                              {task.completed && <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`text-sm transition-colors duration-300 ${task.completed ? 'text-white/40 line-through' : 'text-white/80 group-hover:text-white'}`}>
                              {task.taskName}
                            </span>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={task.completed} 
                              onChange={() => toggleTask(challenge.id, task.id)} 
                            />
                          </label>
                        ))
                      ) : (
                          <p className="text-xs text-white/40 italic">No tasks assigned for this day.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
