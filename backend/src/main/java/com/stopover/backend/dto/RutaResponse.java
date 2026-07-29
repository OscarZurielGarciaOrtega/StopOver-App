package com.stopover.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RutaResponse {

    private Long id;
    private String nombre;
    private String origen;
    private String destino;
    private LocalDateTime fechaSalida;
    private String creadoPor; // email del usuario dueño de la ruta
    private List<ParadaResponse> paradas;

    public RutaResponse(Long id, String nombre, String origen, String destino,
                         LocalDateTime fechaSalida, String creadoPor, List<ParadaResponse> paradas) {
        this.id = id;
        this.nombre = nombre;
        this.origen = origen;
        this.destino = destino;
        this.fechaSalida = fechaSalida;
        this.creadoPor = creadoPor;
        this.paradas = paradas;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getOrigen() { return origen; }
    public String getDestino() { return destino; }
    public LocalDateTime getFechaSalida() { return fechaSalida; }
    public String getCreadoPor() { return creadoPor; }
    public List<ParadaResponse> getParadas() { return paradas; }
}