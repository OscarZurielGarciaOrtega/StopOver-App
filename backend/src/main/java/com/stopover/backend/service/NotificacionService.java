package com.stopover.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NotificacionService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String numeroSms;

    @Value("${twilio.whatsapp.number}")
    private String numeroWhatsapp;

    @PostConstruct
    public void inicializar() {
        Twilio.init(accountSid, authToken);
    }

    public void enviarSms(String numeroDestino, String mensaje) {

    if (numeroDestino == null || numeroDestino.trim().isEmpty()) {
        System.err.println("Número vacío");
        return;
    }

    String destino = numeroDestino.trim();

    if (!destino.startsWith("+")) {
        destino = "+52" + destino;
    }

    System.out.println("==================================");
    System.out.println("Enviando SMS");
    System.out.println("Destino: " + destino);
    System.out.println("Origen : " + numeroSms);
    System.out.println("==================================");

    Message.creator(
            new PhoneNumber(destino),
            new PhoneNumber(numeroSms),
            mensaje
    ).create();
}

   public void enviarWhatsapp(String numeroDestino, String mensaje) {
    String numeroFormateadoWhatsapp = formatearParaWhatsapp(numeroDestino);
    Message.creator(
            new PhoneNumber("whatsapp:" + numeroFormateadoWhatsapp),
            new PhoneNumber(numeroWhatsapp),
            mensaje
    ).create();
}

private String formatearParaWhatsapp(String numero) {
    
    if (numero.startsWith("+52") && !numero.startsWith("+521")) {
        return "+521" + numero.substring(3);
    }
    return numero;
}
}