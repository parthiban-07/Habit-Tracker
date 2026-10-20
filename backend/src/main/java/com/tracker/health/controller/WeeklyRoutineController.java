package com.tracker.health.controller;

import com.tracker.health.model.WeeklyRoutine;
import com.tracker.health.repository.WeeklyRoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/weekly")
public class WeeklyRoutineController {

    @Autowired
    private WeeklyRoutineRepository repository;

    @GetMapping
    public List<WeeklyRoutine> getAllRoutines() {
        List<WeeklyRoutine> routines = repository.findAll();
        boolean anyUpdated = false;
        
        for (WeeklyRoutine routine : routines) {
            if (routine.isCompleted() && routine.getLastCompletedDate() != null) {
                try {
                    DayOfWeek targetDay = DayOfWeek.valueOf(routine.getDayOfWeek().toUpperCase());
                    LocalDate today = LocalDate.now();
                    LocalDate mostRecentOccurrence = today.with(TemporalAdjusters.previousOrSame(targetDay));
                    
                    if (routine.getLastCompletedDate().isBefore(mostRecentOccurrence)) {
                        routine.setCompleted(false);
                        anyUpdated = true;
                    }
                } catch (Exception e) {
                    // Ignore parsing errors for safety
                }
            }
        }
        
        if (anyUpdated) {
            repository.saveAll(routines);
        }
        
        return routines;
    }

    @PostMapping
    public WeeklyRoutine createRoutine(@RequestBody WeeklyRoutine routine) {
        routine.setCompleted(false);
        routine.setDayOfWeek(routine.getDayOfWeek().toUpperCase());
        return repository.save(routine);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<WeeklyRoutine> toggleRoutine(@PathVariable Long id) {
        Optional<WeeklyRoutine> optionalRoutine = repository.findById(id);
        if (optionalRoutine.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        WeeklyRoutine routine = optionalRoutine.get();
        routine.setCompleted(!routine.isCompleted());
        if (routine.isCompleted()) {
            routine.setLastCompletedDate(LocalDate.now());
        }
        
        return ResponseEntity.ok(repository.save(routine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
