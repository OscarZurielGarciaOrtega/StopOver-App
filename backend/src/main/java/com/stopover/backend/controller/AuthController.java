package com.stopover.backend.controller;

import com.stopover.backend.dto.LoginRequest;
import com.stopover.backend.dto.LoginResponse;
import com.stopover.backend.model.Usuario;
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
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElse(null);

        // Mismo mensaje si el usuario no existe o si la contraseña es incorrecta (no revelamos cuál de las dos falló, por seguridad)
        if (usuario == null || !passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        String token = jwtService.generarToken(usuario.getEmail(), usuario.getRol().getNombre());

        return ResponseEntity.ok(new LoginResponse(token, usuario.getEmail(), usuario.getRol().getNombre()));
    }
}