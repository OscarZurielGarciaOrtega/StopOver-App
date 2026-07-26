package com.stopover.backend.repository;

import com.stopover.backend.model.Parada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParadaRepository extends JpaRepository<Parada, Long> {
}