package ro.university.vehicledamagemanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        return authService.login(credentials.get("username"), credentials.get("password"))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}