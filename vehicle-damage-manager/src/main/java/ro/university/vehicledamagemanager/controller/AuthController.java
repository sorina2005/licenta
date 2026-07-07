package ro.university.vehicledamagemanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import ro.university.vehicledamagemanager.exception.UserNotFoundException;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.UserRepository;
import ro.university.vehicledamagemanager.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    public AuthController(AuthService authService, UserRepository userRepository, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest, HttpServletRequest request, HttpServletResponse response) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        securityContextRepository.saveContext(context, request, response);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilizator sau parola incorecta."));

        return ResponseEntity.ok(user);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\":\"Email-ul este obligatoriu pentru resetarea parolei.\"}");
        }
        authService.initiatePasswordReset(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        authService.finalizePasswordReset(request.get("token"), request.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("{\"message\":\"Sesiune invalida sau utilizator neautentificat\"}");
        }

        String currentUsername = userDetails.getUsername();
        if (currentUsername == null || currentUsername.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\":\"Username-ul este obligatoriu.\"}");
        }

        User user = userRepository.findByUsernameOrEmail(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("Utilizatorul nu exista in baza de date."));

        Map<String, String> realUserData = new HashMap<>();
        realUserData.put("username", user.getUsername());
        realUserData.put("email", user.getEmail());
        realUserData.put("role", user.getFormattedRole());

        return ResponseEntity.ok(realUserData);
    }
}