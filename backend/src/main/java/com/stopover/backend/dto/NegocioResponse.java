package com.stopover.backend.dto;

import java.math.BigDecimal;

public class NegocioResponse {
    private Long id;
    private String nombre;
    private String categoria;
    private String descripcion;
    private String direccion;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private String estatus;

    public NegocioResponse(Long id, String nombre, String categoria, String descripcion,
                            String direccion, BigDecimal latitud, BigDecimal longitud, String estatus) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.direccion = direccion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.estatus = estatus;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCategoria() { return categoria; }
    public String getDescripcion() { return descripcion; }
    public String getDireccion() { return direccion; }
    public BigDecimal getLatitud() { return latitud; }
    public BigDecimal getLongitud() { return longitud; }
    public String getEstatus() { return estatus; }
}