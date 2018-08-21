package com.carddex.sims2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SIMS2Application {

    public static void main(String[] args) {
        SpringApplication.run(SIMS2Application.class, args);
    }
}
