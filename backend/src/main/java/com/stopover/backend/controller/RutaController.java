package com.stopover.backend.controller;

import com.stopover.backend.dto.ParadaResponse;
import com.stopover.backend.dto.RutaRequest;
import com.stopover.backend.dto.RutaResponse;
import com.stopover.backend.model.Parada;
import com.stopover.backend.model.Ruta;
import com.stopover.backend.model.Usuario;
import com.stopover.backend.repository.ParadaRepository;
import com.stopover.backend.repository.RutaRepository;
import com.stopover.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rutas")
public class RutaController {

    private final RutaRepository rutaRepository;
    private final ParadaRepository paradaRepository;
    private final UsuarioRepository usuarioRepository;

    public RutaController(RutaRepository rutaRepository, ParadaRepository paradaRepository,
                           UsuarioRepository usuarioRepository) {
        this.rutaRepository = rutaRepository;
        this.paradaRepository = paradaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    
    private RutaResponse aResponse(Ruta ruta) {
        List<ParadaResponse> paradasDto = ruta.getParadas().stream()
                .map(p -> new ParadaResponse(p.getId(), p.getNombre(), p.getLatitud(), p.getLongitud(), p.getTipo()))
                .collect(Collectors.toList());

        return new RutaResponse(
                ruta.getId(), ruta.getNombre(), ruta.getOrigen(), ruta.getDestino(),
                ruta.getFechaSalida(), ruta.getUsuario().getEmail(), paradasDto
        );
    }

    
    @PostMapping
    public ResponseEntity<RutaResponse> crear(@Valid @RequestBody RutaRequest request, Authentication auth) {
        // Authentication.getName() regresa el email que JwtAuthFilter guardó como "subject"
        Usuario usuario = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        Set<Parada> paradas = new HashSet<>();

if (request.getParadaIds() != null && !request.getParadaIds().isEmpty()) {
    paradas = new HashSet<>(paradaRepository.findAllById(request.getParadaIds()));
}

        Ruta ruta = new Ruta();
        ruta.setNombre(request.getNombre());
        ruta.setOrigen(request.getOrigen());
        ruta.setDestino(request.getDestino());
        ruta.setFechaSalida(request.getFechaSalida());
        ruta.setUsuario(usuario);
        ruta.setParadas(paradas);

        Ruta guardada = rutaRepository.save(ruta);
        return ResponseEntity.ok(aResponse(guardada));
    }

    
    @GetMapping
    public ResponseEntity<Page<RutaResponse>> listarMisRutas(Authentication auth, Pageable pageable) {
        Usuario usuario = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        Page<RutaResponse> respuesta = rutaRepository.findByUsuarioId(usuario.getId(), pageable)
                .map(this::aResponse);

        return ResponseEntity.ok(respuesta);
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<RutaResponse> verUna(@PathVariable Long id) {
        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ruta no encontrada"));
        return ResponseEntity.ok(aResponse(ruta));
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<RutaResponse> actualizar(@PathVariable Long id, @Valid @RequestBody RutaRequest request) {
        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ruta no encontrada"));

        Set<Parada> paradas = new HashSet<>();

if (request.getParadaIds() != null && !request.getParadaIds().isEmpty()) {
    paradas = new HashSet<>(paradaRepository.findAllById(request.getParadaIds()));
}

        ruta.setNombre(request.getNombre());
        ruta.setOrigen(request.getOrigen());
        ruta.setDestino(request.getDestino());
        ruta.setFechaSalida(request.getFechaSalida());
        ruta.setParadas(paradas);

        Ruta actualizada = rutaRepository.save(ruta);
        return ResponseEntity.ok(aResponse(actualizada));
    }

    // BORRAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (!rutaRepository.existsById(id)) {
            throw new NoSuchElementException("Ruta no encontrada");
        }
        rutaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}