package com.ticketing.system.service;

import com.ticketing.system.model.User;
import com.ticketing.system.model.dto.AuthResponse;
import com.ticketing.system.model.dto.LoginRequest;
import com.ticketing.system.model.dto.SignupRequest;
import com.ticketing.system.model.enums.UserRole;
import com.ticketing.system.repository.UserRepository;
import com.ticketing.system.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.AGENT);

        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email address"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }
}
