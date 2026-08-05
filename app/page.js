"use client";

import { useEffect, useRef, useState } from "react";

/* ============ knowledge base ============ */
const KB = `Ниже — краткая нормативная база. Опирайся только на неё и на текст присланных пользователем документов; не выдумывай нормы.

=== ОБЩИЕ ПРАВИЛА ТОЧНОСТИ (обязательны для всех пунктов) ===
1. Любое несоответствие описывай КОНКРЕТНО: указывай, какой именно раздел/пункт/строка ТС не совпадает с каким именно разделом/пунктом/строкой источника сравнения (Плана закупок, ПЗ, ГОСТа, казахской версии и т.д.), и в чём именно разница (какие значения расходятся). Формулировки вида «данные не совпадают» или «есть противоречие» без указания конкретного места и сути расхождения НЕДОПУСТИМЫ.
   Пример хорошей формулировки: «В ТС п.2.3 указана мощность 5 кВт, в Плане закупок в позиции по коду ЕНСТРУ ХХХХ — 7 кВт».
   Пример плохой формулировки (так писать нельзя): «Данные плана закупок не совпадают с ТС».
2. Если в ТС предоставлены обе языковые версии (рус и каз) и по пункту B8 установлено, что тексты идентичны — все остальные содержательные пункты чек-листа (кроме B8) оценивай по РУССКОЙ версии как основной. Если версии расходятся — по каждому содержательному пункту используй ту версию, где требование сформулировано, и отдельно отметь расхождение по B8.

=== ПОРЯДОК САМРУК-ҚАЗЫНА (ключевые нормы) ===
— Статья 35 п.6: в тендерной документации (и, соответственно, в ТС) не допускается указание товарных знаков, знаков обслуживания, фирменных наименований, патентов, полезных моделей, промышленных образцов, наименования места происхождения товара и наименования производителя, если это указывает на принадлежность товара/работы/услуги отдельным поставщикам — за исключением: (а) закупок для доукомплектования/дооснащения/унификации или совместимости с имеющимся оборудованием, сервисного обслуживания и ремонта; (б) если иное предусмотрено закупочной категорийной стратегией; (в) исполнения обязательств по договору с нерезидентом РК, где такие указания предусмотрены самим договором; (г) отдельных случаев для производителей нефтепродуктов.
— Приложение №5 п.2: ТС должна содержать: 1) указание на национальные стандарты РК (при отсутствии — межгосударственные стандарты; при отсутствии и таковых — иные документы по стандартизации, международные стандарты или стандарты иностранного государства); 2) указание на нормативно-техническую документацию (при необходимости); 3) утверждённую проектно-сметную документацию (для работ, требующих ПСД). Если в ТС есть ссылка на технические условия/стандарты/НТД, не зарегистрированные в РК — Заказчик обязан включить эти документы в тендерную документацию либо предоставить их по запросу потенциальных поставщиков в течение 3 (трёх) календарных дней.
— Приложение №5 п.4: квалификационное требование о наличии у поставщика опыта работы за последние 5 лет на рынке однородных работ/услуг допустимо устанавливать ТОЛЬКО при сумме лота на работы/услуги свыше 75 млн тенге без НДС. Не допускается требовать опыт работы, превышающий 5 (пять) лет.
— Приложение №5: требование о наличии квалифицированных специалистов с опытом по предмету закупки — не более 5 лет опыта у специалиста.

=== ПРАВИЛА КТЖ, Приложение №18 «Порядок разработки, согласования и утверждения ТС» ===
— П.2: ТС должна отражать требуемые функциональные, технические, качественные и эксплуатационные характеристики ТРУ, НЕ ограничивающие конкурентную среду для потенциальных поставщиков.
— П.3: ТС должна содержать требования технических регламентов и нормативных документов по стандартизации, включая национальные стандарты РК, региональные стандарты, стандарты организации АО «НК «ҚТЖ».
— П.4: при ссылке на технические условия/стандарты/НТД, не зарегистрированные в РК, Заказчик/Организатор обязан включить эти документы в состав ТС и/или предоставить их по запросу потенциальных поставщиков в течение 3 (трёх) календарных дней.
— П.5: требования к квалификации специалистов поставщика (для закупок работ/услуг) — опыт работы не более 5 (пяти) лет, подтверждается документами.
— П.6: лимит числа требуемых специалистов — не более 3 при сумме закупки работ/услуг ≤75 млн тенге, не более 6 при сумме >75 млн тенге.

=== СРОКИ ИЗГОТОВЛЕНИЯ И ПОСТАВКИ (A2, A3) ===
Для A2 бери год/срок изготовления продукции из Плана закупок и сравнивай со сроком, указанным в самой ТС. Для A3 бери срок поставки из Плана закупок и сравнивай со сроком поставки в ТС. Отдельно для A3: если из документов следует, что закуп осуществляется у отечественного товаропроизводителя (ОТП) — срок поставки не должен превышать 60 календарных дней; для прочих поставщиков лимит 60 дней не применяется, важно только совпадение срока ТС и Плана закупок. Если статус ОТП по документам не определить — оцени только совпадение сроков ТС/Плана и укажи в комментарии, что статус ОТП не установлен. Если план закупок не приложен — по A2 и A3 используй status "info" с пояснением, что для проверки нужен план закупок.

=== ЕНС ТРУ (enstru.kz) ===
Код ЕНС ТРУ должен быть идентичен в трёх источниках: в тексте ТС, в Плане закупок и на официальном портале enstru.kz. Сайт enstru.kz запрещает автоматический доступ, поэтому пользователь сверяет код на сайте вручную и вносит результат в поля формы. Если пользователь ввёл код/наименование по enstru.kz — сравни их с кодом ЕНСТРУ, указанным в тексте ТС, и с кодом в Плане закупок (если план приложен). Если поля не заполнены — используй status "info" по соответствующему пункту.

=== ПЛАН ЗАКУПОК (если приложен) ===
Источник для сверки: код ЕНСТРУ, наименование ТРУ и его характеристики (B3, B4), сроки изготовления и поставки (A2, A3). Единицы измерения, объёмы, точные графики поставки и доп. характеристики отдельным столбцом плана НЕ проверяются на соответствие ТС — эти данные в тексте самой ТС не прописываются, сверка по ним исключена из чек-листа. Для B5 из плана/ТС бери только место поставки/выполнения работ. Если план не приложен — используй "info" по A2/A3/B1/B3/B4/B9, не отмечай как нарушение.

=== ТРЕБОВАНИЯ К ПОСТАВЩИКУ ===
Как правило, расположены В КОНЦЕ текста самой ТС отдельным разделом — ищи их там в первую очередь. Отдельный файл (если приложен) дополняет, а не заменяет, раздел в ТС. Если раздел ОТСУТСТВУЕТ и в ТС, и в отдельном файле (если он был приложен) — по ВСЕМ пунктам группы E (E1-E11) укажи status="info" и recommendation дословно: "Раздел требований к потенциальному поставщику отсутствует в ТС." Не пытайся угадывать или додумывать требования, которых нет в тексте.

=== ДОПОЛНИТЕЛЬНЫЕ ДОКУМЕНТЫ (если приложены) ===
ГОСТ/СТ РК/ТР ТС и иные нормативные документы, приложенные пользователем, используй при оценке пунктов о соответствии ссылок и терминов действующим стандартам.`;

