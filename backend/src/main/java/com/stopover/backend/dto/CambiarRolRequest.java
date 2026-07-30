package com.stopover.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CambiarRolRequest {

    @NotBlank
    private String rol; // "ADMIN", "VIAJERO", "PROPIETARIO"

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}