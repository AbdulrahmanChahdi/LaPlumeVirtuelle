package com.example.laplumevirtuel;

import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.example.laplumevirtuel.repository.OnboardingProfileRepository;

@SpringBootApplication
@EnableJpaRepositories(
    basePackages = "com.example.laplumevirtuel.repository",
    excludeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = OnboardingProfileRepository.class))
@EnableMongoRepositories(basePackageClasses = OnboardingProfileRepository.class)
public class LaPlumeVirtuelApplication {

    public static void main(String[] args) {
        SpringApplication.run(LaPlumeVirtuelApplication.class, args);
    }

}
