# Sistema de Gestão de Alunos

Sistema desenvolvido para gerenciamento de alunos, permitindo cadastro, consulta, atualização, inativação e listagem de registros, com controle de acesso por perfil de usuário.

## Tecnologias

- Java
- Spring Boot
- H2

## Execução

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Acesse o diretório do projeto:

```bash
cd backend
```

Execute a aplicação:

```bash
.\mvnw spring-boot:run
```

A API estará disponível em:

```text
http://localhost:8080
```

## Documentação da API

A documentação interativa da API pode ser acessada em:

```text
http://localhost:8080/swagger
```

## Banco de Dados

O projeto utiliza o banco de dados H2 em memória para desenvolvimento e testes.

Console H2:

```text
http://localhost:8080/h2-console
```