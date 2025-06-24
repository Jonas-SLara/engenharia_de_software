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


//MOSTRAR ALUNOS SELECIONADOS
const mostrarAlunos = (cursoSelecionado=null, centroSelecionado=null)=>{
    if(alunos.length === 0){
        console.log("lista de alunos ainda não carregada")
        return;
    }

    const filtrados = alunos.filter(aluno => {
        const acerto1 = cursoSelecionado ? aluno.curso === cursoSelecionado : true;
        const acerto2 = centroSelecionado ? aluno.centro === centroSelecionado : true;
        return acerto1 && acerto2; //ambos devem ter o mesmo parametro
    });

    if(filtrados.length===0){
        console.log("nenhum aluno encontrado co este filtro");
        return;
    }

    console.log("Alunos filtrados:");

    filtrados.forEach(aluno => {
        console.log(`Nome: ${aluno.nome}`);
        console.log(`Curso: ${aluno.curso}`);
        console.log(`Centro: ${aluno.centro}`);
        console.log(`Evasão: ${(aluno.probabilidade_evasao * 100).toFixed(1)}%`);
        console.log('---');
    });
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

//PREENCHER OS CURSOS DAQUELE CENTRO COM OS VALORES
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

//atualiza com base nos valores selecionados
const atualizarExibicao= () => {
  const selectCentro = document.getElementById('centro');
  const selectCurso = document.getElementById('curso');

  const centro = selectCentro.value !== "Todos" ? selectCentro.value : null;
  const curso = selectCurso.value !== "Todos" ? selectCurso.value : null;

  mostrarAlunos(curso, centro);
}

(async ()=>{
    await carregarDados();
    preencherCentros();
    preencherCursos('Todos');

    const selectCentro = document.getElementById('centro');
    const selectCurso = document.getElementById('curso');

    selectCentro.addEventListener('change',()=>{
        const centro= selectCentro.value;
        preencherCursos(centro);
        atualizarExibicao();
    })

    selectCurso.addEventListener('change', ()=>{
        atualizarExibicao();
    })
})();