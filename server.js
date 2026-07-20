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

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Ты — предварительный аудитор документов закупок АО «НК «КТЖ».
Проанализируй предоставленные тексты (Техспецификация, Требования к ПП и др.) и найди ВСЕ упоминания, ссылки и отсылки к:
1. ГОСТам, СТ РК, ТР ТС, НТД.
2. Законам, Правилам, Регламентам, Стандартам организаций (СТ АО «НК «КТЖ»).

Выведи список всех найденных документов. Сопоставь их с базой знаний и укажи, каких именно документов не хватает для проведения полноценного анализа.

ТЕКСТЫ ДОКУМЕНТОВ:
${JSON.stringify(docs)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ result: response.text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/full-audit', async (req, res) => {
    const { apiKey, docs, ktjRulesText } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'Не указан API-ключ Gemini' });

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `
Ты — главный эксперт по аудиту закупочной документации АО «НК «КТЖ», Порядка закупок АО «Самрук-Қазына», Закона о квазигосзакупках и законодательства РК.

ПРОВЕДИ ГЛУБОКИЙ АУДИТ ПО СЛЕДУЮЩЕМУ ЧЕК-ЛИСТУ И СФОРМИРУЙ ОТВЕТ В ФОРМАТЕ JSON (массив объектов с полями: id, title, status ["PASSED", "FAILED", "SKIPPED"], comment, recommendation):

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
6.14. Требования к Потенциальному Поставщику (отсутствие завышенных требований, ограничений конкуренции, нерелевантного опыта/специалистов).
6.15. Отсутствие указаний на бренды/марки без «или эквивалент».

Правила КТЖ: ${ktjRulesText || 'Используются базовые утвержденные правила КТЖ'}

ПРЕДОСТАВЛЕННЫЕ ДОКУМЕНТЫ:
План: ${docs.plan || 'Нет'} | ТС (РУС): ${docs.techRu || 'Нет'} | ТС (КАЗ): ${docs.techKz || 'Нет'} | Требования к ПП: ${docs.supplier || 'Нет'}

Верни строго JSON массив формата:
[{"id":"6.1","title":"Согласованность ЕНС ТРУ","status":"PASSED","comment":"Все в порядке","recommendation":""}]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: systemPrompt,
            config: { responseMimeType: "application/json" }
        });
        res.json(JSON.parse(response.text));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
