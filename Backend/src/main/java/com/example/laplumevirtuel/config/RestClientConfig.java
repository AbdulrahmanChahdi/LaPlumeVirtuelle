package com.example.laplumevirtuel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for REST client beans
 */
@Configuration
public class RestClientConfig {

    /**
     * RestTemplate bean for external API calls
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
