package com.mytrip.airline.service;

import com.mytrip.airline.entity.*;
import com.mytrip.airline.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public User registerUser(User user, Object roleData) {
        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreateProfile(LocalDateTime.now());
        user.setUpdateProfile(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Save role-specific data
        switch (user.getUserType()) {
            case passenger -> {
                Passenger passenger = (Passenger) roleData;
                passenger.setUser(savedUser);
                passengerRepository.save(passenger);
            }
            case admin -> {
                Admin admin = (Admin) roleData;
                admin.setUser(savedUser);
                adminRepository.save(admin);
            }
            case crew -> {
                Crew crew = (Crew) roleData;
                crew.setUser(savedUser);
                crewRepository.save(crew);
            }
            case front_desk -> {
                FrontDesk frontDesk = (FrontDesk) roleData;
                frontDesk.setUser(savedUser);
                frontDeskRepository.save(frontDesk);
            }
        }

        return savedUser;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public void updateLoginTime(User user) {
        user.setLoginIn(LocalDateTime.now());
        userRepository.save(user);
    }

    public void updateLogoutTime(User user) {
        user.setLogout(LocalDateTime.now());
        userRepository.save(user);
    }
}
