function habilitarEnterLogin() {
    const input = document.querySelector(".login input");
    input.addEventListener('keypress', (e) => {
        if (e.key === "Enter") {
            validarUser();
        }
    });
}

function habilitarEnterFundo() {
    const input = document.querySelector(".fundo input");
    input.addEventListener('keypress', (e) => {
        if (e.key === "Enter") {
            enviaMensagem();
        }
    });
}

function atualizaDescricao() {
    const descricao = document.querySelector(".fundo p");
    const destinatario = document.querySelector(".participantes .selecionado p").innerHTML;
    const visibilidade = document.querySelector(".visibilidade .selecionado p").innerHTML;
    descricao.innerHTML = `Escrevendo para ${destinatario} (${visibilidade})`;
}

function seleciona(elemento, tipo) {
    const user = document.querySelector(".login input").value;
    if (elemento.querySelector("p").innerHTML === user + " (Você)") {
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
        document.querySelector(".fundo input").focus();
    }
    if (acao == 'mostrar') {
        barraLateral.classList.remove("escondido");
    }
}

function recarregar(erro) {
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
    const user = document.querySelector(".login input").value;
    const destinatario = document.querySelector(".participantes .selecionado p").innerHTML;
    const mesage = document.querySelector(".fundo input").value;
    if (mesage === "") {
        document.querySelector(".fundo input").focus();
        return;
    }
    const msg = {
        from: user,
        to: destinatario,
        text: mesage,
        type: tipoMsg()
    };
    const prom = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);
    prom.then(atualizaMensagens);
    prom.catch(recarregar);
    document.querySelector(".fundo input").value = "";
    document.querySelector(".fundo input").focus();
}

function permitido(resposta, i) {
    const user = document.querySelector(".login input").value;
    if (resposta.data[i].to === "Todos") {
        return true;
    }
    if (resposta.data[i].type === "private_message" && (resposta.data[i].to === user || resposta.data[i].from === user)) {
        return true;
    }
    if (resposta.data[i].type === "status" || resposta.data[i].type === "message") {
        return true;
    }
    return false;
}

function atualizarMsg(resposta) {
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
    const ultimaMensagem = document.querySelector("li:last-child");
    ultimaMensagem.scrollIntoView(false);
}

function particpanteSelecionadoAtivo(elemento) {
    if (elemento === null) {
        return true;
    }
    if (elemento.innerHTML === "Todos") {
        return true;
    }
    return false;
}

function participanteAtivo(selecionado, nome) {
    if (selecionado === null) {
        return false;
    }
    if (selecionado.innerHTML === nome) {
        return true;
    }
    return false;
}

function participanteAt(resposta) {
    const part = document.querySelector(".participantes .selecionado p");
    if (part === null) {
        return null
    }
    for (let i = 0; i < resposta.length; i++) {
        if (resposta[i].name === part.innerHTML) {
            return part;
        }
    }
    return null;
}

function atualizaParticipantes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promisse.then(function (resposta) {
        const listaParticipantes = document.querySelector(".participantes");
        const participanteSelecionado = participanteAt(resposta.data);
        const user = document.querySelector(".login input").value;
        if (particpanteSelecionadoAtivo(participanteSelecionado)) {
            listaParticipantes.innerHTML = `
            <div class="tipo selecionado" onclick="seleciona(this, 'participantes')">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon name="checkmark" class="check"></ion-icon>
            </div>`;
            document.querySelector(".fundo p").innerHTML = `Escrevendo para Todos (${document.querySelector(".visibilidade .selecionado p").innerHTML})`
        } else {
            listaParticipantes.innerHTML = `
            <div class="tipo" onclick="seleciona(this, 'participantes')">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon name="checkmark" class="check escondido"></ion-icon>
            </div>`;
        }
        for (let i = 0; i < resposta.data.length; i++) {
            if (resposta.data[i].name === user) {
                listaParticipantes.innerHTML += `
            <div class="tipo" onclick="seleciona(this, 'participantes')">
                <ion-icon name="person-circle"></ion-icon>
                <p>${resposta.data[i].name} (Você)</p>
                <ion-icon name="checkmark" class="check escondido"></ion-icon>
            </div>`;
            } else {
                if (
                    participanteAtivo(participanteSelecionado, resposta.data[i].name)) {
                    listaParticipantes.innerHTML += `
                <div class="tipo selecionado" onclick="seleciona(this, 'participantes')">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${resposta.data[i].name}</p>
                    <ion-icon name="checkmark" class="check"></ion-icon>
                </div>`;
                } else {
                    listaParticipantes.innerHTML += `
                <div class="tipo" onclick="seleciona(this, 'participantes')">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${resposta.data[i].name}</p>
                    <ion-icon name="checkmark" class="check escondido"></ion-icon>
                </div>`;
                }
            }
        }
    }
    );
}

function atualizaMensagens() {
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(atualizarMsg);
}

function manterConexao() {
    const user = {name: document.querySelector(".login input").value};
    const conexao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
    conexao.catch(recarregar);
}

function validar() {
    const telaLogin = document.querySelector(".login");
    telaLogin.classList.add("escondido");
    document.querySelector(".fundo input").focus();
    atualizaMensagens();
    atualizaParticipantes();
    habilitarEnterFundo();
    setInterval(manterConexao, 5000);
    setInterval(atualizaMensagens, 3000);
    setInterval(atualizaParticipantes, 10000);
}

function carregando() {
    const input = document.querySelector(".login input");
    const botao = document.querySelector(".login button");
    const gif = document.querySelector(".login .gif");
    const p = document.querySelector(".login p");
    input.classList.add("escondido");
    botao.classList.add("escondido");
    gif.classList.remove("escondido");
    p.classList.remove("escondido");
    setTimeout(validar, 3000);
}

function erroLogin() {
    const input = document.querySelector(".login input");
    input.value = "";
    input.placeholder = "Nome em uso. Digite outro nome";
}

function validarUser() {
    const user = { name: document.querySelector(".login input").value};
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    requisicao.then(carregando);
    requisicao.catch(erroLogin);
}

habilitarEnterLogin();