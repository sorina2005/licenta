//package ro.university.vehicledamagemanager.service;
//
//import com.itextpdf.text.*;
//import com.itextpdf.text.pdf.PdfWriter;
//import org.springframework.stereotype.Service;
//import ro.university.vehicledamagemanager.model.DamageCase;
//
//import javax.swing.text.Document;
//import java.io.ByteArrayInputStream;
//import java.io.ByteArrayOutputStream;
//
//@Service
//public class PdfReportService {
//
//    public ByteArrayInputStream generateDamageReport(DamageCase damageCase) {
//        Document document = new Document();
//        ByteArrayOutputStream out = new ByteArrayOutputStream();
//
//        try {
//            PdfWriter.getInstance(document, out);
//            document.open();
//
//            Font font = FontFactory.getFont(FontFactory.COURIER, 16, BaseColor.BLACK);
//            Paragraph para = new Paragraph("Raport Evaluare Dauna #" + damageCase.getId(), font);
//            para.setAlignment(Element.ALIGN_CENTER);
//            document.add(para);
//            document.add(Chunk.NEWLINE);
//
//            document.add(new Paragraph("Vehicul: " + damageCase.getVehicle().getBrand() + " " + damageCase.getVehicle().getModel()));
//            document.add(new Paragraph("Numar Inmatriculare: " + damageCase.getVehicle().getPlateNumber()));
//            document.add(new Paragraph("Status Dosar: " + damageCase.getStatus()));
//
//            document.close();
//        } catch (DocumentException ex) {
//            ex.printStackTrace();
//        }
//
//        return new ByteArrayInputStream(out.toByteArray());
//    }
//}