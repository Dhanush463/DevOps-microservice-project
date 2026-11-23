package com.example.leave_service.dto;

// Maps the JSON fields returned by your existing employee-service
public class EmployeeDTO {
    private Long id;
    private String firstName; // Adjust field names to match your Employee entity
    private String lastName;
    private String email;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}