const FINDINGS_SYSTEM = `Ты — специализированный эксперт-аналитик по аудиту технической спецификации (ТС) в сфере закупок ТРУ для АО «НК «Қазақстан темір жолы» в рамках группы АО «Самрук-Қазына». Работай тщательно и дотошно: цель — найти реальные нарушения, а не подтвердить, что всё в порядке. Если ТС на двух языках — обязательно построчно сверь разделы между версиями, а не оценивай по общему впечатлению; расхождение в цифрах, сроках, перечнях или объёме требований между русской и казахской версией — всегда нарушение.

Приоритет норм при коллизиях: Закон РК > Порядок Самрук-Қазына > Правила КТЖ > чек-лист. Нарушение законодательства РК или Порядка Самрук-Қазына — всегда КРИТИЧЕСКИЙ риск.

${KB}

=== ЗАДАЧА ===
Проанализируй присланные документы и выдели самые значимые нарушения (до 8 штук, по убыванию критичности). Также перечисли ссылки на нормативные документы (ГОСТ, СТ РК, ТР ТС, статьи законов), упомянутые в ТС, которые НЕ покрыты нормативной базой выше. Отдельно проверь, есть ли в ТС (или в приложенном отдельном файле) раздел требований к потенциальному поставщику.

Ответь СТРОГО в формате JSON, без markdown и пояснений:
{
  "verdict": "ok" | "warn" | "bad",
  "verdict_title": "краткий вердикт на русском",
  "summary": "2-3 предложения общего вывода",
  "risk_counts": {"critical": <число>, "medium": <число>, "low": <число>},
  "findings": [
    {"level": "crit"|"med"|"low", "fragment": "цитата до 15 слов", "norm": "нарушенная норма", "issue": "суть нарушения с указанием конкретного места (пункт/раздел ТС, строка Плана закупок, статья ГОСТа и т.п.) — не общая фраза", "recommendation": "конкретная рекомендуемая редакция или значение, не общий совет"}
  ],
  "missing_refs": ["документ/ГОСТ/статья, упомянутый в ТС, но не покрытый базой — до 8 штук"],
  "supplier_requirements_status": "present" | "absent"
}
verdict = "bad" при наличии хотя бы одного critical; "warn" при medium без critical; "ok" если нарушений нет. supplier_requirements_status = "absent", если раздел требований к поставщику не найден нигде в присланных документах.`;

