package capgemini.sistemagestaoalunos.dto.auth;

public record LoginResponseDTO(
        String token,
        String tipo,
        String perfil
) {}
