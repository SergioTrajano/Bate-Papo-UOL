function seleciona(elemento, tipo) {
    const apagar = document.querySelector(`.${tipo} .selecionado`);
    const marca = elemento.querySelector(".check");
    if (apagar !== null) {
        apagar.querySelector(".check").classList.add("escondido");
        apagar.classList.remove("selecionado");
    }
    elemento.classList.add("selecionado");
    elemento.querySelector(".check").classList.remove("escondido");
}

function displayLateral(acao) {
    const barraLateral = document.querySelector(".menu-lateral");
    if (acao == 'esconder') {
        barraLateral.classList.add("escondido");
    }
    if (acao == 'mostrar') {
        barraLateral.classList.remove("escondido");
    }
}

function recarregar(erro) {
    alert(erro.response.status);
    alert("Você perdeu a conexão com o servidor");
    location.reload();
}

function enviaMensagem() {
    const mesage = document.querySelector("input").value;
    const msg = {
        from: usuario.name,
        to: "Todos",
        text: mesage,
        type: "message"
    };
    const prom = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);
    prom.then(atualizaMensagens);
    prom.catch(recarregar);
    document.querySelector("input").value = "";
    document.querySelector("input").focus();
}

function permitido(resposta, i) {
    if (resposta.data[i].type === 'private_message' && resposta.data[i].to === usuario) {
        return true;
    }
    if (resposta.data[i].type === 'status' || resposta.data[i].type === 'message') {
        return true;
    }
    return false;
}

function tratarSucess(resposta) {
    const numMesages = resposta.data.length;
    const mesages = document.querySelector(".chat ul");
    mesages.innerHTML = "";
    for (let i = 0; i < numMesages; i++) {
        if (permitido(resposta, i)) {
            mesages.innerHTML += `
            <li class='${resposta.data[i].type}'><p><span> (${resposta.data[i].time})</span>&nbsp<strong>${resposta.data[i].from}</strong>&nbsppara&nbsp<strong>${resposta.data[i].to}</strong>:&nbsp${resposta.data[i].text} </p></li>
            `
        }
    }
    const ultimaMensagem = document.querySelector(`li:last-child`);
    ultimaMensagem.scrollIntoView(false);
}

function atualizaMensagens() {
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(tratarSucess);
}

function manterConexao() {
    const conexao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    conexao.catch(recarregar);
}

function tratarSucesso() {
    atualizaMensagens();
    setInterval(manterConexao, 4000);
    setInterval(atualizaMensagens, 3000);
}

function cadastraUser() {
    usuario = {name: prompt("Digite seu nome")};
    requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    requisicao.then(tratarSucesso());
    requisicao.catch(cadastraUser);
}

let usuario = {name: prompt("Digite seu nome")};
let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
requisicao.then(tratarSucesso());
requisicao.catch(cadastraUser);