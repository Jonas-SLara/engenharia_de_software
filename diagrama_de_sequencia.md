sequenceDiagram
    Usuario->>+Login:Acessa site
    Login->>-Usuario: clica em sair
    Login->>+Dashboard:Redireciona
    Dashboard->>-Login:Mostrar Opções
    Usuario->>+Dashboard:Gerar relatórios com seus privelégios
    Dashboard->>-Usuario:mostrar gráficos do relatório gerado
    Dashboard->>+ConsultarAluno: Redireciona
    ConsultarAluno->>-Dashboard: Mostrar Opções
    Usuario->>+ConsultarAluno:Consultar Aluno(matricula)
    ConsultarAluno->>-Usuario:mostrar dados do aluno
