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

// Хранилище учетных данных ПРГ (Параграф) и настроек источников
let prgCredentials = {
    login: process.env.PRG_LOGIN || '',
    password: process.env.PRG_PASSWORD || ''
};

// Маршрут для сохранения учетных данных ПРГ
app.post('/api/config/prg', (req, res) => {
    const { login, password } = req.body;
    prgCredentials.login = login;
    prgCredentials.password = password;
    res.json({ status: 'ok', message: 'Данные авторизации ПРГ сохранены' });
});

// Маршрут для предварительной проверки документов
app.post('/api/pre-check', async (req, res) => {
    const { apiKey, docs } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'Не указан API-ключ Gemini' });

    try {
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
Ты — предварительный аудитор документов закупок АО «НК «КТЖ».
Проанализируй предоставленные тексты (Техспецификация, Требования к ПП и др.) и найди ВСЕ упоминания, ссылки и отсылки к:
1. ГОСТам, СТ РК, ТР ТС, НТД (доступны в открытой базе EnSU).
2. Законам, Правилам, Регламентам, Стандартам организаций КТЖ (доступны в базе ПРГ / Закон).

Выведи список всех найденных нормативно-технических документов и нормативно-правовых актов.
Запрос к базе EnSU выполняется автоматически без API-ключа (открытый источник).

ТЕКСТЫ ДОКУМЕНТОВ:
${JSON.stringify(docs)}
        `;

        const response = await model.generateContent(prompt);
        res.json({ result: response.response.text() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Маршрут для полного аудита
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
Ты — главный эксперт по аудиту закупочной документации АО «НК «КТЖ», Порядка закупок АО «Самрук-Қазына», Закона о квазигосзакупках и законодательства РК.

Используй открытые данные EnSU и нормативную базу ПРГ для сверки.

ПРОВЕДИ ГЛУБОКИЙ АУДИТ И ВЕРНИ ОТВЕТ В ФОРМАТЕ JSON (массив объектов с полями: id, title, status ["PASSED", "FAILED", "SKIPPED"], comment, recommendation):

ЧЕК-ЛИСТ:
6.1. Согласованность наименования ТРУ (ЕНС ТРУ, SAP, План закупок).
6.2. Полное совпадение наименований, характеристик, ед. изм. и объемов с Планом закупок.
6.3. Указание точных объемов, графиков и конкретных мест поставки/услуг.
6.4. Соответствие доп. характеристик Плана закупок описанию в ТС.
6.5. Соблюдение технологических сроков производства, доставки.
6.6. Соответствие ТС Порядку Самрук-Казына, ГОСТам, СТ РК, ТР ТС и Законодательству РК.
6.7. Идентичность смыслового текста ТС на русском и казахском языках.
6.8. Отсутствие внутренних противоречий.
6.9. Четкие и измеримые функциональные характеристики.
6.10. Измеримые технические характеристики.
6.11. Эксплуатационные характеристики и правила обслуживания.
6.12. Качественные характеристики и стандарты надежности.
6.13. Актуальность ссылок на ГОСТ/СТ/ТР ТС.
6.14. Требования к Потенциальному Поставщику.
6.15. Отсутствие указаний на бренды/марки без «или эквивалент».

Правила КТЖ: ${ktjRulesText || 'Используются базовые утвержденные правила КТЖ'}

ДОКУМЕНТЫ ДЛЯ АНАЛИЗА:
${JSON.stringify(docs)}

Верни строго JSON массив формата:
[{"id":"6.1","title":"Согласованность ЕНС ТРУ","status":"PASSED","comment":"Все в порядке","recommendation":""}]
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
            res.status(500).send("Ошибка: Файл public/index.html не найден.");
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
