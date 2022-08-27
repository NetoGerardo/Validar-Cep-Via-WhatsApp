const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');

var wpp = "";

wppconnect
    .create()
    .then((client) => start(client))
    .catch((error) => console.log(error));

function start(client) {

    wpp = client;

    console.log("Qr code escaneado!!");

    client.onMessage((message) => {

        console.log("Mensagem recebida! " + message.body);

        validarCep(message.body, message.from)
    });
}

function validarCep(cep, whatsapp) {
    axios
        .get('https://viacep.com.br/ws/' + cep + '/json/')
        .then((resposta) => {
            sendText("Sua rua é: " + resposta.data.logradouro, whatsapp);
        })
        .catch((error) => {
            if (error.response.status == 400) {
                sendText("Digite um cep válido!", whatsapp);
            } else {
                sendText("Ops... Erro inesperado", whatsapp);
            }
        })
}

function sendText(texto, whatsapp) {

    console.log("Enviando resposta ");
    console.log(texto);
    console.log("Para - " + whatsapp);

    wpp
        .sendText(whatsapp, texto)
        .then((result) => {
            console.log('Result: ', result);
        })
        .catch((erro) => {
            console.error('Error when sending: ', erro);
        });
}
