package capgemini.sistemagestaoalunos.repository;

import capgemini.sistemagestaoalunos.domain.aluno.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    boolean existsByCpf(String cpf);

    boolean existsByEmailIgnoreCase(String email);
}