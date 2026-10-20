package com.tracker.health.service;

import com.tracker.health.model.ChallengeDailyTask;
import com.tracker.health.model.ChallengeTask;
import com.tracker.health.repository.ChallengeDailyTaskRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ChallengeGeneratorService {

    private final ChallengeDailyTaskRepository dailyTaskRepository;

    public ChallengeGeneratorService(ChallengeDailyTaskRepository dailyTaskRepository) {
        this.dailyTaskRepository = dailyTaskRepository;
    }

    public void generateTasksForChallenge(ChallengeTask challenge) {
        List<String> defaultTasks = getTasksForTitle(challenge.getTitle(), challenge.getRoutines());
        List<ChallengeDailyTask> allTasks = new ArrayList<>();

        int totalDays = challenge.getTotalDays() != null ? challenge.getTotalDays() : 21;

        for (int i = 1; i <= totalDays; i++) {
            for (String taskName : defaultTasks) {
                if (taskName != null && !taskName.trim().isEmpty()) {
                    allTasks.add(new ChallengeDailyTask(challenge.getId(), i, taskName.trim()));
                }
            }
        }

        dailyTaskRepository.saveAll(allTasks);
    }

    private List<String> getTasksForTitle(String title, String routines) {
        if (routines != null && !routines.trim().isEmpty()) {
            return Arrays.asList(routines.split("[,\n]"));
        }

        if (title == null) return List.of("Complete daily habit");
        
        String lowerTitle = title.toLowerCase();

        if (lowerTitle.contains("75 hard")) {
            return Arrays.asList(
                    "Workout 1 (45 min)",
                    "Workout 2 (45 min, outdoors)",
                    "Drink 1 gallon of water",
                    "Read 10 pages of non-fiction",
                    "Follow diet (No cheat meals, no alcohol)",
                    "Take a progress picture"
            );
        } else if (lowerTitle.contains("code") || lowerTitle.contains("coding")) {
            return Arrays.asList(
                    "Write code for 1 hour",
                    "Read documentation or article",
                    "Push to GitHub"
            );
        } else if (lowerTitle.contains("fit") || lowerTitle.contains("workout")) {
            return Arrays.asList(
                    "Workout for 45 minutes",
                    "Stretch for 10 minutes",
                    "Eat healthy protein-rich meal"
            );
        } else if (lowerTitle.contains("read")) {
            return Arrays.asList(
                    "Read 20 pages",
                    "Write summary/notes of reading"
            );
        }

        return List.of("Complete daily goal", "Reflect on progress");
    }
}
