export const runtime = "nodejs";
export const maxDuration = 60;

// Бесплатный тариф Gemini API (Google AI Studio, без привязки карты).
// Смените на "gemini-2.5-pro", если понадобится более сильная модель
// (обратите внимание: у Pro в разы более жёсткие лимиты бесплатного тарифа).
const MODEL = "gemini-2.5-flash";

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY не настроен на сервере. Добавьте его в переменные окружения проекта на Vercel." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Некорректное тело запроса." }, { status: 400 });
  }

  const { system, userContent, maxTokens } = body || {};
  if (!system || !userContent) {
    return Response.json({ error: "Отсутствуют system или userContent." }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: userContent }] }],
          generationConfig: {
            maxOutputTokens: maxTokens || 4096,
            temperature: 0.2,
            // Просим Gemini вернуть строго JSON — не нужно парсить markdown-обёртку.
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      return Response.json(
        { error: data?.error?.message || `Gemini API вернул ошибку ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const candidate = data.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const text = (candidate?.content?.parts || []).map((p) => p.text || "").join("");

    if (!text) {
      const blockReason = data.promptFeedback?.blockReason;
      return Response.json(
        { error: blockReason ? `Запрос заблокирован Gemini (причина: ${blockReason}).` : "Модель вернула пустой ответ." },
        { status: 502 }
      );
    }
    if (finishReason === "MAX_TOKENS") {
      console.warn("Gemini: ответ обрезан по maxOutputTokens.");
    }

    return Response.json({ content: [{ text }], finish_reason: finishReason });
  } catch (err) {
    return Response.json({ error: `Сбой запроса к Gemini API: ${err.message}` }, { status: 502 });
  }
}
