package ro.university.vehicledamagemanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.university.vehicledamagemanager.model.Vehicle;
import ro.university.vehicledamagemanager.model.User;
import ro.university.vehicledamagemanager.repository.VehicleRepository;
import ro.university.vehicledamagemanager.repository.UserRepository;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getUserVehicles(@RequestParam String userId) {
        try {
            // Verificăm dacă frontend-ul a trimis mizerii gen "null" sau "undefined"
            if (userId == null || userId.trim().isEmpty() || "null".equalsIgnoreCase(userId) || "undefined".equalsIgnoreCase(userId)) {
                return ResponseEntity.badRequest().body("{\"message\":\"Eroare: userId lipsește din localStorage în frontend!\"}");
            }

            User user = null;
            // Dacă ai salvat email-ul în loc de ID, îl căutăm inteligent după email
            if (userId.contains("@")) {
                user = userRepository.findByEmail(userId.trim()).orElse(null);
            } else {
                try {
                    Long id = Long.parseLong(userId.trim());
                    user = userRepository.findById(id).orElse(null);
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("{\"message\":\"Format invalid pentru ID.\"}");
                }
            }

            if (user == null) {
                return ResponseEntity.status(404).body("{\"message\":\"Utilizatorul nu a fost găsit în bază.\"}");
            }

            List<Vehicle> vehicles = vehicleRepository.findByOwnerId(user.getId());
            List<java.util.Map<String, Object>> response = new java.util.ArrayList<>();

            for (Vehicle v : vehicles) {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", v.getId());
                map.put("brand", v.getBrand());
                map.put("model", v.getModel());
                map.put("plateNumber", v.getPlateNumber());
                map.put("vin", v.getVin());
                response.add(map);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\":\"Eroare internă la preluare\"}");
        }
    }

    @PostMapping
    public ResponseEntity<?> addVehicle(@RequestBody Vehicle vehicle, @RequestParam String userId) {
        try {
            if (userId == null || "null".equalsIgnoreCase(userId) || "undefined".equalsIgnoreCase(userId)) {
                return ResponseEntity.badRequest().body("{\"message\":\"Nu se poate salva: utilizator neidentificat.\"}");
            }

            User user = null;
            if (userId.contains("@")) {
                user = userRepository.findByEmail(userId.trim()).orElse(null);
            } else {
                user = userRepository.findById(Long.parseLong(userId.trim())).orElse(null);
            }

            if (user == null) {
                return ResponseEntity.status(404).body("{\"message\":\"Utilizator inexistent.\"}");
            }

            vehicle.setOwner(user);
            vehicleRepository.save(vehicle);
            return ResponseEntity.ok("{\"message\":\"Vehicul salvat cu succes!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\":\"Eroare la salvare\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        if (!vehicleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vehicleRepository.deleteById(id);
        return ResponseEntity.ok("{\"message\":\"Vehicul șters\"}");
    }
}