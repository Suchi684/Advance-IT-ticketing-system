package com.ticketing.system.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "email.fetch.enabled", havingValue = "true")
public class EmailScheduler {

    private static final Logger log = LoggerFactory.getLogger(EmailScheduler.class);

    private final EmailFetcherService emailFetcherService;

    public EmailScheduler(EmailFetcherService emailFetcherService) {
        this.emailFetcherService = emailFetcherService;
    }

    @Scheduled(fixedDelayString = "${email.fetch.interval}")
    public void fetchEmails() {
        log.info("Starting scheduled email fetch...");
        emailFetcherService.fetchAndProcessEmails();
        log.info("Email fetch completed.");
    }
}
