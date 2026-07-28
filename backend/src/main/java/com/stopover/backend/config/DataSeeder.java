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
        Rol viajero = rolRepository.findByNombre("VIAJERO").orElseThrow();
        Rol propietario = rolRepository.findByNombre("PROPIETARIO").orElseThrow();

        
        crearUsuario("Admin StopOver", "admin@stopover.com", "Admin123!", admin);

        
        crearUsuario("Ana García", "ana.garcia@stopover.com", "Usuario123!", viajero);
        crearUsuario("Luis Martínez", "luis.martinez@stopover.com", "Usuario123!", viajero);
        crearUsuario("María López", "maria.lopez@stopover.com", "Usuario123!", viajero);
        crearUsuario("Carlos Ruiz", "carlos.ruiz@stopover.com", "Usuario123!", viajero);
        crearUsuario("Sofía Hernández", "sofia.hernandez@stopover.com", "Usuario123!", viajero);
        crearUsuario("Jorge Pérez", "jorge.perez@stopover.com", "Usuario123!", viajero);
        crearUsuario("Daniela Torres", "daniela.torres@stopover.com", "Usuario123!", viajero);
        crearUsuario("Ricardo Gómez", "ricardo.gomez@stopover.com", "Usuario123!", viajero);
        crearUsuario("Fernanda Cruz", "fernanda.cruz@stopover.com", "Usuario123!", viajero);
        crearUsuario("Diego Ramírez", "diego.ramirez@stopover.com", "Usuario123!", viajero);

        
        crearUsuario("Paola Sánchez", "paola.sanchez@stopover.com", "Propietario123!", propietario);
        crearUsuario("Miguel Ortiz", "miguel.ortiz@stopover.com", "Propietario123!", propietario);
        crearUsuario("Valeria Reyes", "valeria.reyes@stopover.com", "Propietario123!", propietario);
        crearUsuario("Andrés Flores", "andres.flores@stopover.com", "Propietario123!", propietario);
    }

    private void crearUsuario(String nombre, String email, String password, Rol rol) {
        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(password)); 
        u.setRol(rol);
        usuarioRepository.save(u);
    }
}