package capgemini.sistemagestaoalunos.service;

import capgemini.sistemagestaoalunos.domain.aluno.Aluno;
import capgemini.sistemagestaoalunos.dto.aluno.AlunoResponseDTO;
import capgemini.sistemagestaoalunos.dto.aluno.CreateAlunoRequestDTO;
import capgemini.sistemagestaoalunos.exception.ConflictException;
import capgemini.sistemagestaoalunos.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;

    @Transactional
    public AlunoResponseDTO cadastrar(CreateAlunoRequestDTO request) {
        String email = request.email().toLowerCase(Locale.ROOT);
        String cpf = request.cpf().replaceAll("\\D", "");
        String telefone = request.telefone().replaceAll("\\D", "");

        if (alunoRepository.existsByCpf(cpf)) {
            throw new ConflictException("CPF já cadastrado");
        }

        if (alunoRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email já cadastrado");
        }

        Aluno aluno = new Aluno(
                request.nomeCompleto(),
                email,
                cpf,
                telefone
        );

        return toResponse(alunoRepository.save(aluno));
    }

    private AlunoResponseDTO toResponse(Aluno aluno) {
        return new AlunoResponseDTO(
                aluno.getId(),
                aluno.getNomeCompleto(),
                aluno.getEmail(),
                aluno.getCpf(),
                aluno.getTelefone(),
                aluno.getMatricula(),
                aluno.getStatus()
        );
    }
}