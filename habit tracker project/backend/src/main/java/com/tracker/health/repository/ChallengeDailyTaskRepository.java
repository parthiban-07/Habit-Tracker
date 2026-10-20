package com.tracker.health.repository;

import com.tracker.health.model.ChallengeDailyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChallengeDailyTaskRepository extends JpaRepository<ChallengeDailyTask, Long> {
    List<ChallengeDailyTask> findByChallengeId(Long challengeId);

    @Transactional
    void deleteByChallengeId(Long challengeId);
}

