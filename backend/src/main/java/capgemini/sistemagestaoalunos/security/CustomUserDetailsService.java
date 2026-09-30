package capgemini.sistemagestaoalunos.security;

import capgemini.sistemagestaoalunos.domain.usuario.Usuario;
import capgemini.sistemagestaoalunos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String nomeUsuario) throws UsernameNotFoundException {

        Optional<Usuario> usuario = repository.findByNomeUsuario(nomeUsuario);

        if (usuario.isEmpty()){
            throw new UsernameNotFoundException("Usuário não encontrado");
        }

        Usuario usuarioEncontrado = usuario.get();

        return User.builder()
                .username(usuarioEncontrado.getNomeUsuario())
                .password(usuarioEncontrado.getSenha())
                .roles(usuarioEncontrado.getPerfil().name())
                .build();
    }
}
