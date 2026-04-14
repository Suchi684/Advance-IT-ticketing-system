package com.ticketing.system.service;

import com.ticketing.system.model.CategoryConfig;
import com.ticketing.system.repository.CategoryConfigRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryConfigRepository categoryConfigRepository;

    public CategoryService(CategoryConfigRepository categoryConfigRepository) {
        this.categoryConfigRepository = categoryConfigRepository;
    }

    public List<CategoryConfig> getAllCategories() {
        return categoryConfigRepository.findAll();
    }

    public CategoryConfig createCategory(CategoryConfig config) {
        if (categoryConfigRepository.existsByName(config.getName())) {
            throw new RuntimeException("Category '" + config.getName() + "' already exists");
        }
        config.setIsDefault(false);
        return categoryConfigRepository.save(config);
    }

    public CategoryConfig updateCategory(Long id, CategoryConfig updated) {
        CategoryConfig existing = categoryConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existing.setLabel(updated.getLabel());
        existing.setColor(updated.getColor());
        existing.setBaseCredits(updated.getBaseCredits());
        if (!existing.getIsDefault()) {
            existing.setName(updated.getName());
        }
        return categoryConfigRepository.save(existing);
    }

    public void deleteCategory(Long id) {
        CategoryConfig config = categoryConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (config.getIsDefault()) {
            throw new RuntimeException("Cannot delete default categories");
        }
        categoryConfigRepository.delete(config);
    }
}
