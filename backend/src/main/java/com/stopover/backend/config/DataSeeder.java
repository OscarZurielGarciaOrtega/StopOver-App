package com.stopover.backend.config;

import com.stopover.backend.model.Rol;
import com.stopover.backend.model.Usuario;
import com.stopover.backend.repository.RolRepository;
import com.stopover.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository, RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
      
        if (usuarioRepository.count() > 0) {
            return;
        }

        Rol admin = rolRepository.findByNombre("ADMIN").orElseThrow();
        Rol usuarioRol = rolRepository.findByNombre("USUARIO").orElseThrow();
        Rol operador = rolRepository.findByNombre("OPERADOR").orElseThrow();

        // Admin por defecto (credenciales documentadas también en el README)
        crearUsuario("Admin StopOver", "admin@stopover.com", "Admin123!", admin);

        // 14 usuarios de prueba más, variando roles
        crearUsuario("Ana García", "ana.garcia@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Luis Martínez", "luis.martinez@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("María López", "maria.lopez@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Carlos Ruiz", "carlos.ruiz@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Sofía Hernández", "sofia.hernandez@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Jorge Pérez", "jorge.perez@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Daniela Torres", "daniela.torres@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Ricardo Gómez", "ricardo.gomez@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Fernanda Cruz", "fernanda.cruz@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Diego Ramírez", "diego.ramirez@stopover.com", "Usuario123!", usuarioRol);
        crearUsuario("Paola Sánchez", "paola.sanchez@stopover.com", "Operador123!", operador);
        crearUsuario("Miguel Ortiz", "miguel.ortiz@stopover.com", "Operador123!", operador);
        crearUsuario("Valeria Reyes", "valeria.reyes@stopover.com", "Operador123!", operador);
        crearUsuario("Andrés Flores", "andres.flores@stopover.com", "Operador123!", operador);
    }

    private void crearUsuario(String nombre, String email, String password, Rol rol) {
        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(password)); // aquí se genera el hash BCrypt real
        u.setRol(rol);
        usuarioRepository.save(u);
    }
}