package stage.gestion_actifs.service;

import org.springframework.stereotype.Service;

import stage.gestion_actifs.Repository.MaintenanceRepository;
import stage.gestion_actifs.entity.Maintenance;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceService(
            MaintenanceRepository maintenanceRepository) {

        this.maintenanceRepository = maintenanceRepository;
    }

    // Cette méthode récupère toutes les maintenances.
    public List<Maintenance> findAll() {
        return maintenanceRepository.findAll();
    }

    // Cette méthode récupère une maintenance par son identifiant.
    public Optional<Maintenance> findById(Long id) {
        return maintenanceRepository.findById(id);
    }

    // Cette méthode ajoute ou modifie une maintenance.
    public Maintenance save(Maintenance maintenance) {
        return maintenanceRepository.save(maintenance);
    }

    // Cette méthode supprime une maintenance.
    public void deleteById(Long id) {
        maintenanceRepository.deleteById(id);
    }
}