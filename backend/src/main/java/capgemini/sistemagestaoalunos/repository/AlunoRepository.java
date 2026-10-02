package capgemini.sistemagestaoalunos.repository;

import capgemini.sistemagestaoalunos.domain.aluno.Aluno;
import capgemini.sistemagestaoalunos.domain.aluno.StatusAluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    boolean existsByCpf(String cpf);

    boolean existsByEmailIgnoreCase(String email);

        @Query(
            value = """
                select aluno from Aluno aluno
                where (:nomeCompleto is null or lower(aluno.nomeCompleto) like lower(concat('%', :nomeCompleto, '%')))
                  and (:matricula is null or upper(aluno.matricula) like upper(concat(:matricula, '%')))
                  and (:todos = true or aluno.status = :status)
                """,
            countQuery = """
                select count(aluno) from Aluno aluno
                where (:nomeCompleto is null or lower(aluno.nomeCompleto) like lower(concat('%', :nomeCompleto, '%')))
                  and (:matricula is null or upper(aluno.matricula) like upper(concat(:matricula, '%')))
                  and (:todos = true or aluno.status = :status)
                """
        )
        Page<Aluno> buscar(
            @Param("nomeCompleto") String nomeCompleto,
            @Param("matricula") String matricula,
            @Param("todos") boolean todos,
            @Param("status") StatusAluno status,
            Pageable pageable
        );
}