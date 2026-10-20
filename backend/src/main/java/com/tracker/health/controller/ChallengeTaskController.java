package com.tracker.health.controller;

import com.tracker.health.model.ChallengeDailyTask;
import com.tracker.health.model.ChallengeTask;
import com.tracker.health.repository.ChallengeDailyTaskRepository;
import com.tracker.health.repository.ChallengeTaskRepository;
import com.tracker.health.service.ChallengeGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeTaskController {

    @Autowired
    private ChallengeTaskRepository challengeTaskRepository;

    @Autowired
    private ChallengeDailyTaskRepository dailyTaskRepository;

    @Autowired
    private ChallengeGeneratorService generatorService;

    @GetMapping
    public List<ChallengeTask> getAllChallenges() {
        List<ChallengeTask> challenges = challengeTaskRepository.findAll();
        for (ChallengeTask challenge : challenges) {
            List<ChallengeDailyTask> tasks = dailyTaskRepository.findByChallengeId(challenge.getId());
            Map<Integer, List<ChallengeDailyTask>> tasksByDay = tasks.stream()
                    .collect(Collectors.groupingBy(ChallengeDailyTask::getDayNumber));
            challenge.setDailyTasks(tasksByDay);

            // Dynamically calculate completed days based on whether all tasks for that day are completed
            Set<Integer> completedDays = tasksByDay.entrySet().stream()
                    .filter(entry -> entry.getValue().stream().allMatch(ChallengeDailyTask::isCompleted))
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toSet());
            challenge.setCompletedDays(completedDays);
        }
        return challenges;
    }

    @PostMapping
    public ChallengeTask createChallenge(@RequestBody ChallengeTask challenge) {
        if (challenge.getTotalDays() == null) {
            challenge.setTotalDays(21);
        }
        if (challenge.getStartDate() == null) {
            challenge.setStartDate(java.time.LocalDate.now());
        }
        ChallengeTask saved = challengeTaskRepository.save(challenge);
        generatorService.generateTasksForChallenge(saved);
        return saved;
    }

    @PutMapping("/{id}/day/{day}")
    public ResponseEntity<ChallengeTask> toggleDay(@PathVariable Long id, @PathVariable Integer day) {
        Optional<ChallengeTask> optionalChallenge = challengeTaskRepository.findById(id);
        if (optionalChallenge.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        ChallengeTask challenge = optionalChallenge.get();
        Set<Integer> completedDays = challenge.getCompletedDays();
        
        if (completedDays.contains(day)) {
            completedDays.remove(day);
        } else {
            completedDays.add(day);
        }
        
        challenge.setCompletedDays(completedDays);
        return ResponseEntity.ok(challengeTaskRepository.save(challenge));
    }

    @PutMapping("/{id}/tasks/{taskId}/toggle")
    public ResponseEntity<ChallengeDailyTask> toggleTask(@PathVariable Long id, @PathVariable Long taskId) {
        Optional<ChallengeDailyTask> optionalTask = dailyTaskRepository.findById(taskId);
        if (optionalTask.isEmpty() || !optionalTask.get().getChallengeId().equals(id)) {
            return ResponseEntity.notFound().build();
        }
        ChallengeDailyTask task = optionalTask.get();
        task.setCompleted(!task.isCompleted());
        return ResponseEntity.ok(dailyTaskRepository.save(task));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteChallenge(@PathVariable Long id) {
        if (!challengeTaskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dailyTaskRepository.deleteByChallengeId(id);
        challengeTaskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
