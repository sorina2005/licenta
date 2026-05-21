package ro.university.vehicledamagemanager.service;

import org.springframework.stereotype.Service;
import ro.university.vehicledamagemanager.model.Vehicle;
import ro.university.vehicledamagemanager.repository.VehicleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehiculul nu a fost gasit cu ID: " + id));
    }

    public List<Vehicle> getVehiclesByOwner(Long userId) {
        return vehicleRepository.findByOwnerId(userId);
    }

    public Vehicle getVehicleByPlate(String plateNumber) {
        List<Vehicle> vehicles = vehicleRepository.findByPlateNumber(plateNumber);
        if (vehicles.isEmpty()) {
            throw new RuntimeException("Vehiculul cu numarul " + plateNumber + " nu exista.");
        }
        return vehicles.get(0);
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setPlateNumber(vehicleDetails.getPlateNumber());
        vehicle.setVin(vehicleDetails.getVin());
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}