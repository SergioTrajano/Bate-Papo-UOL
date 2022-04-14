
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
    const mesages = document.querySelector("ul");
    for (let i = 0; i < numMesages; i++) {
        if (permitido(resposta, i)) {
            mesages.innerHTML += `
            <li class='${resposta.data[i].type}'><p><span> (${resposta.data[i].time})</span> <strong>  ${resposta.data[i].from} </strong> para <strong> ${resposta.data[i].to} </strong> ${resposta.data[i].text} </p></li>
            `
        }
    }
    const ultimaMensagem = document.querySelector(`li:nth-child(${document.querySelectorAll("li").length})`)
    ultimaMensagem.scrollIntoView(false);
}

function atualizaMensagens() {
    const msgs = document.querySelector("ul");
    msgs.innerHTML = "";
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(tratarSucess);
}

function manterConexao() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario)
};

function tratarSucesso() {
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