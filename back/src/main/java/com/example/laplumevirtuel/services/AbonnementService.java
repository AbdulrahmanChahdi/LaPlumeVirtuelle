package com.example.laplumevirtuel.services;

import java.util.List;

import com.example.laplumevirtuel.entities.Abonnement;

	public interface AbonnementService {
		
		List<Abonnement>getAllAbonnements();
		
		Abonnement findAonnementsById(Long id);
		
		Abonnement saveAbonnement (Abonnement abonnement);
		
		void deleteAbonnementById(Long id);
}
