package com.stopover.backend.dto;

import java.time.LocalDateTime;
import java.util.List;


public class ErrorResponse {

    
    private int status;

    private String error;

    
    private List<String> mensajes;

    
    private LocalDateTime timestamp;

    
    public ErrorResponse(int status, String error, List<String> mensajes) {
        this.status = status;
        this.error = error;
        this.mensajes = mensajes;
        this.timestamp = LocalDateTime.now(); 
    }

    
    public int getStatus() { return status; }
    public String getError() { return error; }
    public List<String> getMensajes() { return mensajes; }
    public LocalDateTime getTimestamp() { return timestamp; }
}