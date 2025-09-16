package com.mytrip.airline.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class PaymentService {

    public Object makePayment(Long passengerId, Long bookingId, Object paymentData) {
        Map<String, Object> payment = new HashMap<>();
        payment.put("paymentId", System.currentTimeMillis());
        payment.put("passengerId", passengerId);
        payment.put("bookingId", bookingId);
        payment.put("paymentData", paymentData);
        payment.put("status", "completed");
        payment.put("amount", new BigDecimal("250.00"));
        payment.put("currency", "USD");
        payment.put("processedAt", LocalDateTime.now());
        payment.put("transactionRef", "TXN_" + System.currentTimeMillis());
        return payment;
    }

    public Object processRefund(Long paymentId, BigDecimal amount) {
        Map<String, Object> refund = new HashMap<>();
        refund.put("refundId", System.currentTimeMillis());
        refund.put("paymentId", paymentId);
        refund.put("amount", amount);
        refund.put("status", "processed");
        refund.put("processedAt", LocalDateTime.now());
        refund.put("refundRef", "REF_" + System.currentTimeMillis());
        return refund;
    }

    public Object getPaymentHistory(Long passengerId) {
        return List.of(
            Map.of(
                "paymentId", 3001L,
                "bookingId", 1001L,
                "amount", new BigDecimal("250.00"),
                "status", "completed",
                "date", LocalDateTime.now().minusDays(10)
            ),
            Map.of(
                "paymentId", 3002L,
                "bookingId", 1002L,
                "amount", new BigDecimal("180.00"),
                "status", "pending",
                "date", LocalDateTime.now().minusDays(2)
            )
        );
    }

    public Object getPaymentStatus(Long paymentId) {
        Map<String, Object> status = new HashMap<>();
        status.put("paymentId", paymentId);
        status.put("status", "completed");
        status.put("amount", new BigDecimal("250.00"));
        status.put("processedAt", LocalDateTime.now().minusHours(1));
        return status;
    }
}