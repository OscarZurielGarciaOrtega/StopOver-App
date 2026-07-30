package com.stopover.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ResetPasswordRequest {

    @NotBlank(message = "El email es obligatorio")
    private String email;

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$",
        message = "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial"
    )
    private String nuevaPassword;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNuevaPassword() { return nuevaPassword; }
    public void setNuevaPassword(String nuevaPassword) { this.nuevaPassword = nuevaPassword; }
}