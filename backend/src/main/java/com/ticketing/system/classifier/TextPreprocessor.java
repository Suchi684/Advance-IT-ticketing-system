package com.ticketing.system.classifier;

import org.springframework.stereotype.Component;
import java.util.*;
import java.util.regex.Pattern;

@Component
public class TextPreprocessor {

    private static final Pattern HTML_TAG = Pattern.compile("<[^>]+>");
    private static final Pattern SPECIAL_CHARS = Pattern.compile("[^a-zA-Z0-9\\s]");
    private static final Set<String> STOP_WORDS = Set.of(
        "the", "is", "at", "which", "on", "a", "an", "and", "or", "but",
        "in", "with", "to", "for", "of", "not", "no", "can", "had", "have",
        "has", "was", "were", "been", "be", "do", "does", "did", "will",
        "would", "could", "should", "may", "might", "shall", "this", "that",
        "these", "those", "i", "me", "my", "we", "our", "you", "your",
        "he", "she", "it", "they", "them", "their", "its", "am", "are",
        "from", "up", "about", "into", "through", "during", "before", "after",
        "above", "below", "between", "out", "off", "over", "under", "again",
        "then", "once", "here", "there", "when", "where", "why", "how",
        "all", "each", "every", "both", "few", "more", "most", "other",
        "some", "such", "only", "own", "same", "so", "than", "too", "very",
        "just", "because", "as", "until", "while", "if", "hi", "hello",
        "dear", "thanks", "thank", "please", "regards", "sincerely"
    );

    public String preprocess(String text) {
        if (text == null || text.isEmpty()) return "";
        String cleaned = HTML_TAG.matcher(text).replaceAll(" ");
        cleaned = cleaned.toLowerCase();
        cleaned = SPECIAL_CHARS.matcher(cleaned).replaceAll(" ");
        cleaned = cleaned.replaceAll("\\s+", " ").trim();
        return cleaned;
    }

    public List<String> tokenize(String text) {
        String preprocessed = preprocess(text);
        if (preprocessed.isEmpty()) return Collections.emptyList();

        List<String> tokens = new ArrayList<>();
        for (String word : preprocessed.split("\\s+")) {
            if (!STOP_WORDS.contains(word) && word.length() > 1) {
                tokens.add(word);
            }
        }
        return tokens;
    }

    public String getCombinedText(String subject, String body) {
        StringBuilder sb = new StringBuilder();
        if (subject != null) sb.append(subject).append(" ");
        if (body != null) sb.append(body);
        return sb.toString();
    }
}
