//ESTRUTURA DE DADOS DE ALUNOS
let alunos = [];
//GRAFICO DE PIZZA COM CHART JS
let grafico = null;

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
    const centro = document.getElementById('centro').value;
    const curso = document.getElementById('curso').value;

    let labels = [];//todos os campos no grafico
    let valores = [];//todos os valores de cada campo

    if(centro === "Todos" && curso === "Todos"){
        //mostrar evasão media por centro
        labels = [...new Set(alunos.map(a => a.centro))];
        valores = labels.map(l=>{
            const cursos = alunos.filter(a => a.centro === l);
            const media = cursos.reduce((soma,c)=>
                soma + c.probabilidade_evasao, 0)/cursos.length;
            return parseFloat(media.toFixed(1));
        });
    }
    else if(centro !== "Todos" && curso === "Todos"){
        //mostrar evasão média por curso do centro selecionado
        const al_centro = alunos.filter(a => a.centro === centro);
        const nomesCursos = [... new Set(al_centro.map(c=>c.curso))];
        labels = nomesCursos;

        valores = labels.map(l => {
            const al_curso = al_centro.filter(a=>a.curso === l);
            const media = al_curso.reduce((soma, a)=>
                soma + a.probabilidade_evasao, 0)/al_curso.length;
        
            return parseFloat(media.toFixed(1));            
        });
    }
    else{
        //mostrar evasão média do curso
        const al_curso = alunos.filter(a => a.centro === centro && a.curso === curso);
        const media = al_curso.reduce((soma, a) =>
            soma + a.probabilidade_evasao, 0)/al_curso.length;
        labels = [curso];
        valores = [parseFloat(media.toFixed(1))];
    }

    labels.forEach((l)=>console.log(l));
    valores.forEach((v)=>console.log(v));

    desenharGrafico(labels, valores);
}

// calcular a evasão média dos alunos
const calcularEvasaoMedia = (lista) =>{
  if (lista.length === 0) return 0;
  const soma = lista.reduce((total, aluno) => total + aluno.probabilidade_evasao, 0);
  return (soma / lista.length) * 100;
}

function gerarCores(n){
    const cores = [
    "#4dc9f6", "#f67019", "#f53794", "#537bc4",
    "#acc236", "#166a8f", "#00a950", "#58595b",
    "#8549ba"
    ];
    return Array.from({length: n}, (_, i) => cores[i % cores.length]);
}

const desenharGrafico = (labels, dados) => {
  const ctx = document.getElementById('graficoEvasao').getContext('2d');

  const evasaoMedia = dados.length > 0
    ? dados.reduce((soma, d) => soma + d, 0) / dados.length
    : 0;

  if (!grafico) {
    // Cria o gráfico pela primeira vez
    grafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: dados,
          backgroundColor: gerarCores(dados.length),
          borderColor: '#ffffff',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          title: {
            display: true,
            text: `Evasão Média: ${evasaoMedia.toFixed(1)}%`,
            color: '#ffffff',
            font: {
              size: 18,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => value + '%',
              color: '#ffffff',
              font:{
                weight:'bold'
              }
            }
          },
          x: {
            beginAtZero: true,
            ticks: {
              callback: value => value + '%',
              color: '#ffffff',
              font:{
                weight:'bold'
              }
            }
          }
        }
      }
    });
  } else {
    // Atualiza os dados do gráfico com animação
    grafico.data.labels = labels;
    grafico.data.datasets[0].data = dados;
    grafico.data.datasets[0].backgroundColor = gerarCores(dados.length);
    grafico.options.plugins.title.text = `Evasão Média: ${evasaoMedia.toFixed(1)}%`;

    grafico.update(); // <- aqui a mágica acontece
  }
};



(async ()=>{
    await carregarDados();
    preencherCentros();
    preencherCursos('Todos');
    atualizarExibicao();
    const selectCentro = document.getElementById('centro');
    const selectCurso = document.getElementById('curso');

    selectCentro.addEventListener('change',()=>{
        const centro= selectCentro.value;
        preencherCursos(centro);
        //se escolheu o valor padrao para centro como todos, então lá em cursos deve só aparecer todos
        if(centro === 'Todos'){
            selectCurso.innerHTML='<option value="Todos">Todos</option>';
        }
        atualizarExibicao();
    })

    selectCurso.addEventListener('change', ()=>{
        atualizarExibicao();
    })
})();