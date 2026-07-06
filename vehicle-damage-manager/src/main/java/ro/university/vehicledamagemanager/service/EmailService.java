package ro.university.vehicledamagemanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendStatusEmail(String toEmail, Long reportId, String licensePlate, String newStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("adresa_ta_de_email@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Actualizare status dosar dauna #" + reportId);
        
        String emailContent = "Stimate client,\n\n" +
                "Va informam ca statusul dosarului dumneavoastra cu ID-ul #" + reportId + 
                " (numar inmatriculare: " + licensePlate + ") a fost modificat.\n" +
                "Noul status al dosarului este: " + newStatus + ".\n\n" +
                "Puteti accesa platforma pentru a vizualiza detaliile actualizate.\n\n" +
                "O zi buna,\n" +
                "Echipa Vehicle Damage Manager";
                
        message.setText(emailContent);
        mailSender.send(message);
    }
}