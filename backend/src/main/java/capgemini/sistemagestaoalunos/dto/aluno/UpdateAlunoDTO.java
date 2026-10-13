package capgemini.sistemagestaoalunos.dto.aluno;

import capgemini.sistemagestaoalunos.domain.aluno.StatusAluno;

public record UpdateAlunoDTO(
        String nomeCompleto,
        String email,
        String telefone,
        StatusAluno status
) {}
