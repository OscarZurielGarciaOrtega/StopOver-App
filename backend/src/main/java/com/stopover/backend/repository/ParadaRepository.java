package com.stopover.backend.repository;

import com.stopover.backend.model.Parada;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParadaRepository extends JpaRepository<Parada, Long> {

    
    Page<Parada> findByTipo(String tipo, Pageable pageable);




     @Query("SELECT p FROM Parada p WHERE " +
           "(:tipo IS NULL OR p.tipo = :tipo) AND " +
           "(:destino IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :destino, '%')))")
    Page<Parada> recomendar(@Param("tipo") String tipo, @Param("destino") String destino, Pageable pageable);
}