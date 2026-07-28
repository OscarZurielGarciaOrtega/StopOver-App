package com.stopover.backend.exception;

import com.stopover.backend.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.NoSuchElementException;


@RestControllerAdvice
public class GlobalExceptionHandler {

    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> manejarValidacion(MethodArgumentNotValidException ex) {

        
        List<String> mensajes = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .toList();

        ErrorResponse body = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(), // 400
                "Datos inválidos",
                mensajes
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> manejarNoEncontrado(NoSuchElementException ex) {
        ErrorResponse body = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(), // 404
                "Recurso no encontrado",
                List.of(ex.getMessage() != null ? ex.getMessage() : "El recurso solicitado no existe")
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> manejarGeneral(Exception ex) {
        ErrorResponse body = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(), // 500
                "Error interno del servidor",
                List.of("Ocurrió un error inesperado")
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}