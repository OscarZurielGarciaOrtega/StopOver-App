package com.stopover.backend.controller;

import com.stopover.backend.dto.LoginRequest;
import com.stopover.backend.dto.LoginResponse;
import com.stopover.backend.dto.RegistroRequest;
import com.stopover.backend.model.Rol;
import com.stopover.backend.model.Usuario;
import com.stopover.backend.repository.RolRepository;
import com.stopover.backend.repository.UsuarioRepository;
import com.stopover.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository, RolRepository rolRepository,
                           PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElse(null);

        if (usuario == null || !passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        String token = jwtService.generarToken(usuario.getEmail(), usuario.getRol().getNombre());
        return ResponseEntity.ok(new LoginResponse(token, usuario.getEmail(), usuario.getRol().getNombre()));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un usuario con ese email");
        }

        Rol rolUsuario = rolRepository.findByNombre("USUARIO")
                .orElseThrow(() -> new RuntimeException("Rol USUARIO no encontrado"));

        Usuario nuevo = new Usuario();
        nuevo.setNombre(request.getNombre());
        nuevo.setEmail(request.getEmail());
        nuevo.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        nuevo.setRol(rolUsuario);
        usuarioRepository.save(nuevo);

        String token = jwtService.generarToken(nuevo.getEmail(), rolUsuario.getNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponse(token, nuevo.getEmail(), rolUsuario.getNombre()));
    }
}