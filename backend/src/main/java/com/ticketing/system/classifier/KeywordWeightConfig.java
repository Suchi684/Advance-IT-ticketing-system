package com.ticketing.system.classifier;

import com.ticketing.system.model.enums.Category;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class KeywordWeightConfig {

    private final Map<Category, Map<String, Double>> categoryKeywords = new HashMap<>();

    public KeywordWeightConfig() {
        categoryKeywords.put(Category.RETURN, buildReturnKeywords());
        categoryKeywords.put(Category.EXCHANGE, buildExchangeKeywords());
        categoryKeywords.put(Category.REFUND, buildRefundKeywords());
        categoryKeywords.put(Category.LOW_QUALITY, buildLowQualityKeywords());
        categoryKeywords.put(Category.SHIPPING, buildShippingKeywords());
        categoryKeywords.put(Category.ORDER_ISSUE, buildOrderIssueKeywords());
    }

    public Map<Category, Map<String, Double>> getCategoryKeywords() {
        return categoryKeywords;
    }

    private Map<String, Double> buildReturnKeywords() {
        Map<String, Double> kw = new HashMap<>();
        kw.put("return", 5.0);
        kw.put("rma", 5.0);
        kw.put("send back", 4.0);
        kw.put("return label", 4.5);
        kw.put("return policy", 4.0);
        kw.put("return request", 4.5);
        kw.put("wrong item", 3.5);
        kw.put("unwanted", 3.0);
        kw.put("return shipping", 4.0);
        kw.put("want to return", 5.0);
        kw.put("returning", 4.5);
        kw.put("return order", 4.5);
        kw.put("pickup", 3.0);
        return kw;
    }

    private Map<String, Double> buildExchangeKeywords() {
        Map<String, Double> kw = new HashMap<>();
        kw.put("exchange", 5.0);
        kw.put("swap", 4.0);
        kw.put("replace", 4.0);
        kw.put("different size", 4.5);
        kw.put("different color", 4.0);
        kw.put("wrong size", 4.0);
        kw.put("wrong color", 4.0);
        kw.put("trade", 3.0);
        kw.put("substitute", 3.0);
        kw.put("change order", 3.5);
        kw.put("replacement", 4.5);
        kw.put("size exchange", 5.0);
        return kw;
    }

    private Map<String, Double> buildRefundKeywords() {
        Map<String, Double> kw = new HashMap<>();
        kw.put("refund", 5.0);
        kw.put("money back", 5.0);
        kw.put("reimburse", 4.5);
        kw.put("credit", 3.5);
        kw.put("charge back", 4.0);
        kw.put("chargeback", 4.0);
        kw.put("overcharged", 4.5);
        kw.put("double charged", 5.0);
        kw.put("billing", 3.0);
        kw.put("payment issue", 4.0);
        kw.put("dispute", 3.5);
        kw.put("refund request", 5.0);
        kw.put("get my money", 5.0);
        return kw;
    }

    private Map<String, Double> buildLowQualityKeywords() {
        Map<String, Double> kw = new HashMap<>();
        kw.put("quality", 4.0);
        kw.put("poor quality", 5.0);
        kw.put("broken", 4.0);
        kw.put("damaged", 4.0);
        kw.put("defect", 4.5);
        kw.put("defective", 4.5);
        kw.put("cheap", 3.0);
        kw.put("flimsy", 4.0);
        kw.put("not as described", 4.0);
        kw.put("falling apart", 4.5);
        kw.put("low quality", 5.0);
        kw.put("disappointed", 2.5);
        kw.put("terrible", 3.5);
        kw.put("horrible", 3.5);
        kw.put("worst", 3.5);
        kw.put("bad quality", 5.0);
        kw.put("poorly made", 4.5);
        kw.put("not working", 4.0);
        kw.put("malfunction", 4.0);
        return kw;
    }

    private Map<String, Double> buildShippingKeywords() {
        Map<String, Double> kw = new HashMap<>();
        kw.put("shipping", 4.5);
        kw.put("delivery", 4.5);
        kw.put("tracking", 4.5);
        kw.put("transit", 4.0);
        kw.put("carrier", 3.5);
        kw.put("shipped", 3.5);
        kw.put("package", 3.0);
        kw.put("lost package", 5.0);
        kw.put("delayed", 4.0);
        kw.put("not delivered", 5.0);
        kw.put("estimated delivery", 3.5);
        kw.put("fedex", 3.0);
        kw.put("ups", 3.0);
        kw.put("usps", 3.0);
        kw.put("shipping delay", 5.0);
        kw.put("where is my order", 4.5);
        kw.put("track my order", 4.5);
        kw.put("not received", 5.0);
        return kw;
    }

    private Map<String, Double> buildOrderIssueKeywords() {
        Map<String, Double> kw = new HashMap<>();
        kw.put("cancel order", 5.0);
        kw.put("wrong order", 5.0);
        kw.put("order number", 3.0);
        kw.put("order status", 4.0);
        kw.put("missing item", 4.5);
        kw.put("incomplete order", 5.0);
        kw.put("duplicate order", 4.5);
        kw.put("modify order", 4.0);
        kw.put("cancellation", 4.5);
        kw.put("cancel", 4.0);
        kw.put("wrong product", 4.5);
        kw.put("missing", 3.5);
        kw.put("incorrect", 3.5);
        kw.put("order problem", 4.5);
        return kw;
    }
}
