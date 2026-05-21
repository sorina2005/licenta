package ro.university.vehicledamagemanager.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.university.vehicledamagemanager.dto.AiResponseDTO;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiAnalysisService {
    private final String AI_URL = "http://localhost:8000/analyze";

    public AiResponseDTO getAnalysisFromPython(String text) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> body = new HashMap<>();
        body.put("text", text);
        return restTemplate.postForObject(AI_URL, body, AiResponseDTO.class);
    }
}