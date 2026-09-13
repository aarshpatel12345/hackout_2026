const { calculateFallbackAnalysis } = require('./geminiService');

async function detectEmissionLeaks(data) {
    const apiKey = process.env.GEMINI_API_KEY;

    const promptText = `
You are an expert industrial carbon emissions analyst.
Analyze the following factory data and generate an "Emission Leak Detector" response in strictly valid JSON format.

Data Input:
${JSON.stringify(data, null, 2)}

Requirements:
1. Identify 4-6 specific emission sources in the factory (e.g. Boiler, Dryer, Electricity, Logistics, Wastewater) and estimate their carbon footprint (tCO2e/year).
2. Calculate total emissions.
3. Categorize each source into Scope 1, Scope 2, or Scope 3.
4. Provide a "sankey" array with flow mapping from each source to its Scope category. 
5. Identify the top leak points and give a reason for why they are inefficient.

Respond ONLY with JSON using this exact structure:
{
  "totalEmissions": 1050,
  "sources": [
    {"name": "Boiler", "value": 420},
    {"name": "Dryer", "value": 180},
    {"name": "Electricity", "value": 250},
    {"name": "Logistics", "value": 120},
    {"name": "Wastewater", "value": 80}
  ],
  "scopes": {
    "Scope 1": 600,
    "Scope 2": 250,
    "Scope 3": 200
  },
  "sankey": [
    {"source": "Boiler", "target": "Scope 1", "value": 420},
    {"source": "Dryer", "target": "Scope 1", "value": 180},
    {"source": "Electricity", "target": "Scope 2", "value": 250},
    {"source": "Logistics", "target": "Scope 3", "value": 120},
    {"source": "Wastewater", "target": "Scope 3", "value": 80}
  ],
  "leakPoints": [
    {"point": "Boiler", "reason": "Coal combustion emissions."}
  ]
}
`;

    if (apiKey) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
                }),
            });

            if (response.ok) {
                const jsonResp = await response.json();
                const responseText = jsonResp?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (responseText) {
                    const cleanJsonStr = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
                    return JSON.parse(cleanJsonStr);
                }
            }
        } catch (err) {
            console.warn("Gemini AI failed for leak detector, using fallback:", err.message);
        }
    }

    // Fallback logic
    return {
        "totalEmissions": 1050,
        "sources": [
            { "name": "Boiler", "value": 420 },
            { "name": "Dryer", "value": 180 },
            { "name": "Electricity", "value": 250 },
            { "name": "Logistics", "value": 120 },
            { "name": "Wastewater", "value": 80 }
        ],
        "scopes": {
            "Scope 1": 600,
            "Scope 2": 250,
            "Scope 3": 200
        },
        "sankey": [
            { "source": "Boiler", "target": "Scope 1", "value": 420 },
            { "source": "Dryer", "target": "Scope 1", "value": 180 },
            { "source": "Electricity", "target": "Scope 2", "value": 250 },
            { "source": "Logistics", "target": "Scope 3", "value": 120 },
            { "source": "Wastewater", "target": "Scope 3", "value": 80 }
        ],
        "leakPoints": [
            { "point": "Boiler", "reason": "Coal combustion emissions." },
            { "point": "Dryer", "reason": "LPG inefficiency." },
            { "point": "Wastewater Plant", "reason": "Methane release." },
            { "point": "Logistics", "reason": "Diesel transportation." }
        ]
    };
}

module.exports = { detectEmissionLeaks };
