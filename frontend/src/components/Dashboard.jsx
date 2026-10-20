import { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { TasksList } from './TasksList';
import { RadialProgressHero } from './RadialProgressHero';
import { TargetVsActualCharts } from './TargetVsActualCharts';
import { AIInsightBox } from './AIInsightBox';
import { HistoryCard } from './HistoryCard';
import { ImprovementChallenge } from './ImprovementChallenge';
import { WeeklyPlanner } from './WeeklyPlanner';

export function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [historyTasks, setHistoryTasks] = useState([]);
  const [historyInsight, setHistoryInsight] = useState(null);
  const { data: tasks, refetch } = useWebSocket('ws://localhost:8080/ws-health', '/topic/tasks');

  useEffect(() => {
    const fetchHistory = async () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      try {
        const [tasksRes, insightRes] = await Promise.all([
          fetch(`http://localhost:8080/api/tasks/history?date=${yesterday}`),
          fetch(`http://localhost:8080/api/insights?date=${yesterday}`)
        ]);
        
        const tasksData = await tasksRes.json();
        setHistoryTasks(tasksData);
        
        if (insightRes.status === 200) {
          const insightData = await insightRes.json();
          setHistoryInsight(insightData);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  const onAdd = async (taskData) => {
    try {
      // Ensure the date is sent correctly from the frontend to avoid timezone mismatches
      const payload = {
        ...taskData,
        date: new Date().toISOString().split('T')[0] 
      };
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        refetch(); // Immediate manual UI refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onUpdate = async (id, value) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${id}/progress?value=${value}`, {
        method: 'PUT'
      });
      if (response.ok) {
        refetch(); // Immediate manual UI refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        refetch(); // Immediate manual UI refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 relative neon-mesh">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[100px] z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col pt-4">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Health Architect</h1>
            <p className="text-white/50 text-sm">Design your life, one metric at a time.</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-neon-cyan">{date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
        </header>

        {/* Bento Grid layout - Adjusted for history */}
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-min gap-6">
          
          {/* Radial Hero - Row 1 Left */}
          <div className="md:col-span-4 min-h-[500px]">
            <RadialProgressHero data={tasks} />
          </div>

          {/* Tasks List - Row 1 Center */}
          <div className="md:col-span-4 min-h-[500px]">
            <TasksList tasks={tasks} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
          </div>

          {/* Right Column with two panels */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="min-h-[250px]">
              <TargetVsActualCharts data={tasks} />
            </div>
            <div className="min-h-[250px]">
              <AIInsightBox date={date} />
            </div>
          </div>

          {/* Challenge / Improvement Panel - Full Row 2 */}
          <div className="md:col-span-12">
            <ImprovementChallenge />
          </div>

          {/* Weekly Planner Panel - Full Row 3 */}
          <div className="md:col-span-12">
            <WeeklyPlanner />
          </div>

          {/* History Panel - Full Row 4 */}
          <div className="md:col-span-12">
            <HistoryCard tasks={historyTasks} date={new Date(Date.now() - 86400000)} aiData={historyInsight} />
          </div>

        </div>
      </div>
    </div>
  );
}
