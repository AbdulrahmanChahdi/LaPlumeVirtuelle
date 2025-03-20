package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Abonnement;
import com.example.laplumevirtuel.repository.AbonnementRepository;

@Service
public class AbonnementServiceimpl  implements AbonnementService{
	
	@Autowired
	private AbonnementRepository abonnementRepository;
	
	@Override
	public List<Abonnement>getAllAbonnements(){
		return abonnementRepository.findAll();
	}
	@Override
	public Abonnement findAonnementsById(Long id){
		return abonnementRepository.findById(id).orElse(null);
	}
	@Override
	public Abonnement saveAbonnement (Abonnement abonnement) {
		return abonnementRepository.save(abonnement);
	}
	@Override
	public void deleteAbonnementById(Long id) {
		 abonnementRepository.deleteById(id);
	}
}
