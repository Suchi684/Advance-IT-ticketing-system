package com.ticketing.system.config;

import com.ticketing.system.model.CategoryConfig;
import com.ticketing.system.model.SlaPolicy;
import com.ticketing.system.model.enums.Priority;
import com.ticketing.system.repository.CategoryConfigRepository;
import com.ticketing.system.repository.SlaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryConfigRepository categoryConfigRepository;
    private final SlaRepository slaRepository;

    public DataSeeder(CategoryConfigRepository categoryConfigRepository, SlaRepository slaRepository) {
        this.categoryConfigRepository = categoryConfigRepository;
        this.slaRepository = slaRepository;
    }

    @Override
    public void run(String... args) {
        seedCategory("RETURN", "Return", "#C75050", 10);
        seedCategory("EXCHANGE", "Exchange", "#D4A0B0", 10);
        seedCategory("REFUND", "Refund", "#6B3A5E", 15);
        seedCategory("LOW_QUALITY", "Low Quality", "#9E6880", 8);
        seedCategory("SHIPPING", "Shipping", "#A0516B", 8);
        seedCategory("ORDER_ISSUE", "Order Issue", "#7D4568", 12);
        seedCategory("GENERAL", "General", "#8C8590", 5);

        seedSla(Priority.URGENT, 1, 4);
        seedSla(Priority.HIGH, 4, 8);
        seedSla(Priority.MEDIUM, 8, 24);
        seedSla(Priority.LOW, 24, 72);
    }

    private void seedCategory(String name, String label, String color, int credits) {
        if (!categoryConfigRepository.existsByName(name)) {
            categoryConfigRepository.save(new CategoryConfig(name, label, color, credits, true));
        }
    }

    private void seedSla(Priority priority, int responseHours, int resolutionHours) {
        if (!slaRepository.findByPriority(priority).isPresent()) {
            SlaPolicy sla = new SlaPolicy();
            sla.setPriority(priority);
            sla.setResponseHours(responseHours);
            sla.setResolutionHours(resolutionHours);
            slaRepository.save(sla);
        }
    }
}
