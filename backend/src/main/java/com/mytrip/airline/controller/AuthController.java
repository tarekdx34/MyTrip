package com.mytrip.airline.controller;

import com.mytrip.airline.dto.*;
import com.mytrip.airline.entity.*;
import com.mytrip.airline.service.AuthService;
import com.mytrip.airline.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            // Validate required fields based on user type
            if (!validateUserTypeSpecificFields(request)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Missing required fields for user type: " + request.getUserType());
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setUserType(request.getUserType());

            Object roleData = null;

            switch (request.getUserType()) {
                case passenger:
                    Passenger passenger = new Passenger();
                    passenger.setPassportNumber(request.getPassportNumber());
                    passenger.setNationality(request.getNationality());
                    passenger.setDateOfBirth(request.getDateOfBirth());
                    roleData = passenger;
                    break;
                case admin:
                    Admin admin = new Admin();
                    admin.setEmployeeNumber(request.getEmployeeNumber());
                    // Handle accessLevel properly - convert Integer to String if needed
                    admin.setAccessLevel(request.getAccessLevel() != null ? 
                        request.getAccessLevel().toString() : "1");
                    roleData = admin;
                    break;
                case crew:
                    Crew crew = new Crew();
                    crew.setEmployeeNumber(request.getEmployeeNumber());
                    if (request.getPosition() != null) {
                        try {
                            crew.setPosition(Crew.Position.fromValue(request.getPosition()));
                        } catch (IllegalArgumentException e) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Invalid crew position: " + request.getPosition());
                        }
                    }
                    crew.setLicenseNumber(request.getLicenseNumber());
                    roleData = crew;
                    break;
                case front_desk:
                    FrontDesk frontDesk = new FrontDesk();
                    frontDesk.setEmployeeNumber(request.getEmployeeNumber());
                    frontDesk.setDepartment(request.getDepartment());
                    roleData = frontDesk;
                    break;
            }

            User savedUser = userService.registerUser(user, roleData);

            return ResponseEntity.ok("User registered successfully with userID: " + savedUser.getUserID());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }

    private boolean validateUserTypeSpecificFields(RegisterRequest request) {
        switch (request.getUserType()) {
            case passenger:
                return request.getPassportNumber() != null && 
                       request.getNationality() != null && 
                       request.getDateOfBirth() != null;
            case admin:
                return request.getEmployeeNumber() != null;
            case crew:
                return request.getEmployeeNumber() != null && 
                       request.getPosition() != null;
            case front_desk:
                return request.getEmployeeNumber() != null && 
                       request.getDepartment() != null;
            default:
                return false;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            Optional<User> userOpt = userService.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
            User user = userOpt.get();
            if (!userService.checkPassword(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
            userService.updateLoginTime(user);
            String token = authService.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(token, user.getUserID(), authService.extractRole(token)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Login failed: " + e.getMessage());
        }
    }
}