package com.tracker.health.model;

import jakarta.persistence.*;

@Entity
@Table(name = "challenge_daily_tasks")
public class ChallengeDailyTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "challenge_id")
    private Long challengeId;

    @Column(name = "day_number")
    private Integer dayNumber;

    @Column(name = "task_name")
    private String taskName;

    private boolean completed;

    public ChallengeDailyTask() {}

    public ChallengeDailyTask(Long challengeId, Integer dayNumber, String taskName) {
        this.challengeId = challengeId;
        this.dayNumber = dayNumber;
        this.taskName = taskName;
        this.completed = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getChallengeId() { return challengeId; }
    public void setChallengeId(Long challengeId) { this.challengeId = challengeId; }

    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }

    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
