const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '200mb' }));

const axios = require('axios');
const { response } = require('express');

console.log("RODANDO...");

app.post('/', (req, res) => {

    let nome = req.body.nome;
    let cep = req.body.cep;

    if (!cep) {
        let response = {
            "status": "Error",
            "message": "Informe um cep",
        }

        return res.json(response);
    } else {
        axios
            .get('https://viacep.com.br/ws/' + cep + '/json/')
            .then((resposta) => {

                let response = {
                    "status": "OK",
                    "message": "Olá, " + nome + "! Sua rua é: " + resposta.data.logradouro,
                }

                return res.json(response);

            })
            .catch((error) => {

                if (error.response.status == 400) {
                    let rs = {
                        "status": "ERRO",
                        "mensagem": "Digite um cep válido!",
                    }

                    return res.json(rs);
                } else {
                    let rs = {
                        "status": "ERRO",
                        "mensagem": "Erro inesperado"
                    }

                    return res.json(rs);
                }
            })
    }
});

app.use(cors());
app.use(express.json());
app.listen(3333);