package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;

import java.security.Principal;
@RestController
@RequestMapping("/user")
public class UserController {
    @GetMapping("")
    public ResponseEntity<Void> userPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", "/user/index.html");
        return new ResponseEntity<>(headers, HttpStatus.FOUND);  // HTTP 302 редирект
    }
}