const CHECKLIST_GROUPS = [
  { section: "Пояснительная записка", items: [
    { id: "A2", text: "Срок/год изготовления продукции в ТС соответствует сроку изготовления, указанному в Плане закупок." },
    { id: "A3", text: "Срок поставки в ТС соответствует сроку поставки, указанному в Плане закупок; если закуп осуществляется у отечественного товаропроизводителя (ОТП) — срок поставки не превышает 60 календарных дней." },
  ]},
  { section: "Наименование ТРУ, ЕНСТРУ и план закупок", items: [
    { id: "B1", text: "Код ЕНСТРУ в тексте ТС совпадает с кодом ЕНСТРУ в Плане закупок." },
    { id: "B9", text: "Код и наименование ЕНСТРУ в ТС совпадают с данными, найденными пользователем на enstru.kz." },
    { id: "B3", text: "Соответствие наименования ТРУ позиции в Плане закупок." },
    { id: "B4", text: "Наименование и характеристики ТРУ в ТС соответствуют позиции в Плане закупок (единицы измерения и объёмы не проверяются — в ТС они не прописываются)." },
    { id: "B5", text: "Указано точное место поставки/выполнения работ/оказания услуг, без общих формулировок вроде «Акмолинский регион» (объёмы и графики поставки не проверяются — в ТС они не указываются)." },
    { id: "B8", text: "Идентичность текста ТС между русским и казахским языками." },
  ]},
  { section: "Смысл, функциональные и технические характеристики", items: [
    { id: "C1", text: "Отсутствие противоречий смысла между описанием и характеристиками ТРУ." },
    { id: "C2", text: "Чётко указаны задачи, которые должна выполнять ТРУ." },
    { id: "C3", text: "Функции описаны измеримыми показателями (напр. время нагрева, а не «быстро нагревается»)." },
    { id: "C4", text: "Указаны перечень и условия проведения работ/услуг." },
    { id: "C5", text: "Физические, конструктивные и технологические параметры измеримы и проверяемы." },
    { id: "C6", text: "Установлены конкретные параметры (размер, масса, мощность, производительность, материалы и т.п.)." },
    { id: "C7", text: "Указано, как будет использоваться ТРУ." },
    { id: "C8", text: "Определены условия эксплуатации (температура, влажность, механические нагрузки)." },
    { id: "C9", text: "Указаны требования по обслуживанию и ремонту." },
    { id: "C10", text: "Указаны параметры, подтверждающие качество (сертификация, испытания, надёжность)." },
    { id: "C11", text: "Указаны стандарты качества." },
  ]},
  { section: "Соответствие ГОСТ, СТ, ТР ТС и законодательству", items: [
    { id: "D1", text: "Ссылки в ТС на ГОСТ/СТ/НТД/законодательство РК корректны и действующие." },
    { id: "D2", text: "Содержание характеристик ТС соответствует актуальным ссылкам ГОСТ/СТ/ТР ТС/НТД." },
    { id: "D3", text: "Отсутствие неправильных и/или неактуальных терминов." },
    { id: "D4", text: "Отсутствие противоречий между характеристиками ТРУ и содержанием ГОСТ/СТ/ТР ТС/НТД." },
    { id: "D5", text: "Отсутствие указаний на конкретного производителя/бренд/поставщика без допуска аналогов." },
  ]},
  { section: "Требования к поставщику: опыт и квалификация", items: [
    { id: "E1", text: "Требования к опыту/квалификации специалистов ПП не завышены/занижены." },
    { id: "E2", text: "Недопущение требования об опыте работы при сумме лота менее 75 млн тенге." },
    { id: "E3", text: "Требование об опыте работы ПП не превышает 5 лет." },
    { id: "E4", text: "Требуемые специалисты ПП соответствуют предмету закупки." },
    { id: "E5", text: "Отсутствие требований к оборудованию/сертификации/лицензии, не связанных с предметом закупки." },
    { id: "E10", text: "Наличие чётких критериев квалификации (напр. «электрик с допуском 5-й группы»)." },
    { id: "E11", text: "Требования к лицензиям/разрешениям соответствуют законодательству и предмету закупки." },
  ]},
  { section: "Требования к поставщику: конкурентная среда", items: [
    { id: "E6", text: "Отсутствие требований, выполнимых ограниченным числом поставщиков." },
    { id: "E7", text: "Отсутствие требований к ПП, противоречащих ГОСТ/СТ/ТР ТС/законодательству РК." },
    { id: "E8", text: "Недопустимость формулировок, подходящих только одному/ограниченному числу ПП." },
    { id: "E9", text: "Отсутствие требований, ставящих одних ПП в заведомо выгодное положение." },
  ]},
];
const CHECKLIST_INDEX = {};
CHECKLIST_GROUPS.forEach((g) => g.items.forEach((it) => { CHECKLIST_INDEX[it.id] = { ...it, section: g.section }; }));

function checklistSystemForGroup(group) {
  const itemsText = group.items.map((it) => `${it.id}) ${it.text}`).join("\n");
  const isB8Group = group.items.some((it) => it.id === "B8");
  const b8Method = isB8Group ? `

=== МЕТОДОЛОГИЯ ДЛЯ B8 (идентичность рус/каз текста) ===
Не давай оценку по общему впечатлению. Пройди текст ТС ПОСЛЕДОВАТЕЛЬНО, раздел за разделом (описание ТРУ, функциональные характеристики, технические характеристики, эксплуатационные характеристики, качественные характеристики, требования к поставщику, сроки, объёмы, ссылки на стандарты) и для каждого раздела сверь смысл, цифры, сроки, единицы измерения и перечни между русской и казахской версией по отдельности. Любое расхождение в цифрах, сроках, перечнях пунктов, названиях стандартов или объёме требований между версиями — это status="fail", даже если общий смысл текста кажется похожим. Совпадение по объёму текста или структуре разделов НЕ означает идентичность содержания — сравнивай именно содержание. Если хотя бы одно расхождение найдено — status="fail" и в recommendation укажи точное место (раздел/пункт) и в чём разница между версиями, плюс как это исправить.` : "";
  return `Ты — эксперт-аналитик по аудиту технической спецификации (ТС) закупок АО «НК «ҚТЖ» / АО «Самрук-Қазына». Работай тщательно и дотошно — не давай "pass" по умолчанию, если не проверил пункт по существу на основе присланного текста.

${KB}
${b8Method}

=== ЗАДАЧА ===
Оцени присланные документы СТРОГО по следующим пунктам чек-листа (и только по ним), внимательно перечитав относящиеся к каждому пункту части документов перед вынесением статуса:
${itemsText}

Правила для recommendation:
- Если status="fail" — recommendation должен быть КОНКРЕТНОЙ рекомендуемой редакцией: указывай конкретное место расхождения (пункт/раздел ТС, строку/позицию Плана закупок, номер статьи ГОСТа и т.п.) и как это должно быть сформулировано правильно (не общий совет вида «уточните формулировку», а сам предлагаемый текст, конкретное значение или конкретное действие). Максимум 25 слов.
- Пункт A3 — если в документах нет прямого указания, что закуп у ОТП, оцени доступную часть требования (совпадение срока поставки в ТС и ПЗ) и укажи в recommendation, что статус ОТП не установлен, если это влияет на оценку.
- Если status="info" — recommendation описывает, что именно нужно уточнить или догрузить, максимум 15 слов.
- Если status="pass" — recommendation — пустая строка.

Ответь СТРОГО в формате JSON-массива, без markdown, без пояснений до/после:
[
  {"id": "<id>", "status": "pass"|"fail"|"info", "recommendation": "<см. правила выше>"}
]
Верни ровно один объект на каждый id из списка, в том же порядке.`;
}

function levelClass(level) { return level === "crit" ? "crit" : level === "med" ? "med" : "low"; }
function levelLabel(level) { return level === "crit" ? "Критический" : level === "med" ? "Средний" : "Низкий"; }
function statusPill(status) {
  const map = { pass: ["pass", "Соответствует"], fail: ["fail", "Не соответствует"], na: ["na", "Н/П"], info: ["info", "Недостаточно данных"] };
  const [cls, lbl] = map[status] || ["na", status];
  return { cls, lbl };
}

