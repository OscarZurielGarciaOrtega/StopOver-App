package com.stopover.backend.repository;

import com.stopover.backend.model.Ruta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RutaRepository extends JpaRepository<Ruta, Long> {

    
    Page<Ruta> findByUsuarioId(Long usuarioId, Pageable pageable);
}