package com.project.util;

import com.project.auth.entity.Role;
import com.project.auth.entity.User;
import com.project.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SeedData implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .fullName("Admin Owner")
                    .email("vaibhav@gmail.com")
                    .password(passwordEncoder.encode("123456"))
                    .phone("1234567890")
                    .role(Role.OWNER)
                    .active(true)
                    .build();
            userRepository.save(admin);

            User tenant = User.builder()
                    .fullName("John Doe")
                    .email("ram@tenant.com")
                    .password(passwordEncoder.encode("123456"))
                    .phone("9876543210")
                    .role(Role.TENANT)
                    .active(true)
                    .build();
            userRepository.save(tenant);
        }
    }
}
