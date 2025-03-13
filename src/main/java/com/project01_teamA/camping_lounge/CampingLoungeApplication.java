package com.project01_teamA.camping_lounge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@EntityScan(basePackages = "com/project01_teamA/camping_lounge/entity")
public class CampingLoungeApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampingLoungeApplication.class, args);
	}

}
