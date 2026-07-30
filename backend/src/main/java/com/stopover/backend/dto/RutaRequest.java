package com.stopover.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class RutaRequest {

    @NotBlank(message = "El nombre de la ruta es obligatorio")
    private String nombre;

    @NotBlank(message = "El origen es obligatorio")
    private String origen;

    @NotBlank(message = "El destino es obligatorio")
    private String destino;

    @NotNull(message = "La fecha de salida es obligatoria")
    @Future(message = "La fecha de salida debe ser en el futuro")
    private LocalDate fechaSalida;

    // IDs de las paradas que el usuario eligió para su recorrido (la relación N:M)
    //@NotEmpty(message = "Debes seleccionar al menos una parada")
    private List<Long> paradaIds;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getOrigen() { return origen; }
    public void setOrigen(String origen) { this.origen = origen; }

    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }

public LocalDate getFechaSalida() { 
    return fechaSalida; 
}

public void setFechaSalida(LocalDate fechaSalida) { 
    this.fechaSalida = fechaSalida; 
}

    public List<Long> getParadaIds() { return paradaIds; }
    public void setParadaIds(List<Long> paradaIds) { this.paradaIds = paradaIds; }
}