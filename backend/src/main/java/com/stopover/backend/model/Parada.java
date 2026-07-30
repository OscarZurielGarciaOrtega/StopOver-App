package com.stopover.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "paradas")
public class Parada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private BigDecimal latitud;

    @Column(nullable = false)
    private BigDecimal longitud;

    @Column(nullable = false)
    private String tipo; // CAFETERIA, MIRADOR, GASOLINERA, RESTAURANTE, OTRO

    
    @ManyToMany(mappedBy = "paradas", fetch = FetchType.LAZY)
    private Set<Ruta> rutas = new HashSet<>();

    
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "propietario_id")
private Usuario propietario;



public Usuario getPropietario() { return propietario; }
public void setPropietario(Usuario propietario) { this.propietario = propietario; }

    public Parada() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public BigDecimal getLatitud() { return latitud; }
    public void setLatitud(BigDecimal latitud) { this.latitud = latitud; }

    public BigDecimal getLongitud() { return longitud; }
    public void setLongitud(BigDecimal longitud) { this.longitud = longitud; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Set<Ruta> getRutas() { return rutas; }
    public void setRutas(Set<Ruta> rutas) { this.rutas = rutas; }
}