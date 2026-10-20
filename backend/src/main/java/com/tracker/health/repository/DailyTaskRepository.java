package com.tracker.health.repository;

import com.tracker.health.model.DailyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {
    List<DailyTask> findByDate(LocalDate date);
    
    List<DailyTask> findByDateAndRecurring(LocalDate date, boolean recurring);
    
    List<DailyTask> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    DailyTask findFirstByOrderByDateDesc();
}
