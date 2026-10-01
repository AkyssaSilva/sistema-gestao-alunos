package capgemini.sistemagestaoalunos.service;

import capgemini.sistemagestaoalunos.dto.auth.LoginRequestDTO;
import capgemini.sistemagestaoalunos.dto.auth.LoginResponseDTO;
import capgemini.sistemagestaoalunos.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AuthServiceTest {

    @Test
    void usesAuthenticatedPrincipalWithoutLoadingUserAgain() {
        UserDetails principal = User.withUsername("admin01")
                .password("encoded")
                .roles("ADMIN")
                .build();
        AuthenticationManager authenticationManager = request ->
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        JwtService jwtService = new JwtService() {
            @Override
            public String generateToken(UserDetails userDetails) {
                assertEquals("admin01", userDetails.getUsername());
                return "signed-token";
            }
        };
        AuthService authService = new AuthService(authenticationManager, jwtService);

        LoginResponseDTO response = authService.login(new LoginRequestDTO("admin01", "password"));

        assertEquals("signed-token", response.token());
        assertEquals("Bearer", response.tipo());
        assertEquals("ADMIN", response.perfil());
    }
}