package com.ticketing.system.classifier;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailClassifierService {

    private static final Logger log = LoggerFactory.getLogger(EmailClassifierService.class);
    private static final double THRESHOLD = 0.05;
    private static final double SUBJECT_MULTIPLIER = 2.0;

    private final TextPreprocessor preprocessor;
    private final KeywordWeightConfig keywordConfig;

    public EmailClassifierService(TextPreprocessor preprocessor, KeywordWeightConfig keywordConfig) {
        this.preprocessor = preprocessor;
        this.keywordConfig = keywordConfig;
    }

    public String classify(String subject, String body) {
        String processedSubject = preprocessor.preprocess(subject);
        String processedBody = preprocessor.preprocess(body);
        String combinedText = processedSubject + " " + processedBody;

        int totalWords = combinedText.split("\\s+").length;
        if (totalWords == 0) return "GENERAL";

        Map<String, Double> scores = new HashMap<>();

        for (Map.Entry<String, Map<String, Double>> entry : keywordConfig.getCategoryKeywords().entrySet()) {
            String category = entry.getKey();
            Map<String, Double> keywords = entry.getValue();
            double score = 0.0;

            for (Map.Entry<String, Double> kwEntry : keywords.entrySet()) {
                String keyword = kwEntry.getKey().toLowerCase();
                double weight = kwEntry.getValue();

                int subjectCount = countOccurrences(processedSubject, keyword);
                score += subjectCount * weight * SUBJECT_MULTIPLIER;

                int bodyCount = countOccurrences(processedBody, keyword);
                score += bodyCount * weight;
            }

            double normalizedScore = score / totalWords;
            scores.put(category, normalizedScore);
        }

        String bestCategory = "GENERAL";
        double bestScore = THRESHOLD;

        for (Map.Entry<String, Double> entry : scores.entrySet()) {
            if (entry.getValue() > bestScore) {
                bestScore = entry.getValue();
                bestCategory = entry.getKey();
            }
        }

        log.info("Email classified as {} (score: {}) - Subject: {}",
                bestCategory, bestScore, subject != null ? subject.substring(0, Math.min(50, subject.length())) : "N/A");

        return bestCategory;
    }

    private int countOccurrences(String text, String keyword) {
        if (text == null || text.isEmpty() || keyword == null || keyword.isEmpty()) return 0;

        int count = 0;
        int index = 0;
        while ((index = text.indexOf(keyword, index)) != -1) {
            count++;
            index += keyword.length();
        }
        return count;
    }
}
