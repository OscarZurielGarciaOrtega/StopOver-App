package com.stopover.backend.controller;

import com.stopover.backend.service.NotificacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @PostMapping("/sms-prueba")
    public ResponseEntity<String> probarSms(@RequestParam String numero) {
        notificacionService.enviarSms(numero, "Prueba de SMS desde StopOver");
        return ResponseEntity.ok("SMS enviado");
    }

    @PostMapping("/whatsapp-prueba")
    public ResponseEntity<String> probarWhatsapp(@RequestParam String numero) {
        notificacionService.enviarWhatsapp(numero, "Prueba de WhatsApp desde StopOver");
        return ResponseEntity.ok("WhatsApp enviado");
    }
}