package ro.university.vehicledamagemanager.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.university.vehicledamagemanager.model.DamageReport;
import ro.university.vehicledamagemanager.model.RepairItem;
import ro.university.vehicledamagemanager.model.Vehicle;
import ro.university.vehicledamagemanager.repository.VehicleRepository;

import java.io.ByteArrayOutputStream;
import java.util.Optional;

@Service
public class PdfReportService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public byte[] generateDamageReport(DamageReport report) {
        com.itextpdf.text.Document document = new com.itextpdf.text.Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);

            Paragraph title = new Paragraph("FISA FINALA CONSTATARE DAUNA #" + report.getId(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("DATE IDENTIFICARE AUTOVEHICUL", boldFont));
            document.add(new Paragraph("--------------------------------------------------------------------------------------------------------", normalFont));

            // automatic search
            Vehicle v = null;
            if (report.getUser() != null && report.getLicensePlate() != null) {
                Optional<Vehicle> vehicleOptional = vehicleRepository.findByUserIdAndPlateNumber(
                        report.getUser().getId(),
                        report.getLicensePlate()
                );
                if (vehicleOptional.isPresent()) {
                    v = vehicleOptional.get();
                }
            }

            if (v != null) {
                document.add(new Paragraph("Marca / Model: " + v.getBrand() + " " + v.getModel(), normalFont));
                document.add(new Paragraph("Numar inmatriculare: " + v.getPlateNumber(), normalFont));
                document.add(new Paragraph("Serie sasiu (VIN): " + (v.getVin() != null ? v.getVin() : "Nespecificat"), normalFont));
            } else {
                document.add(new Paragraph("Numar inmatriculare: " + report.getLicensePlate(), normalFont));
                document.add(new Paragraph("Nota: Detaliile masinii nu au fost gasite in tabela de vehicule.", normalFont));
            }
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("DETALII DOSAR DAUNA", boldFont));
            document.add(new Paragraph("--------------------------------------------------------------------------------------------------------", normalFont));
            document.add(new Paragraph("Status final dosar: " + report.getStatus(), normalFont));
            document.add(new Paragraph("Descriere initiala avarii: " + (report.getDescription() != null ? report.getDescription() : "Fara specificatii"), normalFont));
            document.add(Chunk.NEWLINE);

            if (report.getRepairItems() != null && !report.getRepairItems().isEmpty()) {
                document.add(new Paragraph("DEVIZ REPARATIE FINAL (PIESE & MANOPERA)", boldFont));
                document.add(new Paragraph("--------------------------------------------------------------------------------------------------------", normalFont));
                document.add(Chunk.NEWLINE);

                PdfPTable table = new PdfPTable(5);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{3, 2, 1, 2, 2});

                table.addCell(new PdfPCell(new Phrase("Componenta", boldFont)));
                table.addCell(new PdfPCell(new Phrase("Pret piesa", boldFont)));
                table.addCell(new PdfPCell(new Phrase("Cantitate", boldFont)));
                table.addCell(new PdfPCell(new Phrase("Manopera", boldFont)));
                table.addCell(new PdfPCell(new Phrase("Total", boldFont)));

                double totalGeneral = 0;

                for (RepairItem item : report.getRepairItems()) {
                    double totalLinie = (item.getPartPrice() * item.getQuantity()) + item.getLaborPrice();
                    totalGeneral += totalLinie;

                    table.addCell(new Phrase(item.getComponentName(), normalFont));
                    table.addCell(new Phrase(String.format("%.2f RON", item.getPartPrice()), normalFont));
                    table.addCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
                    table.addCell(new Phrase(String.format("%.2f RON", item.getLaborPrice()), normalFont));
                    table.addCell(new Phrase(String.format("%.2f RON", totalLinie), boldFont));
                }

                document.add(table);
                document.add(Chunk.NEWLINE);

                Paragraph totalPara = new Paragraph("TOTAL GENERAL LICHIDARE DAUNA: " + String.format("%.2f RON", totalGeneral), boldFont);
                totalPara.setAlignment(Element.ALIGN_RIGHT);
                document.add(totalPara);
            }

            document.close();
        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return out.toByteArray();
    }
}