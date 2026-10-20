package com.tracker.health.controller;

import com.tracker.health.model.DailyTask;
import com.tracker.health.service.TaskService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<DailyTask>> getTasks(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        return ResponseEntity.ok(taskService.getTasksForDate(date));
    }

    @GetMapping("/history")
    public ResponseEntity<List<DailyTask>> getHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(taskService.getTasksForDate(date));
    }

    @PostMapping
    public ResponseEntity<DailyTask> createTask(@RequestBody DailyTask task) {
        return ResponseEntity.ok(taskService.saveTask(task));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<DailyTask> updateProgress(@PathVariable Long id, @RequestParam Double value) {
        return ResponseEntity.ok(taskService.updateTaskProgress(id, value));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
