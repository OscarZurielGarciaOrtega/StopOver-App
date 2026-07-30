package com.stopover.backend.controller;

import com.stopover.backend.dto.NegocioRequest;
import com.stopover.backend.dto.NegocioResponse;
import com.stopover.backend.model.Negocio;
import com.stopover.backend.model.Parada;
import com.stopover.backend.model.Ruta;
import com.stopover.backend.model.Usuario;
import com.stopover.backend.repository.NegocioRepository;
import com.stopover.backend.repository.ParadaRepository;
import com.stopover.backend.repository.RutaRepository;
import com.stopover.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;


import com.stopover.backend.dto.NegocioCercanoResponse;
import com.stopover.backend.util.GeoUtils;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class NegocioController {

    private final NegocioRepository negocioRepository;
    private final UsuarioRepository usuarioRepository;
    private final RutaRepository rutaRepository;
    private final ParadaRepository paradaRepository;

    public NegocioController(NegocioRepository negocioRepository, UsuarioRepository usuarioRepository,
                              RutaRepository rutaRepository, ParadaRepository paradaRepository) {
        this.negocioRepository = negocioRepository;
        this.usuarioRepository = usuarioRepository;
        this.rutaRepository = rutaRepository;
        this.paradaRepository = paradaRepository;
    }

    private NegocioResponse aResponse(Negocio n) {
        return new NegocioResponse(n.getId(), n.getNombre(), n.getCategoria(), n.getDescripcion(),
                n.getDireccion(), n.getLatitud(), n.getLongitud(), n.getEstatus());
    }

    // Solo el rol PROPIETARIO registra su negocio (queda en PENDIENTE)
    @PreAuthorize("hasRole('PROPIETARIO')")
    @PostMapping("/negocios/registrar")
    public ResponseEntity<NegocioResponse> registrar(@Valid @RequestBody NegocioRequest request, Authentication auth) {
        Usuario propietario = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        Negocio n = new Negocio();
        n.setNombre(request.getNombre());
        n.setCategoria(request.getCategoria());
        n.setDescripcion(request.getDescripcion());
        n.setDireccion(request.getDireccion());
        n.setLatitud(request.getLatitud());
        n.setLongitud(request.getLongitud());
        n.setEstatus("PENDIENTE");
        n.setPropietario(propietario);

        Negocio guardado = negocioRepository.save(n);
        return ResponseEntity.ok(aResponse(guardado));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/negocios/pendientes")
    public ResponseEntity<Page<NegocioResponse>> pendientes(Pageable pageable) {
        Page<NegocioResponse> respuesta = negocioRepository.findByEstatus("PENDIENTE", pageable)
                .map(this::aResponse);
        return ResponseEntity.ok(respuesta);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/negocios/{id}/aprobar")
    public ResponseEntity<NegocioResponse> aprobar(@PathVariable Long id) {
        Negocio n = negocioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Negocio no encontrado"));
        n.setEstatus("APROBADO");
        return ResponseEntity.ok(aResponse(negocioRepository.save(n)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/negocios/{id}/rechazar")
    public ResponseEntity<NegocioResponse> rechazar(@PathVariable Long id) {
        Negocio n = negocioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Negocio no encontrado"));
        n.setEstatus("RECHAZADO");
        return ResponseEntity.ok(aResponse(negocioRepository.save(n)));
    }

    
    @GetMapping("/negocios/aprobados")
    public ResponseEntity<Page<NegocioResponse>> aprobados(Pageable pageable) {
        Page<NegocioResponse> respuesta = negocioRepository.findByEstatus("APROBADO", pageable)
                .map(this::aResponse);
        return ResponseEntity.ok(respuesta);
    }

    
@GetMapping("/negocios/cercanos")
public ResponseEntity<List<NegocioCercanoResponse>> cercanos(
        @RequestParam BigDecimal lat,
        @RequestParam BigDecimal lng,
        @RequestParam(defaultValue = "10") double radioKm,
        @RequestParam(required = false) String categoria
) {
    List<Negocio> aprobados = negocioRepository.findAll().stream()
            .filter(n -> "APROBADO".equals(n.getEstatus()))
            .filter(n -> categoria == null || categoria.equalsIgnoreCase(n.getCategoria()))
            .collect(Collectors.toList());

    List<NegocioCercanoResponse> resultado = aprobados.stream()
            .map(n -> new NegocioCercanoResponse(
                    n.getId(), n.getNombre(), n.getCategoria(), n.getLatitud(), n.getLongitud(),
                    GeoUtils.calcularDistanciaKm(lat, lng, n.getLatitud(), n.getLongitud())
            ))
            .filter(n -> n.getDistanciaKm() <= radioKm)
            .sorted(Comparator.comparingDouble(NegocioCercanoResponse::getDistanciaKm))
            .collect(Collectors.toList());

    return ResponseEntity.ok(resultado);
}

    // Convierte un negocio APROBADO en una Parada real dentro de una Ruta existente
    @PostMapping("/negocios/{negocioId}/agregar-a-ruta/{rutaId}")
    public ResponseEntity<?> agregarARuta(@PathVariable Long negocioId, @PathVariable Long rutaId) {
        Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new NoSuchElementException("Negocio no encontrado"));

        if (!"APROBADO".equals(negocio.getEstatus())) {
            return ResponseEntity.badRequest().body("Solo se pueden agregar negocios aprobados");
        }

        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new NoSuchElementException("Ruta no encontrada"));

        Parada parada = new Parada();
        parada.setNombre(negocio.getNombre());
        parada.setLatitud(negocio.getLatitud());
        parada.setLongitud(negocio.getLongitud());
        parada.setTipo(negocio.getCategoria());
        Parada paradaGuardada = paradaRepository.save(parada);

        ruta.getParadas().add(paradaGuardada);
        rutaRepository.save(ruta);

        return ResponseEntity.ok("Negocio agregado como parada de la ruta");
    }
}