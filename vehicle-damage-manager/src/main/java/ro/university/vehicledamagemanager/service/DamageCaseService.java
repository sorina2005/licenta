package ro.university.vehicledamagemanager.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.university.vehicledamagemanager.model.DamageCase;
import ro.university.vehicledamagemanager.model.DamagePart;
import ro.university.vehicledamagemanager.repository.DamageCaseRepository;
import ro.university.vehicledamagemanager.repository.DamagePartRepository;

import java.util.List;

@Service
public class DamageCaseService {

    private final DamageCaseRepository damageCaseRepository;
    private final DamagePartRepository damagePartRepository;

    public DamageCaseService(DamageCaseRepository damageCaseRepository, DamagePartRepository damagePartRepository) {
        this.damageCaseRepository = damageCaseRepository;
        this.damagePartRepository = damagePartRepository;
    }

    public List<DamageCase> getAllCases() {
        return damageCaseRepository.findAll();
    }

    public List<DamageCase> getCasesByUser(Long userId) {
        return damageCaseRepository.findByCreatorId(userId);
    }

    public DamageCase getCaseById(Long id) {
        return damageCaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dosarul nu a fost gasit"));
    }

    @Transactional
    public DamageCase createCase(DamageCase damageCase) {
        damageCase.setStatus("PENDING");
        return damageCaseRepository.save(damageCase);
    }

    @Transactional
    public DamagePart addPartToCase(Long caseId, DamagePart part) {
        DamageCase damageCase = getCaseById(caseId);
        part.setDamageCase(damageCase);
        return damagePartRepository.save(part);
    }

    public void updateStatus(Long id, String status) {
        DamageCase damageCase = getCaseById(id);
        damageCase.setStatus(status);
        damageCaseRepository.save(damageCase);
    }
}