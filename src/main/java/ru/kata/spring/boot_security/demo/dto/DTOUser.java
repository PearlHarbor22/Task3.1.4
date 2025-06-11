package ru.kata.spring.boot_security.demo.dto;

import java.util.List;

public class DTOUser {
    private Long id;
    private String name;
    private String email;
    private String password;
    private List<Long> rolesSelected;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<Long> getRolesSelected() { return rolesSelected; }
    public void setRolesSelected(List<Long> rolesSelected) { this.rolesSelected = rolesSelected; }
}
