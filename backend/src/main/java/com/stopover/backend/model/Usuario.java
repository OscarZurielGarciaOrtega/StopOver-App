package com.stopover.backend.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    // Guardamos el hash de BCrypt, nunca la contraseña real
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "numero_telefono")
    private String numeroTelefono;

    @Column(name = "reset_code")
    private String resetCode;

    @Column(name = "reset_code_expiracion")
    private LocalDateTime resetCodeExpiracion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @Column(nullable = false)
private String estatus = "Activo";

    public Usuario() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public String getNumeroTelefono() { return numeroTelefono; }
    public void setNumeroTelefono(String numeroTelefono) { this.numeroTelefono = numeroTelefono; }

    public String getResetCode() { return resetCode; }
    public void setResetCode(String resetCode) { this.resetCode = resetCode; }

    public LocalDateTime getResetCodeExpiracion() { return resetCodeExpiracion; }
    public void setResetCodeExpiracion(LocalDateTime resetCodeExpiracion) { this.resetCodeExpiracion = resetCodeExpiracion; }



public String getEstatus() {
    return estatus;
}

public void setEstatus(String estatus) {
    this.estatus = estatus;
}
}