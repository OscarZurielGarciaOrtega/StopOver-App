package com.stopover.backend.controller;

import com.stopover.backend.dto.ParadaResponse;
import com.stopover.backend.repository.ParadaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/paradas")
public class ParadaController {

    private final ParadaRepository paradaRepository;

    public ParadaController(ParadaRepository paradaRepository) {
        this.paradaRepository = paradaRepository;
    }

    @GetMapping
    public ResponseEntity<Page<ParadaResponse>> listarParadas(
            
            Pageable pageable,

           
            @RequestParam(required = false) String tipo
    ) {
        
        Page<com.stopover.backend.model.Parada> paginaDeParadas;

        if (tipo != null && !tipo.isBlank()) {
            
            paginaDeParadas = paradaRepository.findByTipo(tipo, pageable);
        } else {
            
            paginaDeParadas = paradaRepository.findAll(pageable);
        }

        
        Page<ParadaResponse> respuesta = paginaDeParadas.map(parada -> new ParadaResponse(
                parada.getId(),
                parada.getNombre(),
                parada.getLatitud(),
                parada.getLongitud(),
                parada.getTipo()
        ));

        return ResponseEntity.ok(respuesta);
    }
}