package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserDetailsServiceImpl;

import java.security.Principal;
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserDetailsServiceImpl userService;  // Внедряем UserService

    public UserController(UserDetailsServiceImpl userService) {
        this.userService = userService;  // Инициализируем UserService
    }
    @GetMapping("")
    public ResponseEntity<Void> userPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", "/user/index.html");
        return new ResponseEntity<>(headers, HttpStatus.FOUND);  // HTTP 302 редирект
    }
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User user = userService.getCurrentUser();  // Используем UserService для получения текущего пользователя
        if (user != null) {
            return ResponseEntity.ok(user);  // Возвращаем данные текущего пользователя
        } else {
            return ResponseEntity.status(401).build();  // Если пользователь не найден, возвращаем 401 (Unauthorized)
        }
    }
}
