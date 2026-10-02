package capgemini.sistemagestaoalunos.dto.aluno;

import capgemini.sistemagestaoalunos.domain.aluno.StatusAluno;
import io.swagger.v3.oas.annotations.media.Schema;

public record AlunoResponseDTO(
        Long id,
        String nomeCompleto,
        String email,
        String cpf,
        @Schema(example = "81999998888")
        String telefone,
        String matricula,
        StatusAluno status
) {
}