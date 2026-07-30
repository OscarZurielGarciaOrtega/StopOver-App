package com.stopover.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class RutaResponse {

    private Long id;
    private String nombre;
    private String origen;
    private String destino;
    private LocalDate fechaSalida;
    private String creadoPor;
    private List<ParadaResponse> paradas;


    public RutaResponse(
            Long id,
            String nombre,
            String origen,
            String destino,
            LocalDate fechaSalida,
            String emailUsuario,
            List<ParadaResponse> paradas
    ) {
        this.id = id;
        this.nombre = nombre;
        this.origen = origen;
        this.destino = destino;
        this.fechaSalida = fechaSalida;
        this.creadoPor = emailUsuario;
        this.paradas = paradas;
    }


    public Long getId() { 
        return id; 
    }

    public String getNombre() { 
        return nombre; 
    }

    public String getOrigen() { 
        return origen; 
    }

    public String getDestino() { 
        return destino; 
    }

    public LocalDate getFechaSalida() {
        return fechaSalida;
    }

    public void setFechaSalida(LocalDate fechaSalida) {
        this.fechaSalida = fechaSalida;
    }

    public String getCreadoPor() { 
        return creadoPor; 
    }

    public List<ParadaResponse> getParadas() { 
        return paradas; 
    }
}