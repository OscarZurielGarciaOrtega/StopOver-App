package com.stopover.backend.dto;

import java.math.BigDecimal;

public class NegocioCercanoResponse {
    private Long id;
    private String nombre;
    private String categoria;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private double distanciaKm;

    public NegocioCercanoResponse(Long id, String nombre, String categoria,
                                   BigDecimal latitud, BigDecimal longitud, double distanciaKm) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.latitud = latitud;
        this.longitud = longitud;
        this.distanciaKm = distanciaKm;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCategoria() { return categoria; }
    public BigDecimal getLatitud() { return latitud; }
    public BigDecimal getLongitud() { return longitud; }
    public double getDistanciaKm() { return distanciaKm; }
}