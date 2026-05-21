package ro.university.vehicledamagemanager.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class AiResponseDTO {
    private String intent;
    private double confidence;
    @JsonProperty("piese_detectate")
    private List<String> pieseDetectate;
    @JsonProperty("locatii")
    private List<String> locatii;
    private String response;
    @JsonProperty("has_number")
    private boolean hasNumber;
}