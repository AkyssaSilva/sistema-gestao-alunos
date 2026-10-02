package capgemini.sistemagestaoalunos.service;

import capgemini.sistemagestaoalunos.dto.auth.LoginRequestDTO;
import capgemini.sistemagestaoalunos.dto.auth.LoginResponseDTO;
import capgemini.sistemagestaoalunos.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginResponseDTO login(LoginRequestDTO requestDTO) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDTO.nomeUsuario(),
                        requestDTO.senha()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String perfil = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring("ROLE_".length()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Perfil do usuário autenticado não encontrado"));

        String token = jwtService.generateToken(userDetails);

        return new LoginResponseDTO(token, "Bearer", perfil);
    }
}