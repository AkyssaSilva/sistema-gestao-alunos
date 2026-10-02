package capgemini.sistemagestaoalunos.dto.aluno;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.validator.constraints.br.CPF;

public record CreateAlunoRequestDTO(

        @NotBlank(message = "O nome completo é obrigatório")
        @Size(min = 3, max = 120, message = "O nome completo deve possuir entre 3 e 120 caracteres")
        String nomeCompleto,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Informe um email válido")
        @Size(max = 254, message = "O email deve possuir no máximo 254 caracteres")
        String email,

        @NotBlank(message = "O CPF é obrigatório")
        @CPF(message = "Informe um CPF válido")
        String cpf,

        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(
            regexp = "^(?:[1-9][0-9](?:9[0-9]{8}|[2-5][0-9]{7})|\\([1-9][0-9]\\) ?(?:9[0-9]{4}|[2-5][0-9]{3})-?[0-9]{4})$",
            message = "Informe um telefone válido"
        )
        @Schema(example = "81999998888")
        String telefone
) {
    public CreateAlunoRequestDTO {
        nomeCompleto = trim(nomeCompleto);
        email = trim(email);
        cpf = trim(cpf);
        telefone = trim(telefone);
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }
}