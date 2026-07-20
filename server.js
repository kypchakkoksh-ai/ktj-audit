app.post('/api/pre-check', async (req, res) => {
    try {
        const { apiKey, docs } = req.body;
        if (!apiKey) {
            return res.status(400).json({ error: 'Не указан API-ключ Gemini' });
        }

        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
Ты — аудитор документов закупок АО «НК «КТЖ».
Проанализируй текст документов и найди ссылки на ГОСТы, СТ РК, ТР ТС и НПА.

ДОКУМЕНТЫ:
${typeof docs === 'string' ? docs : JSON.stringify(docs)}
        `;

        const response = await model.generateContent(prompt);
        return res.json({ result: response.response.text() });
    } catch (e) {
        console.error("Error in pre-check:", e);
        return res.status(500).json({ error: 'Ошибка сервера: ' + e.message });
    }
});
