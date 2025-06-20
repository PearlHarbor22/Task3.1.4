package ru.kata.spring.boot_security.demo.service;



import ru.kata.spring.boot_security.demo.dto.DTOUser;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import java.util.List;

public interface UserDetailsService extends org.springframework.security.core.userdetails.UserDetailsService {
    List<User> getAllUsers();
    void saveUser(User user);
    void deleteUser(Long id);
    User getUser(Long id);
    User findByEmail(String email);
    List<Role> getAllRoles();
    User getCurrentUser();
    // --- REST ---
    User createUser(DTOUser dto);
    User updateUser(DTOUser dto);
}
