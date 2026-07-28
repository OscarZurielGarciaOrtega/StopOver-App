package com.stopover.backend.dto;

import java.math.BigDecimal;


public class ParadaResponse {

    private Long id;
    private String nombre;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private String tipo;

    
    public ParadaResponse(Long id, String nombre, BigDecimal latitud, BigDecimal longitud, String tipo) {
        this.id = id;
        this.nombre = nombre;
        this.latitud = latitud;
        this.longitud = longitud;
        this.tipo = tipo;
    }

    
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public BigDecimal getLatitud() { return latitud; }
    public BigDecimal getLongitud() { return longitud; }
    public String getTipo() { return tipo; }
}