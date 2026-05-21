//package ro.university.vehicledamagemanager.controller;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//import ro.university.vehicledamagemanager.dto.AiResponseDTO;
//import ro.university.vehicledamagemanager.model.*;
//import ro.university.vehicledamagemanager.repository.*;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/damages")
//@CrossOrigin(origins = "http://localhost:5173")
//public class DamageController {
//
//    private final DamageCaseRepository caseRepository;
//    private final DamagePartRepository partRepository;
//    private final MessageRepository messageRepository;
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    public DamageController(DamageCaseRepository caseRepository,
//                            DamagePartRepository partRepository,
//                            MessageRepository messageRepository) {
//        this.caseRepository = caseRepository;
//        this.partRepository = partRepository;
//        this.messageRepository = messageRepository;
//    }
//
//    @PostMapping("/analyze")
//    public ResponseEntity<AiResponseDTO> analyze(@RequestBody Map<String, String> request) {
//        String userText = request.get("text");
//        String pythonUrl = "http://localhost:8000/analyze";
//
//        AiResponseDTO ai = restTemplate.postForObject(pythonUrl, request, AiResponseDTO.class);
//
//        if ("check_status".equals(ai.getIntent()) && ai.isHasNumber()) {
//            String numericId = userText.replaceAll("[^0-9]", "");
//            if (!numericId.isEmpty()) {
//                Optional<DamageCase> foundCase = caseRepository.findById(Integer.parseInt(numericId));
//                if (foundCase.isPresent()) {
//                    DamageCase dc = foundCase.get();
//                    String piese = dc.getParts().stream().map(DamagePart::getPartName).collect(Collectors.joining(", "));
//                    ai.setResponse("Dosar " + dc.getId() + " | Status: " + dc.getStatus() + " | Piese: " + piese);
//                } else {
//                    ai.setResponse("Nu am gasit dosarul cu ID-ul " + numericId);
//                }
//            }
//        }
//
//        saveMessage("user", userText, ai.getIntent(), ai.getConfidence());
//        saveMessage("bot", ai.getResponse(), ai.getIntent(), ai.getConfidence());
//
//        return ResponseEntity.ok(ai);
//    }
//
//    @PostMapping("/confirm")
//    public ResponseEntity<Map<String, String>> confirm(@RequestBody AiResponseDTO validatedData) {
//        if ("report_damage".equals(validatedData.getIntent())) {
//            DamageCase newCase = new DamageCase();
//            newCase.setUrgency(validatedData.getConfidence() > 0.8 ? "ridicata" : "normala");
//            newCase.setStatus("nou");
//
//            DamageCase savedCase = caseRepository.save(newCase);
//
//            for (String piesa : validatedData.getPieseDetectate()) {
//                DamagePart dp = new DamagePart();
//                dp.setPartName(piesa);
//                dp.setDamageCase(savedCase);
//                partRepository.save(dp);
//            }
//
//            String confirmationMessage = "Am salvat oficial dosarul cu numarul: " + savedCase.getId();
//            saveMessage("bot", confirmationMessage, "confirmation_success", 1.0);
//
//            return ResponseEntity.ok(Collections.singletonMap("message", confirmationMessage));
//        }
//
//        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Eroare la procesarea confirmarii."));
//    }
//
//    private void saveMessage(String sender, String text, String intent, Double conf) {
//        Message msg = new Message();
//        msg.setSender(sender);
//        msg.setText(text);
//        msg.setIntent(intent);
//        msg.setConfidence(conf);
//        msg.setConversationId(1);
//        messageRepository.save(msg);
//    }
//}