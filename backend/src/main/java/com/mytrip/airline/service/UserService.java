package com.mytrip.airline.service;

import com.mytrip.airline.entity.*;
import com.mytrip.airline.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CrewRepository crewRepository;

    @Autowired
    private FrontDeskRepository frontDeskRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public User registerUser(User user, Object roleData) {
        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreateProfile(LocalDateTime.now());
        user.setUpdateProfile(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Save role-specific data
        switch (user.getUserType()) {
            case passenger:
                Passenger passenger = (Passenger) roleData;
                passenger.setUser(savedUser);
                passengerRepository.save(passenger);
                break;
            case admin:
                Admin admin = (Admin) roleData;
                admin.setUser(savedUser);
                adminRepository.save(admin);
                break;
            case crew:
                Crew crew = (Crew) roleData;
                crew.setUser(savedUser);
                crewRepository.save(crew);
                break;
            case front_desk:
                FrontDesk frontDesk = (FrontDesk) roleData;
                frontDesk.setUser(savedUser);
                frontDeskRepository.save(frontDesk);
                break;
        }

        return savedUser;
    }

    // Basic user retrieval methods
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> findByUserType(String userType) {
        try {
            User.UserType type = User.UserType.valueOf(userType.toLowerCase());
            return userRepository.findByUserType(type);
        } catch (IllegalArgumentException e) {
            // Return empty list if invalid user type provided
            return Collections.emptyList();
        }
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    // User modification methods
    public User updateUser(User user) {
        user.setUpdateProfile(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        // The @Transactional annotation ensures proper cleanup of related entities
        userRepository.deleteById(id);
    }

    // Security and authentication helper methods
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }

    public boolean isCurrentUser(Long id) {
        User current = getCurrentUser();
        return current != null && current.getUserID().equals(id);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // Login/logout tracking methods
    public void updateLoginTime(User user) {
        user.setLoginIn(LocalDateTime.now());
        userRepository.save(user);
    }

    public void updateLogoutTime(User user) {
        user.setLogout(LocalDateTime.now());
        userRepository.save(user);
    }

    // Additional utility methods for user management
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }

    public long countUsersByType(User.UserType userType) {
        return userRepository.countByUserType(userType);
    }

    // Method for updating specific user fields safely
    @Transactional
    public User updateUserProfile(Long userId, String name) {
        Optional<User> userOpt = findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setName(name);
            return updateUser(user);
        }
        throw new RuntimeException("User not found with ID: " + userId);
    }
}