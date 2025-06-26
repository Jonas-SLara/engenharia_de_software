//alert("hello world");

const input_matricula = document.querySelector("#matricula");
const input_senha = document.querySelector("#senha");
const formulario_login = document.querySelector("#login_form");
const botao_login = document.querySelector("#btn_login");

console.log(input_matricula);
console.log(input_senha);
console.log(formulario_login);
console.log(botao_login);

const tratar_submit_login = (event) => {
    event.preventDefault();
    let matricula = input_matricula.value;
    let senha = input_senha.value;

    if (matricula == "" || senha == ""){
        alert("campos em branco");
        return;
    }

    if(matricula == "2025" && senha == "1234"){
        localStorage.setItem("usuario_tipo", "coord");//guarda os dados no navegador
        console.log(localStorage.getItem("usuario_tipo"));
        window.location = "./pages/dashboard.html";
    }
    else{
        alert("dados inválidos");
    }
}

formulario_login.addEventListener("submit", tratar_submit_login);

const senhaInput = document.getElementById("senha");
const toggleSenha = document.getElementById("toggleSenha");
const olhoImg = toggleSenha.querySelector("img");

  toggleSenha.addEventListener("click", () => {
    const isOculta = senhaInput.type === "password";
    senhaInput.type = isOculta ? "text" : "password";
    olhoImg.src = isOculta ? "./img/olho.png" : "./img/olho_fechado.png";
    olhoImg.alt = isOculta ? "esconder senha" : "mostrar senha";
  });
