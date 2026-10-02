package capgemini.sistemagestaoalunos.controller;

import capgemini.sistemagestaoalunos.dto.auth.LoginRequestDTO;
import capgemini.sistemagestaoalunos.dto.auth.LoginResponseDTO;
import capgemini.sistemagestaoalunos.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO requestDTO) {

        LoginResponseDTO responseDTO = authService.login(requestDTO);

        return ResponseEntity.ok(responseDTO);
    }
}