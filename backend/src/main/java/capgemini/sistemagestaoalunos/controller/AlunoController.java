package capgemini.sistemagestaoalunos.controller;

import capgemini.sistemagestaoalunos.dto.aluno.AlunoResponseDTO;
import capgemini.sistemagestaoalunos.dto.aluno.CreateAlunoRequestDTO;
import capgemini.sistemagestaoalunos.service.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @PostMapping    
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<AlunoResponseDTO> cadastrar(@Valid @RequestBody CreateAlunoRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alunoService.cadastrar(request));
    }
}