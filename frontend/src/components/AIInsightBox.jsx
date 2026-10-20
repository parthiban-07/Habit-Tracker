import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIInsightBox({ date }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const res = await fetch(`http://localhost:8080/api/insights/generate?date=${formattedDate}`, {
        method: 'POST'
      });
      const data = await res.json();
      setInsight(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-indigo to-neon-violet"></div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="text-neon-violet" size={20} /> AI Insights
        </h3>
        <button 
          onClick={generateInsight}
          disabled={loading}
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          {loading ? 'Reflecting...' : 'Analyze Day'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mt-2">
        <AnimatePresence mode="wait">
          {!insight && !loading && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-white/40 text-center px-4"
            >
              <Sparkles size={32} className="mb-3 opacity-20" />
              <p>Close out your day and request your AI review to get actionable feedback.</p>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="w-6 h-6 border-2 border-neon-violet border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-neon-violet">Reading your metrics...</p>
            </motion.div>
          )}

          {insight && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-2 font-semibold">Today's Verdict ({Math.round(insight.dailyScore)}%)</p>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-sm leading-relaxed">
                  {insight.remarks}
                </div>
              </div>

              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-2 font-semibold flex items-center gap-1">
                  Tomorrow <ArrowRight size={12} />
                </p>
                <div className="bg-neon-indigo/10 p-4 rounded-2xl border border-neon-indigo/20 text-sm leading-relaxed whitespace-pre-wrap text-neon-cyan/90">
                  {insight.blueprint}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
