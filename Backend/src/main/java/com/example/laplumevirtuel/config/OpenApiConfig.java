package com.example.laplumevirtuel.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI myOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Serveur de développement");

        Contact contact = new Contact();
        contact.setEmail("contact@laplumevirtuelle.fr");
        contact.setName("La Plume Virtuelle");
        contact.setUrl("https://www.laplumevirtuelle.fr");

        License license = new License()
            .name("Apache 2.0")
            .url("http://www.apache.org/licenses/LICENSE-2.0.html");

        Info info = new Info()
            .title("API La Plume Virtuelle")
            .version("1.0")
            .contact(contact)
            .description("Cette API fournit tous les endpoints nécessaires pour La Plume Virtuelle.")
            .license(license);

        return new OpenAPI()
            .info(info)
            .servers(List.of(devServer));
    }
} 