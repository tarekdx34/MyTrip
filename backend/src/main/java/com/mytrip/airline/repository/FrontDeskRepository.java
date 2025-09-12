package com.mytrip.airline.repository;

import com.mytrip.airline.entity.FrontDesk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FrontDeskRepository extends JpaRepository<FrontDesk, Long> {
}
