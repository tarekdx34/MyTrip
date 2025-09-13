package com.mytrip.airline.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    private LocalDateTime loginIn;

    private LocalDateTime logout;

    private LocalDateTime createProfile;

    private LocalDateTime updateProfile;

    // Getters and Setters

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public LocalDateTime getLoginIn() {
        return loginIn;
    }

    public void setLoginIn(LocalDateTime loginIn) {
        this.loginIn = loginIn;
    }

    public LocalDateTime getLogout() {
        return logout;
    }

    public void setLogout(LocalDateTime logout) {
        this.logout = logout;
    }

    public LocalDateTime getCreateProfile() {
        return createProfile;
    }

    public void setCreateProfile(LocalDateTime createProfile) {
        this.createProfile = createProfile;
    }

    public LocalDateTime getUpdateProfile() {
        return updateProfile;
    }

    public void setUpdateProfile(LocalDateTime updateProfile) {
        this.updateProfile = updateProfile;
    }

    public enum UserType {
        passenger,
        admin,
        crew,
        front_desk
    }
}
