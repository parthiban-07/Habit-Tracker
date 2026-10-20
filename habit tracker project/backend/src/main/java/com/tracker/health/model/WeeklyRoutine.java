package com.tracker.health.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "weekly_routines")
public class WeeklyRoutine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "day_of_week")
    private String dayOfWeek;

    @Column(name = "task_name")
    private String taskName;

    private boolean completed;

    @Column(name = "last_completed_date")
    private LocalDate lastCompletedDate;

    public WeeklyRoutine() {}

    public WeeklyRoutine(String dayOfWeek, String taskName) {
        this.dayOfWeek = dayOfWeek;
        this.taskName = taskName;
        this.completed = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public LocalDate getLastCompletedDate() { return lastCompletedDate; }
    public void setLastCompletedDate(LocalDate lastCompletedDate) { this.lastCompletedDate = lastCompletedDate; }
}
