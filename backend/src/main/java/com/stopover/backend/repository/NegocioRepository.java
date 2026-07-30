package com.stopover.backend.repository;

import com.stopover.backend.model.Negocio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NegocioRepository extends JpaRepository<Negocio, Long> {
    Page<Negocio> findByEstatus(String estatus, Pageable pageable);
}