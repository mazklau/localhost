const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// IP permitido
const IP_PERMITIDO = process.env.IP_PERMITIDO;

// Middleware para parsear JSON no corpo das requisições
app.use(bodyParser.json());

// Middleware para verificar o IP do cliente
app.use((req, res, next) => {
    const clienteIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`IP do cliente: ${clienteIP}`);

    if (clienteIP !== IP_PERMITIDO) {
        return res.status(403).send({ mensagem: 'Acesso negado. IP não autorizado.' });
    }

    next();
});

// Endpoint POST para receber dados
app.post('/enviar-info', (req, res) => {
    const { email, senha, telefone, nome } = req.body;

    // Validação de dados
    if (!email || !senha || !telefone || !nome) {
        return res.status(400).send({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    // Processa a informação recebida
    console.log('Dados recebidos:', { email, senha, telefone, nome });

    // Responde com uma mensagem de confirmação
    res.send({ mensagem: 'Informação recebida com sucesso!', dados: { email, senha, telefone, nome } });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ mensagem: 'Algo deu errado!' });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
