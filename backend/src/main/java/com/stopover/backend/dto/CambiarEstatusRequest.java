package com.stopover.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CambiarEstatusRequest {

    @NotBlank
    private String estatus; // "Activo" o "Bloqueado"

    public String getEstatus() { return estatus; }
    public void setEstatus(String estatus) { this.estatus = estatus; }
}