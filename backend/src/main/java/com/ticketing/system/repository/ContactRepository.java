package com.ticketing.system.repository;

import com.ticketing.system.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    Optional<Contact> findByEmail(String email);
    boolean existsByEmail(String email);
}
