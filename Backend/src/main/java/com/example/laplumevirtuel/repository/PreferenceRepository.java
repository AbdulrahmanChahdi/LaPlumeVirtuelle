package com.example.laplumevirtuel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.laplumevirtuel.entities.Preference;

public interface PreferenceRepository extends JpaRepository<Preference, Long>{

}
