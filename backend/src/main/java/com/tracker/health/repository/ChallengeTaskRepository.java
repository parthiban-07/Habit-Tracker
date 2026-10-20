package com.tracker.health.repository;

import com.tracker.health.model.ChallengeTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeTaskRepository extends JpaRepository<ChallengeTask, Long> {
}
