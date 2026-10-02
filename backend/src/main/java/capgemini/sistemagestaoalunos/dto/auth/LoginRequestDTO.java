package capgemini.sistemagestaoalunos.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginRequestDTO(

        @NotBlank(message = "O usuário é obrigatório")
        @Size(min = 8, message = "O usuário deve possuir no mínimo 8 caracteres" )
        String nomeUsuario,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 8, max = 20, message = "A senha deve possuir entre 8 e 20 caracteres")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "A senha deve conter pelo menos uma letra e um número")
        String senha
) {}
