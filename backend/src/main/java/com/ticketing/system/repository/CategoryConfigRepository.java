package com.ticketing.system.repository;

import com.ticketing.system.model.CategoryConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryConfigRepository extends JpaRepository<CategoryConfig, Long> {
    Optional<CategoryConfig> findByName(String name);
    boolean existsByName(String name);
}
