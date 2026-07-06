package ro.university.vehicledamagemanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.UserRepository;
import ro.university.vehicledamagemanager.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");

        // Căutăm utilizatorul direct în baza de date
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilizator sau parola incorecta."));

        // Returnăm obiectul User complet către React, exact cum funcționa înainte
        return ResponseEntity.ok(user);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        authService.initiatePasswordReset(request.get("email"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        authService.finalizePasswordReset(request.get("token"), request.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Map<String, String> testUser = new HashMap<>();
        testUser.put("username", "Ciobanu Doina");
        testUser.put("email", "noreply.autodamagehub@gmail.com");
        testUser.put("role", "CLIENT");
        return ResponseEntity.ok(testUser);
    }
}