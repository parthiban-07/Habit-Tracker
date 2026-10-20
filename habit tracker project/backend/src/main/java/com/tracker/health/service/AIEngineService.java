package com.tracker.health.service;

import com.tracker.health.model.DailyTask;
import com.tracker.health.model.UserHistory;
import com.tracker.health.repository.UserHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AIEngineService {

    private final UserHistoryRepository historyRepository;

    public AIEngineService(UserHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public UserHistory evaluateDay(List<DailyTask> tasks, LocalDate date) {
        if (tasks == null || tasks.isEmpty()) {
             return saveOrUpdateHistory(date, 0.0, "No tasks logged today. Take a break or plan something small!", 
                     "- Set up 1 minor goal for tomorrow.\n- Ensure you log your tracking early.");
        }

        double totalScore = 0;
        int completedCount = 0;
        StringBuilder missedGoals = new StringBuilder();
        StringBuilder achievedGoals = new StringBuilder();

        for (DailyTask t : tasks) {
            double progress = 0;
            if (t.getGoalValue() != null && t.getGoalValue() > 0) {
                progress = Math.min(100.0, (t.getCurrentValue() != null ? t.getCurrentValue() : 0.0) / t.getGoalValue() * 100);
            } else if ("BOOLEAN".equalsIgnoreCase(t.getType())) {
                progress = (t.getCurrentValue() != null && t.getCurrentValue() > 0) ? 100.0 : 0.0;
            }
            
            totalScore += progress;
            if (progress >= 100.0) {
                completedCount++;
                achievedGoals.append("- ").append(t.getTitle()).append(" \n");
            } else {
                missedGoals.append("- ").append(t.getTitle()).append(" (Reached ").append(String.format("%.1f%%", progress)).append(") \n");
            }
        }

        double averageScore = totalScore / tasks.size();
        
        String remarks = generateRemarks(averageScore, completedCount, tasks.size(), achievedGoals.toString(), missedGoals.toString());
        String blueprint = generateBlueprint(missedGoals.toString(), averageScore);

        return saveOrUpdateHistory(date, averageScore, remarks, blueprint);
    }

    private String generateRemarks(double score, int completed, int total, String achieved, String missed) {
        if (score == 100.0) {
            return "Flawless day! Consistency is key! You hit 100% of your targets. Outstanding work.";
        } else if (score >= 70.0) {
            return String.format("Solid effort today. You nailed %d out of %d tasks. Keep up the momentum, but pay attention to the ones you missed.", completed, total);
        } else if (score >= 40.0) {
            return String.format("A decent start, but there's room for improvement. You completed %d out of %d goals. Let's regain focus tomorrow.", completed, total);
        } else {
            return "Today was tough, but progress isn't linear. Take a deep breath and recalibrate for tomorrow.";
        }
    }

    private String generateBlueprint(String missed, double score) {
        StringBuilder bp = new StringBuilder();
        bp.append("Tomorrow's Blueprint:\n");
        if (score == 100.0) {
            bp.append("1. Maintain current habits.\n2. Consider raising a metric slightly (e.g., +5m Gym).\n3. Ensure good recovery and sleep.");
        } else {
            bp.append("1. Prioritize missed tasks first thing in the morning.\n");
            if (!missed.isEmpty()) {
                bp.append("2. Look deeply at these missed goals:\n").append(missed);
            } else {
                bp.append("2. Review your goals to ensure they're realistic.\n");
            }
            bp.append("3. Break down tasks into 5-minute initial steps.");
        }
        return bp.toString();
    }

    public Optional<UserHistory> getHistory(LocalDate date) {
        return historyRepository.findByDate(date);
    }

    private UserHistory saveOrUpdateHistory(LocalDate date, double score, String remarks, String blueprint) {
        Optional<UserHistory> existing = historyRepository.findByDate(date);
        UserHistory hist = existing.orElseGet(UserHistory::new);
        hist.setDate(date);
        hist.setDailyScore(score);
        hist.setRemarks(remarks);
        hist.setBlueprint(blueprint);
        return historyRepository.save(hist);
    }
}
