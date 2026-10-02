package capgemini.sistemagestaoalunos.domain.aluno;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "alunos")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_completo", nullable = false, length = 120)
    private String nomeCompleto;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, length = 20)
    private String telefone;

    @Column(nullable = false, unique = true, updatable = false, length = 36)
    private String matricula;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusAluno status;

    public Aluno(String nomeCompleto, String email, String cpf, String telefone) {
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.cpf = cpf;
        this.telefone = telefone;
        this.matricula = "ALU-" + UUID.randomUUID().toString().replace("-", "").toUpperCase();
        this.status = StatusAluno.ATIVO;
    }

    public void inativar() {
        this.status = StatusAluno.INATIVO;
    }
}