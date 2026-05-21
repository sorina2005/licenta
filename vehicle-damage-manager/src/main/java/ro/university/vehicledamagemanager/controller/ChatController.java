//package ro.university.vehicledamagemanager.controller;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import ro.university.vehicledamagemanager.model.Message;
//import ro.university.vehicledamagemanager.repository.MessageRepository;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/chat")
//@CrossOrigin(origins = "http://localhost:5173")
//public class ChatController {
//
//    private final MessageRepository messageRepository;
//
//    public ChatController(MessageRepository messageRepository) {
//        this.messageRepository = messageRepository;
//    }
//
//    @GetMapping("/history/{userId}")
//    public ResponseEntity<List<Message>> getChatHistory(@PathVariable Long userId) {
//        return ResponseEntity.ok(messageRepository.findByUserId(userId));
//    }
//
//    @PostMapping("/send")
//    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
//        // Salvam mesajul utilizatorului
//        Message savedUserMessage = messageRepository.save(message);
//
//        // Simulam un raspuns automat de la AI
//        Message botResponse = new Message();
//        botResponse.setContent("Sistemul AI analizeaza solicitarea ta pentru vehiculul selectat.");
//        botResponse.setFromBot(true);
//        botResponse.setUser(message.getUser());
//        messageRepository.save(botResponse);
//
//        return ResponseEntity.ok(botResponse);
//    }
//}