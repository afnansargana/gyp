const Service = require("../models/Service");

const RULES = [
  {
    keys: ["brake", "braking", "squeal", "squeaking", "rattle when brak"],
    issue: "Brake system wear",
    detail:
      "Rattling or squealing while braking often means worn pads, warped rotors, or loose caliper hardware.",
    serviceHint: "brake",
    urgency: "high",
  },
  {
    keys: ["overheat", "temperature", "coolant", "steam"],
    issue: "Cooling system fault",
    detail:
      "Overheating can come from low coolant, a failing thermostat, water pump, or radiator fan.",
    serviceHint: "cool",
    urgency: "high",
  },
  {
    keys: ["battery", "won't start", "wont start", "clicking", "dead"],
    issue: "Battery / charging system",
    detail:
      "Clicking or a no-start condition usually points to a weak battery, alternator, or starter.",
    serviceHint: "batter",
    urgency: "medium",
  },
  {
    keys: ["oil", "leak", "burning smell"],
    issue: "Oil leak or overdue oil service",
    detail:
      "Oil smell, spots under the car, or a low-oil warning needs inspection and likely an oil service.",
    serviceHint: "oil",
    urgency: "medium",
  },
  {
    keys: ["ac", "a/c", "air condition", "not cooling", "warm air"],
    issue: "A/C performance issue",
    detail:
      "Warm cabin air is often low refrigerant, a compressor issue, or a clogged cabin filter.",
    serviceHint: "ac",
    urgency: "low",
  },
  {
    keys: ["engine", "check engine", "misfire", "rough idle", "knock"],
    issue: "Engine performance / diagnostics",
    detail:
      "A check-engine light, misfire, or knock should be scanned with OEM-level diagnostics.",
    serviceHint: "engine",
    urgency: "high",
  },
  {
    keys: ["tire", "alignment", "pulling", "vibration"],
    issue: "Tires / alignment",
    detail:
      "Pulling or vibration is commonly uneven tire wear, a bent rim, or alignment drift.",
    serviceHint: "tire",
    urgency: "medium",
  },
  {
    keys: ["hybrid", "inverter", "ev", "electric"],
    issue: "Hybrid / EV electrical system",
    detail:
      "Hybrid warnings need high-voltage trained technicians and scanner diagnostics.",
    serviceHint: "hybrid",
    urgency: "high",
  },
];

function matchRule(text) {
  const hay = text.toLowerCase();
  return RULES.find((rule) => rule.keys.some((k) => hay.includes(k))) || null;
}

function pickService(services, hint, fallbackName) {
  if (!services?.length) {
    return { id: null, name: fallbackName || "General Inspection" };
  }
  const hinted = hint
    ? services.find((s) => s.name.toLowerCase().includes(hint))
    : null;
  const general =
    services.find((s) => /inspect|diagnos|general/i.test(s.name)) ||
    services[0];
  const chosen = hinted || general;
  return { id: chosen._id, name: chosen.name };
}

async function heuristicAnalyze(symptoms) {
  const services = await Service.find().lean();
  const rule = matchRule(symptoms);
  if (!rule) {
    const service = pickService(services, "inspect", "General Inspection");
    return {
      source: "rules",
      summary:
        "I could not pin a single fault from that description. A general inspection is the safest next step.",
      issues: [
        {
          title: "Needs hands-on diagnostics",
          detail:
            "Share more detail (when it happens, warning lights, recent work) or book an inspection.",
          urgency: "medium",
        },
      ],
      recommendedService: service,
    };
  }

  const service = pickService(services, rule.serviceHint, rule.issue);
  return {
    source: "rules",
    summary: `${rule.issue}: ${rule.detail}`,
    issues: [
      {
        title: rule.issue,
        detail: rule.detail,
        urgency: rule.urgency,
      },
    ],
    recommendedService: service,
  };
}

async function geminiAnalyze(symptoms) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const services = await Service.find().lean();
  const catalog = services.map((s) => `${s._id}::${s.name}`).join("\n") || "none";

  const prompt = `You are AutoFixHub's senior diagnostic advisor for a workshop in Islamabad.
Customer symptoms: """${symptoms}"""
Available services (id::name):
${catalog}

Reply with JSON only:
{
  "summary": "2 sentence diagnosis",
  "issues": [{"title":"", "detail":"", "urgency":"low|medium|high"}],
  "recommendedServiceId": "mongo id or null",
  "recommendedServiceName": "exact catalog name or General Inspection"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(text);
  const matched =
    services.find(
      (s) => String(s._id) === String(parsed.recommendedServiceId)
    ) ||
    services.find(
      (s) =>
        s.name.toLowerCase() ===
        String(parsed.recommendedServiceName || "").toLowerCase()
    );

  return {
    source: "gemini",
    summary: parsed.summary,
    issues: parsed.issues || [],
    recommendedService: matched
      ? { id: matched._id, name: matched.name }
      : pickService(services, null, parsed.recommendedServiceName),
  };
}

async function analyzeSymptoms(symptoms) {
  try {
    const ai = await geminiAnalyze(symptoms);
    if (ai) return ai;
  } catch (err) {
    console.error("[ai.service] Gemini failed, using rules:", err.message);
  }
  return heuristicAnalyze(symptoms);
}

module.exports = { analyzeSymptoms };
