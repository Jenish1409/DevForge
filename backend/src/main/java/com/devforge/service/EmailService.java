package com.devforge.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Slf4j
@Service
public class EmailService {

    private final HttpClient httpClient;
    private final String apiKey;
    private final String senderEmail;

    public EmailService(
            @Value("${brevo.api-key}") String apiKey,
            @Value("${brevo.sender-email}") String senderEmail) {
        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
        this.httpClient = HttpClient.newHttpClient();
    }

    /**
     * Sends a 6-digit OTP verification email to the given address.
     */
    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Your DevForge Verification Code";
        String htmlContent = buildOtpHtml(otp);
        sendEmail(toEmail, subject, htmlContent);
    }

    /**
     * Forwards a Contact Us submission to the admin email.
     */
    public void sendContactEmail(String adminEmail, String senderName, String senderEmailAddr, String message) {
        String subject = "DevForge Contact: " + senderName;
        String htmlContent = buildContactHtml(senderName, senderEmailAddr, message);
        sendEmail(adminEmail, subject, htmlContent);
    }

    private void sendEmail(String toEmail, String subject, String htmlContent) {
        // Escape JSON special chars in dynamic content
        String safeSubject = escapeJson(subject);
        String safeHtml = escapeJson(htmlContent);

        String jsonBody = """
                {
                  "sender": { "email": "%s", "name": "DevForge" },
                  "to": [{ "email": "%s" }],
                  "subject": "%s",
                  "htmlContent": "%s"
                }
                """.formatted(senderEmail, toEmail, safeSubject, safeHtml);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                .header("api-key", apiKey)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email sent successfully to {}", toEmail);
            } else {
                log.error("Brevo API error ({}): {}", response.statusCode(), response.body());
                throw new RuntimeException("Failed to send email via Brevo: " + response.statusCode());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Email sending interrupted", e);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String buildOtpHtml(String otp) {
        return """
                <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #fafafa; padding: 40px 20px;">
                  <div style="max-width: 420px; margin: 0 auto; text-align: center;">
                    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 40px 32px;">
                      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0; color: #fafafa;">DevForge</h1>
                      <p style="font-size: 13px; color: #71717a; margin: 0 0 28px 0;">API Mocking Platform</p>
                      <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 20px 0;">Your verification code is:</p>
                      <div style="background: #09090b; border: 1px solid #3f3f46; border-radius: 8px; padding: 16px; margin: 0 0 24px 0;">
                        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #34d399; font-family: monospace;">%s</span>
                      </div>
                      <p style="font-size: 12px; color: #52525b; margin: 0;">This code expires in 5 minutes. Do not share it.</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(otp);
    }

    private String buildContactHtml(String name, String email, String message) {
        return """
                <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
                  <h2 style="color: #18181b;">New Contact Message</h2>
                  <table style="border-collapse: collapse; width: 100%%;">
                    <tr><td style="padding: 8px; font-weight: bold; color: #3f3f46;">Name:</td><td style="padding: 8px;">%s</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold; color: #3f3f46;">Email:</td><td style="padding: 8px;">%s</td></tr>
                  </table>
                  <div style="margin-top: 16px; padding: 16px; background: #f4f4f5; border-radius: 8px;">
                    <p style="margin: 0; white-space: pre-wrap;">%s</p>
                  </div>
                </body>
                </html>
                """.formatted(escapeHtml(name), escapeHtml(email), escapeHtml(message));
    }

    private String escapeJson(String text) {
        if (text == null) return "";
        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
