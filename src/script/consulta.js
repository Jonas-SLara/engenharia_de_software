//ESTRUTURA DE DADOS DE ALUNOS
let alunos = [];

//FUNÇÃO ASSINCRONA PARA CARREGAR OS DADOS
async function carregarDados() {
    try{
        const resposta = await fetch('../alunos_gerados.json');    
        if(!resposta.ok){
            throw new Error("erro ao carregar arquivo json");
        }
        const dados = await resposta.json();
        alunos=dados;
        console.log("dados carregados");
    }catch(erro){
        console.error("erro ao carregar os dados ", erro);
    }
}

//FILTRAR ALUNOS SELECIONADOS
const filtrarAlunos = (cursoSelecionado='Todos', centroSelecionado='Todos')=>{
    if(alunos.length === 0){
        console.log("lista de alunos ainda não carregada")
        return;
    }

    const filtrados = alunos.filter(aluno => {
        const acerto1 = cursoSelecionado!=='Todos' ? aluno.curso === cursoSelecionado : true;
        const acerto2 = centroSelecionado!=='Todos' ? aluno.centro === centroSelecionado : true;
        return acerto1 && acerto2; //ambos devem ter o mesmo parametro
    });

    return filtrados;
}

//PREENCHE O SELECT CENTRO COM OS VALORES
const preencherCentros = ()=>{
    const select = document.getElementById('centro');

    //algoritmo manual de preenchimento atraves de um estrutura de dados
    const centros = []; 
    for(i=0; i<alunos.length; i++){
        let centro_buscado = alunos[i].centro;
        if(!centros.includes(centro_buscado)){
            centros.push(centro_buscado);
        }
    }

    //é o mesmo que
    //const centros = [...new Set(alunos.map(aluno => aluno.centro))]
    select.innerHTML = '<option value="Todos">Todos</option>';
    centros.forEach(c =>{
        const op = document.createElement('option');
        op.value=c;
        op.textContent=c;
        select.appendChild(op);
    });
}

const preencherCursos = (centroSelecionado)=>{
    const select = document.getElementById('curso');
    if(centroSelecionado === 'Todos') return; //valor padrao para cursos

    const cursos_centro = alunos.filter(aluno => aluno.centro === centroSelecionado).map(
         aluno => aluno.curso)

    const cursos = [...new Set(cursos_centro)];
    //limpar seleção antiga
    select.innerHTML='<option value="Todos">Todos</option>';
    cursos.forEach(c => {
        const op = document.createElement('option');
        op.value = c;
        op.textContent = c;
        select.appendChild(op);
    });
}

const mostrarAlunos = (filtrados)=>{
    if(filtrados.length===0){
        console.log("nenhum aluno encontrado com este filtro");
        return;
    }
    const rs = document.getElementById('consulta');
    rs.innerHTML="";
    filtrados.forEach(aluno => {
        console.log(`Nome: ${aluno.nome} Curso: ${aluno.curso} 
            Centro: ${aluno.centro} Evasão: ${(aluno.probabilidade_evasao * 100).toFixed(1)}%`);
        const novo = document.createElement('tr');
        novo.innerHTML=`<td>${aluno.nome}</td>
        <td>${aluno.centro}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.probabilidade_evasao}</td>
        <td>${aluno.matrícula}</td>`;
        rs.appendChild(novo);
    });
    
}

const buscarMatricula = (matricula)=>{
    const aluno = alunos.find(aluno=>{
        return aluno.matrícula==matricula;
    });
    const rs = document.getElementById('consulta');
    rs.innerHTML='';
    const novo = document.createElement('tr');
    novo.innerHTML=`<td>${aluno.nome}</td>
        <td>${aluno.centro}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.probabilidade_evasao}</td>
        <td>${aluno.matrícula}</td>`;
    rs.appendChild(novo);
}

(async ()=>{
    await carregarDados();
    preencherCentros();
    preencherCursos('Todos');

    const selectCentro = document.getElementById('centro');
    const selectCurso = document.getElementById('curso');
    const selectMatricula = document.getElementById('matricula');
   
    selectCentro.addEventListener('change',()=>{
        preencherCursos(selectCentro.value);
        //se escolheu o valor padrao para centro como todos, então lá em cursos deve só aparecer todos
        if(selectCentro.value === 'Todos'){
            selectCurso.innerHTML='<option value="Todos">Todos</option>';
        }
        console.log(selectCentro.value + " " + selectCurso.value);
        mostrarAlunos(filtrarAlunos(selectCurso.value, selectCentro.value));        
    })

    selectCurso.addEventListener('change', ()=>{
        console.log(selectCentro.value + " " + selectCurso.value);
        mostrarAlunos(filtrarAlunos(selectCurso.value, selectCentro.value));
    })

    selectMatricula.addEventListener('input', ()=>{
        //todas as matriculas possuem 9 caracteres, quando chegar neste valor busca aluno
        //fora isso deve haver um style para input invalida exceto 0
        if(selectMatricula.value.length===9){
            console.log('busca')
            buscarMatricula(selectMatricula.value);
        }
    })
})();