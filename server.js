const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/pre-check', async (req, res) => {
    const { apiKey, docs } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'Не указан API-ключ Gemini' });

    try {
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
Ты — предварительный аудитор документов закупок АО «НК «КТЖ».
Проанализируй предоставленные тексты и найди ВСЕ упоминания, ссылки и отсылки к ГОСТам, СТ РК, ТР ТС, НТД и внутренним правилам КТЖ.

ТЕКСТЫ ДОКУМЕНТОВ:
${JSON.stringify(docs)}
        `;

        const response = await model.generateContent(prompt);
        res.json({ result: response.response.text() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/full-audit', async (req, res) => {
    const { apiKey, docs, ktjRulesText } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'Не указан API-ключ Gemini' });

    try {
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ 
            model: 'gemini-1.5-pro',
            generationConfig: { responseMimeType: "application/json" }
        });

        const systemPrompt = `
Ты — главный эксперт по аудиту закупочной документации АО «НК «КТЖ».
Проведи аудит документов и верни результат строго в формате JSON (массив объектов с полями id, title, status ["PASSED", "FAILED", "SKIPPED"], comment, recommendation).

ДОКУМЕНТЫ:
${JSON.stringify(docs)}
        `;

        const response = await model.generateContent(systemPrompt);
        res.json(JSON.parse(response.response.text()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('*', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(500).send("Ошибка: Файл public/index.html не найден в репозитории.");
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
