package com.tracker.health.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_history")
public class UserHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private LocalDate date;

    private Double dailyScore; // Percentage 0-100

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(columnDefinition = "TEXT")
    private String blueprint;

    public UserHistory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getDailyScore() { return dailyScore; }
    public void setDailyScore(Double dailyScore) { this.dailyScore = dailyScore; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getBlueprint() { return blueprint; }
    public void setBlueprint(String blueprint) { this.blueprint = blueprint; }
}
