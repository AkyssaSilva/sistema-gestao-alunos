package capgemini.sistemagestaoalunos.service;

import capgemini.sistemagestaoalunos.domain.aluno.Aluno;
import capgemini.sistemagestaoalunos.domain.aluno.FiltroStatusAluno;
import capgemini.sistemagestaoalunos.domain.aluno.StatusAluno;
import capgemini.sistemagestaoalunos.dto.aluno.AlunoResponseDTO;
import capgemini.sistemagestaoalunos.dto.aluno.CreateAlunoRequestDTO;
import capgemini.sistemagestaoalunos.dto.aluno.UpdateAlunoDTO;
import capgemini.sistemagestaoalunos.exception.ConflictException;
import capgemini.sistemagestaoalunos.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;

    @Transactional(readOnly = true)
    public Page<AlunoResponseDTO> listar(
        String nomeCompleto,
        String matricula,
        FiltroStatusAluno filtroStatus,
        Pageable pageable
    ) {
        boolean todos = filtroStatus == FiltroStatusAluno.TODOS;
        StatusAluno status = filtroStatus == FiltroStatusAluno.INATIVOS
            ? StatusAluno.INATIVO
            : StatusAluno.ATIVO;

        return alunoRepository.buscar(
            normalizarBusca(nomeCompleto),
            normalizarBusca(matricula),
            todos,
            status,
            pageable
        ).map(this::toResponse);
    }

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

    private Aluno buscarAlunoPorId(Long id) {
        return alunoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
    }

    @Transactional
    public AlunoResponseDTO inativar(Long id) {
        Aluno aluno = buscarAlunoPorId(id);
        aluno.inativar();

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

    @Transactional(readOnly = true)
    public AlunoResponseDTO exibirAlunoPorID(Long id) {
        Aluno aluno = buscarAlunoPorId(id);
        return toResponse(aluno);
    }

    public AlunoResponseDTO atualizarAluno(Long id, UpdateAlunoDTO requestDTO) {

        Aluno aluno = buscarAlunoPorId(id);

        String email = requestDTO.email().toLowerCase(Locale.ROOT);
        String telefone = requestDTO.telefone().replaceAll("\\D", "");

        if (!email.equals(aluno.getEmail())) {
            if (alunoRepository.existsByEmailIgnoreCase(email)) {
                throw new ConflictException("Email já cadastrado");
            }
        }

        aluno.setNomeCompleto(requestDTO.nomeCompleto());
        aluno.setEmail(email);
        aluno.setTelefone(telefone);
        aluno.setStatus(requestDTO.status());

        return toResponse(alunoRepository.save(aluno));
    }

    private String normalizarBusca(String valor) {
        if (valor == null || valor.trim().isEmpty()) {
            return null;
        }

        return valor.trim();
    }
}