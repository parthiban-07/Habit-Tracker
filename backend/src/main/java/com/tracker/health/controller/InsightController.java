package com.tracker.health.controller;

import com.tracker.health.model.DailyTask;
import com.tracker.health.model.UserHistory;
import com.tracker.health.service.AIEngineService;
import com.tracker.health.service.TaskService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final AIEngineService aiEngineService;
    private final TaskService taskService;

    public InsightController(AIEngineService aiEngineService, TaskService taskService) {
        this.aiEngineService = aiEngineService;
        this.taskService = taskService;
    }

    @PostMapping("/generate")
    public ResponseEntity<UserHistory> generateInsights(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        
        List<DailyTask> tasks = taskService.getTasksForDate(date);
        UserHistory history = aiEngineService.evaluateDay(tasks, date);
        
        return ResponseEntity.ok(history);
    }

    @GetMapping
    public ResponseEntity<UserHistory> getInsights(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        
        return aiEngineService.getHistory(date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
