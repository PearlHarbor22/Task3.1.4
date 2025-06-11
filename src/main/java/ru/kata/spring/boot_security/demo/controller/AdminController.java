package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.dto.DTOUser;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserDetailsService;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final UserDetailsService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserDetailsService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }
    @GetMapping("")
    public ResponseEntity<Void> redirectToAdminPage() {
        // Перенаправление на /admin/index.html
        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", "/admin/index.html");
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> adminPage() {
        Map<String, Object> response = new HashMap<>();
        response.put("users", userService.getAllUsers());
        response.put("allRoles", roleService.getAllRoles());
        return ResponseEntity.ok(response);
    }

    // Создание нового пользователя
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody DTOUser dto) {
        try {
            User createdUser = userService.createUser(dto);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка создания пользователя");
        }
    }

    // Обновление пользователя
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody DTOUser dto) {
        if (!id.equals(dto.getId())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            // Проверяем, существует ли пользователь с таким ID
            User updatedUser = userService.updateUser(dto);  // Обновляем пользователя
            return ResponseEntity.ok(updatedUser); // Возвращаем обновленного пользователя
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();  // Если пользователь не найден
        } catch (Exception e) {
            return ResponseEntity.status(500).build();  // Обработка других ошибок
        }
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(userService.getAllRoles());
    }
}
