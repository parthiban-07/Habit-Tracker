package com.tracker.health.service;

import com.tracker.health.model.DailyTask;
import com.tracker.health.repository.DailyTaskRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final DailyTaskRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public TaskService(DailyTaskRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<DailyTask> getTasksForDate(LocalDate date) {
        List<DailyTask> tasks = repository.findByDate(date);

        // Auto-clone logic for today
        if (tasks.isEmpty() && date.equals(LocalDate.now())) {
            DailyTask lastActiveTask = repository.findFirstByOrderByDateDesc();
            if (lastActiveTask != null) {
                LocalDate lastDate = lastActiveTask.getDate();
                if (!lastDate.equals(date)) {
                    List<DailyTask> recurringTasks = repository.findByDateAndRecurring(lastDate, true);
                    for (DailyTask rt : recurringTasks) {
                        DailyTask clone = new DailyTask();
                        clone.setTitle(rt.getTitle());
                        clone.setType(rt.getType());
                        clone.setGoalValue(rt.getGoalValue());
                        clone.setCurrentValue(0.0);
                        clone.setRecurring(true);
                        clone.setDate(date);
                        repository.save(clone);
                    }
                    // Re-fetch now that we've cloned
                    tasks = repository.findByDate(date);
                }
            }
        }
        return tasks;
    }

    public List<DailyTask> getTasksForDateRange(LocalDate start, LocalDate end) {
        return repository.findByDateBetween(start, end);
    }

    @Transactional
    public DailyTask saveTask(DailyTask task) {
        if (task.getDate() == null) {
            task.setDate(LocalDate.now());
        }
        if (task.getCurrentValue() == null) {
            task.setCurrentValue(0.0);
        } else if (task.getCurrentValue() > 0) {
            task.setUpdatedAt(java.time.LocalTime.now());
        }
        DailyTask saved = repository.save(task);
        // Dispatch to topic
        messagingTemplate.convertAndSend("/topic/tasks", getTasksForDate(task.getDate()));
        return saved;
    }

    @Transactional
    public DailyTask updateTaskProgress(Long id, Double newValue) {
        DailyTask task = repository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCurrentValue(newValue);
        task.setUpdatedAt(java.time.LocalTime.now());
        DailyTask saved = repository.save(task);
        messagingTemplate.convertAndSend("/topic/tasks", getTasksForDate(task.getDate()));
        return saved;
    }

    @Transactional
    public void deleteTask(Long id) {
        repository.findById(id).ifPresent(task -> {
            LocalDate date = task.getDate();
            repository.delete(task);
            messagingTemplate.convertAndSend("/topic/tasks", getTasksForDate(date));
        });
    }
}
