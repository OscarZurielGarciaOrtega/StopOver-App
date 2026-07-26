package com.stopover.backend.repository;

import com.stopover.backend.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository nos da automáticamente los métodos save, findAll, findById, etc.
public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(String nombre);
}