async function extractDocOrTxt(file) {
  if (file.name.toLowerCase().endsWith(".docx")) {
    const mammoth = (await import("mammoth")).default || (await import("mammoth"));
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value.trim();
  }
  return (await file.text()).trim();
}

function repairTruncatedJson(text) {
  // Пытается «долечить» JSON, обрезанный посередине (например, из-за лимита токенов):
  // отслеживает глубину скобок вне строк и обрезает до последней полностью
  // закрытой позиции на верхнем уровне, затем сама достраивает недостающие скобки.
  const isArray = text.trim().startsWith("[");
  const isObject = text.trim().startsWith("{");
  if (!isArray && !isObject) return null;

  let depth = 0;
  let inStr = false;
  let esc = false;
  let lastSafeIdx = -1;
  const stack = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) { esc = false; }
      else if (c === "\\") { esc = true; }
      else if (c === '"') { inStr = false; }
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === "{" || c === "[") { stack.push(c); depth++; }
    else if (c === "}" || c === "]") {
      stack.pop(); depth--;
      if (depth === 1 && (isArray || isObject)) lastSafeIdx = i; // конец одного элемента/поля верхнего уровня
      if (depth === 0) lastSafeIdx = i; // весь объект/массив закрылся штатно
    }
    else if (c === "," && depth === 1) {
      lastSafeIdx = i - 1 >= 0 ? i - 1 : lastSafeIdx; // запятая после последнего целого элемента
    }
  }
  if (lastSafeIdx < 0) return null;
  let truncated = text.slice(0, lastSafeIdx + 1);
  // пересчитываем стек скобок ровно до точки обрезки, чтобы достроить закрытие правильно
  const st = []; let s2 = false, e2 = false;
  for (let i = 0; i <= lastSafeIdx; i++) {
    const c = text[i];
    if (s2) { if (e2) e2 = false; else if (c === "\\") e2 = true; else if (c === '"') s2 = false; continue; }
    if (c === '"') { s2 = true; continue; }
    if (c === "{" || c === "[") st.push(c);
    else if (c === "}" || c === "]") st.pop();
  }
  const closers = st.reverse().map((c) => (c === "{" ? "}" : "]")).join("");
  try {
    return JSON.parse(truncated + closers);
  } catch {
    return null;
  }
}

