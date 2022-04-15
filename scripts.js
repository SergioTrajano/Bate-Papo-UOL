function atualizaDescricao() {
    const descricao = document.querySelector(".fundo p");
    const destinatario = document.querySelector(".participantes .selecionado p").innerHTML;
    const visibilidade = document.querySelector(".visibilidade .selecionado p").innerHTML;
    descricao.innerHTML = `Escrevendo para ${destinatario} (${visibilidade})`;
}

function seleciona(elemento, tipo) {
    if (elemento.querySelector("p").innerHTML === usuario.name + " (Você)") {
        return;
    }
    const apagar = document.querySelector(`.${tipo} .selecionado`);
    const marca = elemento.querySelector(".check");
    if (apagar !== null) {
        apagar.querySelector(".check").classList.add("escondido");
        apagar.classList.remove("selecionado");
    }
    elemento.classList.add("selecionado");
    elemento.querySelector(".check").classList.remove("escondido");
    atualizaDescricao();
}

function displayLateral(acao) {
    const barraLateral = document.querySelector(".menu-lateral");
    if (acao == 'esconder') {
        barraLateral.classList.add("escondido");
        document.querySelector("input").focus();
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

function tipoMsg() {
    const tipo = document.querySelector(".visibilidade .selecionado p").innerHTML;
    if (tipo === "Reservadamente") {
        return "private_message";
    }
    return "message";
}

function enviaMensagem() {
    const mesage = document.querySelector("input").value;
    const destinatario = document.querySelector(".participantes .selecionado p").innerHTML;
    const msg = {
        from: usuario.name,
        to: destinatario,
        text: mesage,
        type: tipoMsg()
    };
    const prom = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);
    prom.then(atualizaMensagens);
    prom.catch(recarregar);
    document.querySelector("input").value = "";
    document.querySelector("input").focus();
}

function permitido(resposta, i) {
    if (resposta.data[i].type === 'private_message' && (resposta.data[i].to === usuario.name || resposta.data[i].from === usuario.name)) {
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

function atualizaParticipantes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promisse.then(function (resposta) {
        const listaParticipantes = document.querySelector(".participantes");
        const participanteSelecionado = document.querySelector(".participantes .selecionado p").innerHTML;
        if (participanteSelecionado === 'Todos') {
            listaParticipantes.innerHTML = `
            <div class="tipo selecionado" onclick="seleciona(this, 'participantes')">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon name="checkmark" class="check"></ion-icon>
            </div>
        `;
        } else {
            listaParticipantes.innerHTML = `
            <div class="tipo" onclick="seleciona(this, 'participantes')">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon name="checkmark" class="check escondido"></ion-icon>
            </div>
        `;
        }
        for (let i = 0; i < resposta.data.length; i++) {
            if (resposta.data[i].name === usuario.name) {
                listaParticipantes.innerHTML += `
            <div class="tipo" onclick="seleciona(this, 'participantes')">
                <ion-icon name="person-circle"></ion-icon>
                <p>${resposta.data[i].name} (Você)</p>
                <ion-icon name="checkmark" class="check escondido"></ion-icon>
            </div>
            `;
            } else {
                if (participanteSelecionado === resposta.data[i].name) {
                    listaParticipantes.innerHTML += `
                <div class="tipo selecionado" onclick="seleciona(this, 'participantes')">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${resposta.data[i].name}</p>
                    <ion-icon name="checkmark" class="check"></ion-icon>
                </div>
                `;
                } else {
                    listaParticipantes.innerHTML += `
                <div class="tipo" onclick="seleciona(this, 'participantes')">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${resposta.data[i].name}</p>
                    <ion-icon name="checkmark" class="check escondido"></ion-icon>
                </div>
                `;
                }
            }
            
        }
    }
    );
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
    atualizaParticipantes();
    setInterval(manterConexao, 5000);
    setInterval(atualizaMensagens, 3000);
    setInterval(atualizaParticipantes, 10000);
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