package com.example.laplumevirtuel.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.laplumevirtuel.document.OnboardingProfileDocument;

public interface OnboardingProfileRepository extends MongoRepository<OnboardingProfileDocument, String> {

    Optional<OnboardingProfileDocument> findByUserId(Long userId);
}
