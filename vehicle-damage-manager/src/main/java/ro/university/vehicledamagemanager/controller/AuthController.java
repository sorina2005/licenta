package ro.university.vehicledamagemanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username deja existent!");
        }
        user.setRole("USER"); // Default role
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData) {
        Optional<User> user = userRepository.findByUsername(loginData.getUsername());

        if (user.isPresent() && user.get().getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).body("Date invalide!");
    }
}