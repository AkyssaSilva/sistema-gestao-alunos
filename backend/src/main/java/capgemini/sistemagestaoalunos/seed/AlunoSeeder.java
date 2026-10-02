package capgemini.sistemagestaoalunos.seed;

import capgemini.sistemagestaoalunos.domain.aluno.Aluno;
import capgemini.sistemagestaoalunos.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AlunoSeeder implements CommandLineRunner {

    private final AlunoRepository alunoRepository;

    @Override
    public void run(String... args) {
        for (int numero = 1; numero <= 25; numero++) {
            String sufixo = String.format("%02d", numero);
            String email = "aluno" + sufixo + "@example.test";

            if (!alunoRepository.existsByEmailIgnoreCase(email)) {
                alunoRepository.save(new Aluno(
                        "Aluno de Exemplo " + sufixo,
                        email,
                        gerarCpf(234_560_000 + numero),
                        "1198765" + String.format("%04d", numero)
                ));
            }
        }
    }

    private String gerarCpf(int base) {
        String noveDigitos = String.format("%09d", base);
        int primeiroDigito = calcularDigito(noveDigitos, 10);
        String dezDigitos = noveDigitos + primeiroDigito;
        int segundoDigito = calcularDigito(dezDigitos, 11);
        return dezDigitos + segundoDigito;
    }

    private int calcularDigito(String digitos, int pesoInicial) {
        int soma = 0;
        for (int indice = 0; indice < digitos.length(); indice++) {
            soma += (digitos.charAt(indice) - '0') * (pesoInicial - indice);
        }

        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}