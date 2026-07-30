package com.stopover.backend.controller;

import com.stopover.backend.dto.CambiarEstatusRequest;
import com.stopover.backend.dto.CambiarRolRequest;
import com.stopover.backend.dto.CrearUsuarioAdminRequest;
import com.stopover.backend.model.Rol;
import com.stopover.backend.model.Usuario;
import com.stopover.backend.repository.RolRepository;
import com.stopover.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioAdminController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioAdminController(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. Crear usuario con rol asignado directamente
    @PostMapping
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody CrearUsuarioAdminRequest request) {

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe un usuario con ese email");
        }

        Rol rol = rolRepository.findByNombre(request.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + request.getRol()));

        Usuario nuevo = new Usuario();
        nuevo.setNombre(request.getNombre());
        nuevo.setEmail(request.getEmail());
        nuevo.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        nuevo.setRol(rol);
        nuevo.setEstatus("Activo");

        usuarioRepository.save(nuevo);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // 2. Bloquear / Desbloquear
    @PutMapping("/{id}/estatus")
    public ResponseEntity<?> cambiarEstatus(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstatusRequest request) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        usuario.setEstatus(request.getEstatus());
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(usuario);
    }

    // 3. Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {

        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
        }

        usuarioRepository.deleteById(id);

        return ResponseEntity.ok("Usuario eliminado correctamente");
    }

    // 4. Cambiar rol de un usuario existente
    @PutMapping("/{id}/rol")
    public ResponseEntity<?> cambiarRol(
            @PathVariable Long id,
            @Valid @RequestBody CambiarRolRequest request) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        Rol nuevoRol = rolRepository.findByNombre(request.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + request.getRol()));

        usuario.setRol(nuevoRol);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(usuario);
    }
}