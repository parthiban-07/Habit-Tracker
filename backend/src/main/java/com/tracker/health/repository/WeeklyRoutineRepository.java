package com.tracker.health.repository;

import com.tracker.health.model.WeeklyRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeeklyRoutineRepository extends JpaRepository<WeeklyRoutine, Long> {
}
