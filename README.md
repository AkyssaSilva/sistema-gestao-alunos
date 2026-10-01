# Start Students

Sistema web desenvolvido para gerenciar o ciclo de vida dos alunos, permitindo cadastro, consulta, atualização e inativação de registros.

O projeto é composto por:

- Frontend: Angular
- Backend: Java + Spring Boot
- Banco de Dados: H2

## Funcionalidades

- Autenticação de usuários
- Controle de acesso por perfil (ADMIN e LEITOR)
- Cadastro de alunos
- Consulta de alunos
- Atualização de alunos
- Inativação de alunos
- Listagem de alunos
- Documentação da API com Swagger/OpenAPI

## Usuários para Acesso

Para fins de desenvolvimento e testes, a aplicação possui os seguintes usuários previamente cadastrados:

### Administrador

- Usuário: `Admin01`
- Senha: `senhaSegura123`

### Leitor
- Usuário: `Usuario02`
- Senha: `senhaSegura321`

## Executando o Projeto

### Backend

```bash
cd backend
```

Inicie a aplicação:

```bash
./mvnw spring-boot:run
```


API disponível em:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm start
```

Aplicação disponível em:

```text
http://localhost:4200/login
```

## Documentação da API

Swagger/OpenAPI:

```text
http://localhost:8080/swagger
```

## Banco de Dados

Console H2:

```text
http://localhost:8080/h2-console
```
