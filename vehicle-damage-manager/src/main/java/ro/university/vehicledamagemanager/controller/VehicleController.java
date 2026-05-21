package ro.university.vehicledamagemanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.university.vehicledamagemanager.model.Vehicle;
import ro.university.vehicledamagemanager.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Vehicle>> getUserVehicles(@PathVariable Long userId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByOwner(userId));
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.saveVehicle(vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}