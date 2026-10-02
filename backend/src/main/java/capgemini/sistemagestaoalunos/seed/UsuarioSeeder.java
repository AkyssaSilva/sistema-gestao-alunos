package capgemini.sistemagestaoalunos.seed;

import capgemini.sistemagestaoalunos.domain.usuario.Perfil;
import capgemini.sistemagestaoalunos.domain.usuario.Usuario;
import capgemini.sistemagestaoalunos.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Component
@AllArgsConstructor
public class UsuarioSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        Optional<Usuario> usuarioAdmin = usuarioRepository.findByNomeUsuario("Admin01");
        Optional<Usuario> usuarioLeitor = usuarioRepository.findByNomeUsuario("Usuario02");

        if (usuarioAdmin.isEmpty() ){
            usuarioRepository.save(new Usuario(
                    null,
                    "Admin01",
                    passwordEncoder.encode("senhaSegura123"),
                    Perfil.ADMIN
            ));
        }

        if (usuarioLeitor.isEmpty()){
            usuarioRepository.save(new Usuario(
                    null,
                    "Usuario02",
                    passwordEncoder.encode("senhaSegura321"),
                    Perfil.LEITOR
            ));
        }
    }
}
