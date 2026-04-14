package com.ticketing.system.controller;

import com.ticketing.system.model.Tag;
import com.ticketing.system.repository.TagRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagRepository tagRepository;

    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        List<Map<String, Object>> tags = tagRepository.findAll().stream()
                .map(this::mapTag)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Tag tag) {
        Tag saved = tagRepository.save(tag);
        return ResponseEntity.ok(mapTag(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        tagRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Tag deleted successfully");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapTag(Tag tag) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", tag.getId());
        map.put("name", tag.getName());
        map.put("color", tag.getColor());
        return map;
    }
}
