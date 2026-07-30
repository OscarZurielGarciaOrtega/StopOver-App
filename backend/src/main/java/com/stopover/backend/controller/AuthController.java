package com.stopover.backend.controller;

import com.stopover.backend.dto.LoginRequest;
import com.stopover.backend.dto.LoginResponse;
import com.stopover.backend.dto.RegistroRequest;
import com.stopover.backend.dto.RecuperarPasswordRequest;
import com.stopover.backend.dto.ResetPasswordRequest;
import com.stopover.backend.model.Rol;
import com.stopover.backend.model.Usuario;
import com.stopover.backend.repository.RolRepository;
import com.stopover.backend.repository.UsuarioRepository;
import com.stopover.backend.security.JwtService;
import com.stopover.backend.service.NotificacionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.stopover.backend.service.EmailService;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificacionService notificacionService;
    private final EmailService emailService;

    public AuthController(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            NotificacionService notificacionService,
            EmailService emailService) {

        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.notificacionService = notificacionService;
        this.emailService = emailService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElse(null);

        if (usuario == null || 
            !passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas");
        }


        String token = jwtService.generarToken(
                usuario.getEmail(),
                usuario.getRol().getNombre()
        );


        emailService.enviarCorreo(
                usuario.getEmail(),
                "¡Bienvenido de vuelta a StopOver! 🚌",
                "Hola " + usuario.getNombre() + ",\n\n" +
                "Has iniciado sesión correctamente en StopOver.\n" +
                "¡Que tengas un excelente viaje!\n\n" +
                "Si no fuiste tú quien inició sesión, por favor contáctanos de inmediato.\n\n" +
                "— El equipo de StopOver"
        );

        emailService.enviarCorreo(
        usuario.getEmail(),
        "¡Bienvenido de vuelta a StopOver! ",
        "Hola " + usuario.getNombre() + ",\n\n" +
        "Has iniciado sesión correctamente en StopOver.\n" +
        "¡Que tengas un excelente viaje!\n\n" +
        "Si no fuiste tú quien inició sesión, por favor contáctanos de inmediato.\n\n" +
        "— El equipo de StopOver"
);

notificacionService.enviarWhatsapp(
        usuario.getNumeroTelefono(),
        "Hola " + usuario.getNombre() + ", detectamos un inicio de sesión en tu cuenta de StopOver."
);

notificacionService.enviarSms(
        usuario.getNumeroTelefono(),
        "StopOver: se ha iniciado sesión en tu cuenta. Si no fuiste tú, contáctanos."
);

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        usuario.getEmail(),
                        usuario.getNombre(),
                        usuario.getRol().getNombre()
                )
        );
    }



    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest request) {

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe un usuario con ese email");
        }


        Rol rolUsuario = rolRepository.findByNombre("VIAJERO")
                .orElseThrow(() -> new RuntimeException("Rol VIAJERO no encontrado"));


        Usuario nuevo = new Usuario();

        nuevo.setNombre(request.getNombre());
        nuevo.setEmail(request.getEmail());
        nuevo.setNumeroTelefono(request.getTelefono());
        nuevo.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        nuevo.setRol(rolUsuario);


        usuarioRepository.save(nuevo);



        notificacionService.enviarWhatsapp(
                nuevo.getNumeroTelefono(),
                "¡Hola " + nuevo.getNombre() + "! Se ha registrado correctamente en StopOver. ¡Bienvenido!"
        );



        String token = jwtService.generarToken(
                nuevo.getEmail(),
                rolUsuario.getNombre()
        );


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new LoginResponse(
                        token,
                        nuevo.getEmail(),
                        nuevo.getNombre(),
                        rolUsuario.getNombre()
                ));
    }



    @PostMapping("/recuperar-password")
public ResponseEntity<?> recuperarPassword(@Valid @RequestBody RecuperarPasswordRequest request) {
    Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new NoSuchElementException("No existe una cuenta con ese email"));

    String codigo = String.format("%06d", new Random().nextInt(999999));

    usuario.setResetCode(codigo);
    usuario.setResetCodeExpiracion(LocalDateTime.now().plusMinutes(15));
    usuarioRepository.save(usuario);

    emailService.enviarCorreo(
            usuario.getEmail(),
            "Recupera tu contraseña - StopOver",
            "Tu código para recuperar tu contraseña es: " + codigo + ". Válido por 15 minutos."
    );

    return ResponseEntity.ok("Se envió un código de recuperación a tu correo");
}





    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {


        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> 
                    new NoSuchElementException("No existe una cuenta con ese email"));



        if (usuario.getResetCode() == null || 
            !usuario.getResetCode().equals(request.getCodigo())) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Código inválido");
        }



        if (usuario.getResetCodeExpiracion().isBefore(LocalDateTime.now())) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El código ya expiró, solicita uno nuevo");
        }



        usuario.setPasswordHash(
                passwordEncoder.encode(request.getNuevaPassword())
        );

        usuario.setResetCode(null);
        usuario.setResetCodeExpiracion(null);

        usuarioRepository.save(usuario);



        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }
}