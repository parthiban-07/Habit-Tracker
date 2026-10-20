package com.tracker.health.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "daily_tasks")
public class DailyTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    // e.g., "BOOLEAN" or "NUMERIC"
    private String type;

    private Double goalValue;

    private Double currentValue;
    
    private LocalTime updatedAt;

    private LocalDate date;

    private boolean recurring = true;

    public DailyTask() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getGoalValue() { return goalValue; }
    public void setGoalValue(Double goalValue) { this.goalValue = goalValue; }

    public Double getCurrentValue() { return currentValue; }
    public void setCurrentValue(Double currentValue) { this.currentValue = currentValue; }

    public LocalTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }
}
