package com.tracker.health.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "challenge_tasks")
public class ChallengeTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String routines;

    private LocalDate startDate;
    
    private Integer totalDays = 21;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "challenge_task_completed_days", joinColumns = @JoinColumn(name = "challenge_task_id"))
    @Column(name = "day_number")
    private Set<Integer> completedDays = new HashSet<>();

    @Transient
    private java.util.Map<Integer, java.util.List<ChallengeDailyTask>> dailyTasks;

    public ChallengeTask() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRoutines() { return routines; }
    public void setRoutines(String routines) { this.routines = routines; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public Integer getTotalDays() { return totalDays; }
    public void setTotalDays(Integer totalDays) { this.totalDays = totalDays; }

    public Set<Integer> getCompletedDays() { return completedDays; }
    public void setCompletedDays(Set<Integer> completedDays) { this.completedDays = completedDays; }

    public java.util.Map<Integer, java.util.List<ChallengeDailyTask>> getDailyTasks() { return dailyTasks; }
    public void setDailyTasks(java.util.Map<Integer, java.util.List<ChallengeDailyTask>> dailyTasks) { this.dailyTasks = dailyTasks; }
}
