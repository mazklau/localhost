const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config(); // Carregar variáveis de ambiente do arquivo .env

const app = express();
const port = process.env.PORT || 3000; // Definir a porta (padrão é 3000)

// Middleware para parsear JSON no corpo das requisições
app.use(bodyParser.json());

// Middleware para verificar o IP do cliente (opcional)
const IP_PERMITIDO = process.env.IP_PERMITIDO;
app.use((req, res, next) => {
    const clienteIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (IP_PERMITIDO && clienteIP !== IP_PERMITIDO) {
        return res.status(403).json({ mensagem: 'Acesso negado. IP não autorizado.' });
    }
    next();
});

// Endpoint POST para receber dados
app.post('/enviar-info', (req, res) => {
    const { email, senha, telefone, nome } = req.body;

    // Validação de dados
    if (!email || !senha || !telefone || !nome) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    // Processa a informação recebida
    console.log('Dados recebidos:', { email, senha, telefone, nome });

    // Responde com uma mensagem de confirmação
    res.json({ mensagem: 'Informação recebida com sucesso!', dados: { email, senha, telefone, nome } });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensagem: 'Algo deu errado!' });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
