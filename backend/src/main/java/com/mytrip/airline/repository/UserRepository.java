package com.mytrip.airline.repository;

import com.mytrip.airline.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    // Add these new methods:
    List<User> findByUserType(User.UserType userType);
    
    // Note: findById and findAll are already provided by JpaRepository
    // No need to redeclare them, but keeping for clarity
    
    // Optional: Additional useful queries
    List<User> findByNameContainingIgnoreCase(String name);
    
    boolean existsByEmail(String email);
    
    // Additional useful methods for future use
    long countByUserType(User.UserType userType);
}