async function callAudit(system, userContent, maxTokens) {
  const resp = await fetch("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, userContent, maxTokens }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || `Ошибка сервера (${resp.status})`);
  const textBlock = (data.content || []).map((b) => b.text || "").join("\n").trim();
  if (!textBlock) throw new Error("Модель вернула пустой ответ.");
  const clean = textBlock.replace(/^```json\s*|^```\s*|```$/gm, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const repaired = repairTruncatedJson(clean);
    if (repaired !== null) return repaired;
    const reasonNote = data.finish_reason ? ` Причина остановки: ${data.finish_reason}.` : "";
    const snippet = clean.length > 220 ? `${clean.slice(0, 120)} … ${clean.slice(-100)}` : clean;
    throw new Error(`Не удалось разобрать ответ модели как JSON.${reasonNote} Фрагмент ответа: «${snippet}»`);
  }
}

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function isTransientError(err) {
  const msg = (err?.message || "").toLowerCase();
  return msg.includes("overloaded") || msg.includes("high demand") || msg.includes("unavailable") ||
         msg.includes("try again") || msg.includes("503") || msg.includes("429") || msg.includes("rate limit") || msg.includes("quota");
}

async function callAuditWithRetry(system, userContent, maxTokens, onRetry, retries = 2) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await callAudit(system, userContent, maxTokens);
    } catch (err) {
      lastErr = err;
      if (attempt < retries && isTransientError(err)) {
        const waitMs = 3000 * (attempt + 1); // 3с, затем 6с
        onRetry?.(waitMs, attempt + 1, retries);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

function DropZone({ id, label, hint, onFiles, mini, multiple, iconChar = "\uD83D\uDCC4" }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      className={`drop ${mini ? "drop-mini" : ""} ${drag ? "drag" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files); }}
    >
      <div className="icon">{iconChar}</div>
      <div className="main">{label}</div>
      <div className="hint">{hint}</div>
      <input
        ref={inputRef}
        type="file"
        id={id}
        multiple={multiple}
        accept={mini ? ".docx,.txt" : undefined}
        style={{ display: "none" }}
        onChange={(e) => { if (e.target.files.length) onFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}

export default function Page() {
  const [tsRu, setTsRu] = useState({ text: "", name: "" });
  const [tsKz, setTsKz] = useState({ text: "", name: "" });
  const [plan, setPlan] = useState({ text: "", name: "" });
  const [supplier, setSupplier] = useState({ text: "", name: "" });
  const [extraFiles, setExtraFiles] = useState([]);
  const [enstruCode, setEnstruCode] = useState("");
  const [enstruName, setEnstruName] = useState("");
  const [showPreviewRu, setShowPreviewRu] = useState(false);
  const [showPreviewKz, setShowPreviewKz] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusTxt, setStatusTxt] = useState("");
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [result, setResult] = useState(null);
  const [reportLabel, setReportLabel] = useState("ТС");
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [feedbackInput, setFeedbackInput] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ts_audit_history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  function saveHistory(r, label) {
    try {
      const entry = { date: new Date().toISOString(), reportLabel: label, verdict: r.verdict, verdict_title: r.verdict_title, result: r };
      const next = [entry, ...history].slice(0, 30);
      setHistory(next);
      localStorage.setItem("ts_audit_history", JSON.stringify(next));
    } catch {}
  }

  async function handleTsUpload(files, lang) {
    setErrMsg("");
    const file = files[0];
    try {
      const text = await extractDocOrTxt(file);
      if (!text) throw new Error("Не удалось извлечь текст из файла.");
      if (lang === "ru") setTsRu({ text, name: file.name });
      else setTsKz({ text, name: file.name });
    } catch (err) {
      setErrMsg(`Ошибка чтения файла: ${err.message}`);
    }
  }

  async function handlePlanUpload(files) {
    setErrMsg("");
    const file = files[0];
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      let combined = "";
      wb.SheetNames.forEach((name) => {
        const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name], { blankrows: false });
        if (csv.trim()) combined += `## Лист: ${name}\n${csv.trim()}\n\n`;
      });
      if (!combined.trim()) throw new Error("В файле не найдено данных.");
      setPlan({ text: combined.trim(), name: file.name });
    } catch (err) {
      setErrMsg(`Ошибка чтения плана закупок: ${err.message}`);
    }
  }

  async function handleSupplierUpload(files) {
    setErrMsg("");
    const file = files[0];
    try {
      const text = await extractDocOrTxt(file);
      if (!text) throw new Error("Не удалось извлечь текст из файла.");
      setSupplier({ text, name: file.name });
    } catch (err) {
      setErrMsg(`Ошибка чтения файла: ${err.message}`);
    }
  }

  async function handleExtraUpload(files) {
    setErrMsg("");
    const next = [...extraFiles];
    for (const file of Array.from(files)) {
      try {
        const text = await extractDocOrTxt(file);
        if (text) next.push({ name: file.name, text });
      } catch (err) {
        setErrMsg(`Ошибка чтения ${file.name}: ${err.message}`);
      }
    }
    setExtraFiles(next);
  }

  function buildContextBlock(feedbackList) {
    let block = "";
    if (tsRu.text) block += `Файл ТС (русский язык): ${tsRu.name}\n\nТекст ТС на русском:\n\n${tsRu.text.slice(0, 60000)}\n\n`;
    if (tsKz.text) block += `Файл ТС (қазақ тілі): ${tsKz.name}\n\nТекст ТС на казахском:\n\n${tsKz.text.slice(0, 60000)}\n\n`;
    if (tsRu.text && tsKz.text) block += `Обе языковые версии предоставлены — сверь их на идентичность содержания (п. B8).\n\n`;
    else block += `Предоставлена только одна языковая версия ТС — по п. B8 укажи status "info".\n\n`;
    if (enstruCode || enstruName) {
      block += `---\nДанные ЕНСТРУ по сайту enstru.kz (введены пользователем вручную): код — "${enstruCode || "не указан"}", наименование — "${enstruName || "не указано"}". Сверь с кодом/наименованием ЕНСТРУ в тексте ТС (п. B9).\n\n`;
    } else {
      block += `---\nДанные ЕНСТРУ с сайта enstru.kz не предоставлены — по п. B9 укажи status "info".\n\n`;
    }
    if (plan.text) block += `---\nФайл плана закупок: ${plan.name}\n\nДанные плана закупок:\n\n${plan.text.slice(0, 30000)}\n\n`;
    if (supplier.text) block += `---\nОтдельный файл требований к потенциальному поставщику: ${supplier.name}\n\n${supplier.text.slice(0, 20000)}\n\n`;
    if (extraFiles.length) {
      block += `---\nДополнительные нормативные документы:\n\n`;
      extraFiles.forEach((f) => { block += `## ${f.name}\n${f.text.slice(0, 10000)}\n\n`; });
    }
    if (feedbackList && feedbackList.length) {
      block += `---\n=== ЗАМЕЧАНИЯ ПОЛЬЗОВАТЕЛЯ ПО ПРЕДЫДУЩЕЙ ПРОВЕРКЕ ===\nПользователь указал, что предыдущий отчёт содержал неточности. Обязательно перепроверь именно эти моменты внимательно, перечитав относящиеся части ТС заново, прежде чем выносить статус по соответствующим пунктам:\n`;
      feedbackList.forEach((f, i) => { block += `${i + 1}. ${f.text}\n`; });
      block += `Если замечание пользователя подтверждается текстом документов — обязательно отрази это в findings и/или в соответствующем пункте чек-листа (status="fail" с конкретной рекомендацией). Если замечание не подтверждается — объясни в summary, почему.\n\n`;
    }
    return block;
  }

  async function runAudit(feedbackList) {
    if (!tsRu.text && !tsKz.text) return;
    setErrMsg(""); setResult(null); setLoading(true); setStep(2); setProgress(0);
    const label = [tsRu.name, tsKz.name].filter(Boolean).join(" / ") || "ТС";
    setReportLabel(label);
    const contextBlock = buildContextBlock(feedbackList);
    const softWarnings = [];
    const totalSteps = 1 + CHECKLIST_GROUPS.length;
    let stepsDone = 0;

    try {
      setStatusTxt(`Проверяю блок 1 из ${totalSteps}: общие нарушения и нормативная сверка…`);
      let findingsResult;
      try {
        findingsResult = await callAuditWithRetry(FINDINGS_SYSTEM, contextBlock, 3500, (waitMs, attempt, total) => {
          setStatusTxt(`Модель перегружена, повтор ${attempt}/${total} через ${Math.round(waitMs / 1000)}с…`);
        });
      } catch (err) {
        softWarnings.push(`Не удалось получить общее резюме: ${err.message}`);
        findingsResult = { verdict: "warn", verdict_title: "Резюме недоступно", summary: "", risk_counts: { critical: 0, medium: 0, low: 0 }, findings: [], missing_refs: [] };
      }
      stepsDone++; setProgress(Math.round((stepsDone / totalSteps) * 100));

      const fullChecklist = [];
      for (const group of CHECKLIST_GROUPS) {
        setStatusTxt(`Проверяю блок ${stepsDone + 1} из ${totalSteps}: ${group.section}…`);
        try {
          const groupResult = await callAuditWithRetry(checklistSystemForGroup(group), contextBlock, 3000, (waitMs, attempt, total) => {
            setStatusTxt(`Модель перегружена (блок «${group.section}»), повтор ${attempt}/${total} через ${Math.round(waitMs / 1000)}с…`);
          });
          groupResult.forEach((r) => {
            const meta = CHECKLIST_INDEX[r.id];
            if (meta) fullChecklist.push({ ...meta, status: r.status, recommendation: r.recommendation || "" });
          });
        } catch (err) {
          softWarnings.push(`Блок «${group.section}» не удалось проверить: ${err.message}. Запустите проверку повторно.`);
          group.items.forEach((it) => {
            fullChecklist.push({ ...it, section: group.section, status: "info", recommendation: "Не удалось получить ответ модели для этого блока — запустите проверку заново." });
          });
        }
        stepsDone++; setProgress(Math.round((stepsDone / totalSteps) * 100));
      }

      const combined = { ...findingsResult, checklist: fullChecklist, soft_warnings: softWarnings };
      setResult(combined);
      saveHistory(combined, label);
      setStep(3);
    } catch (err) {
      setErrMsg(`Не удалось получить или разобрать ответ модели. ${err.message}`);
      setStep(1);
    } finally {
      setLoading(false); setStatusTxt("");
    }
  }

  function newAudit() {
    setResult(null); setStep(1);
    setTsRu({ text: "", name: "" }); setTsKz({ text: "", name: "" });
    setPlan({ text: "", name: "" }); setSupplier({ text: "", name: "" });
    setExtraFiles([]); setEnstruCode(""); setEnstruName("");
    setFeedbackHistory([]); setFeedbackInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitFeedback() {
    const text = feedbackInput.trim();
    if (!text || loading) return;
    const newHistory = [...feedbackHistory, { text, date: new Date().toISOString() }];
    setFeedbackHistory(newHistory);
    setFeedbackInput("");
    await runAudit(newHistory);
  }

  function downloadReport(r, label) {
    let md = `# Аудит ТС — ${label}\n\n**Вердикт:** ${r.verdict_title}\n\n${r.summary}\n\n`;
    md += `## Сводка рисков\n- Критические: ${r.risk_counts?.critical ?? 0}\n- Средние: ${r.risk_counts?.medium ?? 0}\n- Низкие: ${r.risk_counts?.low ?? 0}\n\n`;
    if (r.missing_refs?.length) {
      md += `## Возможно потребуются доп. документы\n`;
      r.missing_refs.forEach((m) => { md += `- ${m}\n`; });
      md += `\n`;
    }
    md += `## Замечания\n`;
    (r.findings || []).forEach((f, i) => {
      md += `\n### Замечание ${i + 1} (${levelLabel(f.level)})\n- Фрагмент: «${f.fragment}»\n- Норма: ${f.norm}\n- Суть: ${f.issue}\n- Рекомендация: ${f.recommendation}\n`;
    });
    md += `\n## Постатейный чек-лист\n`;
    let curSection = null;
    (r.checklist || []).forEach((c) => {
      if (c.section !== curSection) { md += `\n### ${c.section}\n`; curSection = c.section; }
      const s = c.status === "pass" ? "Соответствует" : c.status === "fail" ? "Не соответствует" : "Недостаточно данных";
      md += `- **${c.id}** [${s}] ${c.text}${c.recommendation ? ` — _${c.recommendation}_` : ""}\n`;
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `audit_${label.replace(/[^\wа-яА-ЯёЁ-]+/g, "_").slice(0, 60)}.md`;
    a.click();
  }

  const runDisabled = loading || (!tsRu.text && !tsKz.text);

  return (
    <div className="wrap">
      <div className="head">
        <p className="eyebrow">АО «НК «ҚТЖ» · Департамент правовой экспертизы закупок</p>
        <h1>Аудит технической спецификации</h1>
        <p className="sub">Проверка ТС на соответствие Порядку закупок АО «Самрук-Қазына», Правилам взаимодействия СП АО «НК «ҚТЖ» и постатейному чек-листу.</p>
      </div>

      <div className="rail">
        <div className={`tie ${step === 1 ? "active" : step > 1 ? "done" : ""}`}><div className="dot">1</div><div className="lbl">Загрузка данных</div></div>
        <div className={`tie ${step === 2 ? "active" : step > 2 ? "done" : ""}`}><div className="dot">2</div><div className="lbl">Анализ</div></div>
        <div className={`tie ${step === 3 ? "active" : ""}`}><div className="dot">3</div><div className="lbl">Отчёт</div></div>
      </div>

      <div className="card">
        <h2>1. Техническая спецификация</h2>
        <p className="sub" style={{ margin: "0 0 14px" }}>Если ТС оформлена на двух языках — загрузите обе версии, агент сверит их идентичность (п. B8). Достаточно и одной версии.</p>
        <div className="lang-grid">
          <div className="lang-col">
            <div className="lang-lbl">Русский язык</div>
            <DropZone id="tsRuInput" label="Файл ТС (рус)" hint=".docx или .txt" mini onFiles={(f) => handleTsUpload(f, "ru")} />
            {tsRu.name && (
              <>
                <div className="filebar"><span className="name">{tsRu.name} · ~{tsRu.text.split(/\s+/).filter(Boolean).length} слов</span><button className="remove" onClick={() => setTsRu({ text: "", name: "" })}>убрать ✕</button></div>
                <button className="toggle-preview" onClick={() => setShowPreviewRu((v) => !v)}>{showPreviewRu ? "Скрыть текст" : "Показать текст"}</button>
                <div className={`preview ${showPreviewRu ? "open" : ""}`}><pre>{tsRu.text.slice(0, 6000)}{tsRu.text.length > 6000 ? "\n…" : ""}</pre></div>
              </>
            )}
          </div>
          <div className="lang-col">
            <div className="lang-lbl">Қазақ тілі</div>
            <DropZone id="tsKzInput" label="ТС файлы (қаз)" hint=".docx немесе .txt" mini onFiles={(f) => handleTsUpload(f, "kz")} />
            {tsKz.name && (
              <>
                <div className="filebar"><span className="name">{tsKz.name} · ~{tsKz.text.split(/\s+/).filter(Boolean).length} слов</span><button className="remove" onClick={() => setTsKz({ text: "", name: "" })}>убрать ✕</button></div>
                <button className="toggle-preview" onClick={() => setShowPreviewKz((v) => !v)}>{showPreviewKz ? "Скрыть текст" : "Показать текст"}</button>
                <div className={`preview ${showPreviewKz ? "open" : ""}`}><pre>{tsKz.text.slice(0, 6000)}{tsKz.text.length > 6000 ? "\n…" : ""}</pre></div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>2. Код ЕНС ТРУ <span style={{ fontWeight: 400, color: "var(--ink-faint)", fontSize: 13 }}>(сверка вручную)</span></h2>
        <p className="sub" style={{ margin: "0 0 10px" }}>
          Портал enstru.kz запрещает автоматический доступ (robots.txt), поэтому найдите код вручную и вставьте результат сюда —
          агент сверит его с кодом в тексте ТС и в Плане закупок.
        </p>
        <a className="enstru-link" href="https://enstru.kz" target="_blank" rel="noopener noreferrer">Открыть enstru.kz →</a>
        <div className="field-grid" style={{ marginTop: 14 }}>
          <div className="field">
            <label htmlFor="enstruCode">Код ЕНСТРУ</label>
            <input id="enstruCode" type="text" value={enstruCode} onChange={(e) => setEnstruCode(e.target.value)} placeholder="напр. 25.11.23.100.000001" />
          </div>
          <div className="field">
            <label htmlFor="enstruName">Наименование по enstru.kz</label>
            <input id="enstruName" type="text" value={enstruName} onChange={(e) => setEnstruName(e.target.value)} placeholder="наименование ТРУ по справочнику" />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>3. План закупок <span style={{ fontWeight: 400, color: "var(--ink-faint)", fontSize: 13 }}>(Excel, опционально)</span></h2>
        <p className="sub" style={{ margin: "0 0 14px" }}>Сверяются код ЕНСТРУ, наименование, характеристики, единицы измерения, объёмы и доп. характеристики — с описанием ТРУ в ТС.</p>
        <DropZone id="planInput" label="Перетащите файл плана закупок сюда или нажмите, чтобы выбрать" hint=".xlsx или .xls" onFiles={handlePlanUpload} iconChar="\uD83D\uDCCA" />
        {plan.name && <div className="filebar"><span className="name">{plan.name} · ~{plan.text.split("\n").filter(Boolean).length} строк</span><button className="remove" onClick={() => setPlan({ text: "", name: "" })}>убрать ✕</button></div>}
      </div>

      <div className="card">
        <h2>4. Требования к потенциальному поставщику <span style={{ fontWeight: 400, color: "var(--ink-faint)", fontSize: 13 }}>(опционально)</span></h2>
        <p className="sub" style={{ margin: "0 0 14px" }}>По умолчанию агент сам находит и проверяет этот раздел внутри текста ТС (обычно он в конце документа). Загружайте файл сюда, только если требования оформлены отдельным документом.</p>
        <DropZone id="supplierInput" label="Файл требований к поставщику" hint=".docx или .txt" onFiles={handleSupplierUpload} />
        {supplier.name && <div className="filebar"><span className="name">{supplier.name}</span><button className="remove" onClick={() => setSupplier({ text: "", name: "" })}>убрать ✕</button></div>}
      </div>

      <div className="card">
        <h2>5. Дополнительные документы <span style={{ fontWeight: 400, color: "var(--ink-faint)", fontSize: 13 }}>(опционально)</span></h2>
        <p className="sub" style={{ margin: "0 0 14px" }}>ГОСТы, СТ РК, ТР ТС и иные нормативные документы, на которые ссылается ТС, если их нет во встроенной базе агента.</p>
        <DropZone id="extraInput" label="Перетащите файлы или нажмите, чтобы выбрать" hint=".docx или .txt, можно несколько" multiple onFiles={handleExtraUpload} iconChar="\uD83D\uDCC1" />
        <div className="multi-file-list">
          {extraFiles.map((f, i) => (
            <div className="filebar" key={i}><span className="name">{f.name}</span><button className="remove" onClick={() => setExtraFiles(extraFiles.filter((_, idx) => idx !== i))}>убрать ✕</button></div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="runbar">
          <button className="primary" disabled={runDisabled} onClick={() => runAudit()}>Запустить аудит</button>
          <div className={`spinner ${loading ? "on" : ""}`} />
          <span className="status-txt">{statusTxt}</span>
        </div>
        <div className={`progress-track ${loading ? "on" : ""}`}><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
        {errMsg && <div className="err">{errMsg}</div>}
      </div>

      {history.length > 0 && (
        <div className="card">
          <button className="hist-toggle" onClick={() => setShowHistory((v) => !v)}>Предыдущие проверки ({history.length}) ▾</button>
          {showHistory && (
            <div>
              {history.map((it, i) => (
                <div className="hist-item" key={i} onClick={() => { setResult(it.result); setReportLabel(it.reportLabel); setStep(3); }}>
                  <span className="hname">{it.reportLabel} — {it.verdict_title}</span>
                  <span className="hdate">{new Date(it.date).toLocaleDateString("ru-RU")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {result && <Results r={result} label={reportLabel} onDownload={() => downloadReport(result, reportLabel)} onNew={newAudit} />}

      {result && (
        <div className="card">
          <h2>Уточнить результат</h2>
          <p className="sub" style={{ margin: "0 0 14px" }}>
            Если видите неточность в отчёте — например, реальное расхождение между русской и казахской версией ТС,
            которое агент не отметил, или неверный вывод по какому-то пункту — опишите это ниже. Агент перечитает
            документы заново с учётом вашего замечания и обновит отчёт.
          </p>
          {feedbackHistory.length > 0 && (
            <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {feedbackHistory.map((f, i) => (
                <div key={i} style={{ background: "#F5F6F5", border: "1px solid var(--line)", borderRadius: 8, padding: "10px 12px", fontSize: 13.5 }}>
                  <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginBottom: 4 }}>
                    Вы · {new Date(f.date).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {f.text}
                </div>
              ))}
            </div>
          )}
          <textarea
            value={feedbackInput}
            onChange={(e) => setFeedbackInput(e.target.value)}
            placeholder="Например: казахская версия ТС в разделе «Технические характеристики» указывает мощность 5 кВт, а русская — 7 кВт — это расхождение, агент его не отметил"
            rows={3}
            style={{
              width: "100%", padding: "10px 12px", border: "1px solid var(--line-strong)", borderRadius: 8,
              fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 14, color: "var(--ink)", resize: "vertical",
            }}
          />
          <div className="runbar" style={{ marginTop: 12 }}>
            <button className="primary" disabled={!feedbackInput.trim() || loading} onClick={submitFeedback}>
              Уточнить и повторить аудит
            </button>
            <div className={`spinner ${loading ? "on" : ""}`} />
            <span className="status-txt">{statusTxt}</span>
          </div>
          {errMsg && <div className="err">{errMsg}</div>}
        </div>
      )}

      <p className="note">Отчёт носит справочный характер и не заменяет заключение эксперта по закупкам. Код ЕНСТРУ сверяется с данными, которые вы вносите вручную с enstru.kz — сайт не имеет автоматического доступа к порталу.</p>
    </div>
  );
}

function Results({ r, label, onDownload, onNew }) {
  const vClass = r.verdict === "ok" ? "ok" : r.verdict === "bad" ? "bad" : "warn";
  const badgeTxt = r.verdict === "ok" ? "Принято" : r.verdict === "bad" ? "Отклонено" : "Доработка";

  let curSection = null;

  return (
    <>
      <div className="card">
        <h2>Резюме аудита</h2>
        {r.soft_warnings?.length > 0 && (
          <div className="callout danger" style={{ marginTop: 0, marginBottom: 14 }}>
            <b>Часть блоков не удалось получить:</b>
            <ul>{r.soft_warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
        )}
        <div className={`verdict ${vClass}`}>
          <span className="badge">{badgeTxt}</span>
          <div className="vtext"><div className="vtitle">{r.verdict_title}</div>{r.summary}</div>
        </div>
        <div className="metrics">
          <div className="metric crit"><div className="num">{r.risk_counts?.critical ?? 0}</div><div className="lbl">Критические</div></div>
          <div className="metric med"><div className="num">{r.risk_counts?.medium ?? 0}</div><div className="lbl">Средние</div></div>
          <div className="metric low"><div className="num">{r.risk_counts?.low ?? 0}</div><div className="lbl">Низкие / замечания</div></div>
        </div>
        {r.supplier_requirements_status === "absent" && (
          <div className="callout">
            <b>Раздел требований к потенциальному поставщику отсутствует.</b> Он не найден ни в тексте ТС, ни в отдельном приложенном файле — пункты E1-E11 в чек-листе ниже помечены как «недостаточно данных» именно по этой причине.
          </div>
        )}
        {r.missing_refs?.length > 0 && (
          <div className="callout">
            <b>Возможно потребуются дополнительные документы.</b> ТС ссылается на документы, не покрытые встроенной базой:
            <ul>{r.missing_refs.map((m, i) => <li key={i}>{m}</li>)}</ul>
            Загрузите их в раздел «5. Дополнительные документы» и запустите проверку заново.
          </div>
        )}
      </div>

      {r.findings?.length > 0 && (
        <div className="card">
          <h2>Детализация замечаний</h2>
          {r.findings.map((f, i) => (
            <div className={`finding ${levelClass(f.level)}`} key={i}>
              <div className="frow"><span className="flevel">{levelLabel(f.level)}</span><span className="fnorm">{f.norm}</span></div>
              {f.fragment && <div className="ffrag">«{f.fragment}»</div>}
              <div className="fissue">{f.issue}</div>
              {f.recommendation && <div className="frec"><b>Рекомендация:</b> {f.recommendation}</div>}
            </div>
          ))}
        </div>
      )}

      {r.checklist?.length > 0 && (
        <div className="card">
          <h2>Постатейный чек-лист</h2>
          {(() => {
            const blocks = [];
            let rows = [];
            r.checklist.forEach((c, idx) => {
              if (c.section !== curSection) {
                if (rows.length) blocks.push(<table className="chk" key={`t-${blocks.length}`}><thead><tr><th style={{ width: 44 }}>№</th><th>Статус</th><th>Пункт / рекомендация</th></tr></thead><tbody>{rows}</tbody></table>);
                blocks.push(<div className="chk-section-title" key={`s-${idx}`}>{c.section}</div>);
                rows = [];
                curSection = c.section;
              }
              const { cls, lbl } = statusPill(c.status);
              rows.push(
                <tr key={c.id}>
                  <td className="id">{c.id}</td>
                  <td><span className={`pill ${cls}`}>{lbl}</span></td>
                  <td><div>{c.text}</div>{c.recommendation && <div style={{ marginTop: 4, color: "var(--ink-soft)" }}><b style={{ color: "var(--ink)" }}>→</b> {c.recommendation}</div>}</td>
                </tr>
              );
            });
            if (rows.length) blocks.push(<table className="chk" key={`t-final`}><thead><tr><th style={{ width: 44 }}>№</th><th>Статус</th><th>Пункт / рекомендация</th></tr></thead><tbody>{rows}</tbody></table>);
            curSection = null;
            return blocks;
          })()}
        </div>
      )}

      <div className="actions">
        <button className="ghost" onClick={onDownload}>Скачать отчёт (.md)</button>
        <button className="ghost" onClick={onNew}>Новая проверка</button>
      </div>
    </>
  );
}
