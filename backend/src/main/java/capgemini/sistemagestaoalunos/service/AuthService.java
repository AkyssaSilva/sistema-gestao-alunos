package capgemini.sistemagestaoalunos.service;

import capgemini.sistemagestaoalunos.domain.usuario.Usuario;
import capgemini.sistemagestaoalunos.dto.auth.LoginRequestDTO;
import capgemini.sistemagestaoalunos.dto.auth.LoginResponseDTO;
import capgemini.sistemagestaoalunos.repository.UsuarioRepository;
import capgemini.sistemagestaoalunos.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public LoginResponseDTO login(LoginRequestDTO requestDTO) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDTO.nomeUsuario(),
                        requestDTO.senha()
                )
        );

        Usuario usuario = usuarioRepository
                .findByNomeUsuario(requestDTO.nomeUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String token = jwtService.generateToken(usuario);

        return new LoginResponseDTO(token, "Bearer", usuario.getPerfil().name());
    }
}