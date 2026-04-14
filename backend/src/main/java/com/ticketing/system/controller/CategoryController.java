package com.ticketing.system.controller;

import com.ticketing.system.model.CategoryConfig;
import com.ticketing.system.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryConfig>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<CategoryConfig> create(@RequestBody CategoryConfig config) {
        return ResponseEntity.ok(categoryService.createCategory(config));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryConfig> update(@PathVariable Long id, @RequestBody CategoryConfig config) {
        return ResponseEntity.ok(categoryService.updateCategory(id, config));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
