/**
 * Gemini AI & IPCC Fallback Calculation Engine
 * Analyzes SME Process Data (Energy, Materials, Waste, Processes, Costs, Constraints)
 * Outputs: Total Carbon Footprint (tCO2e/yr), Top Emission Sources, and Prioritized Circular Interventions.
 */

// Default emission factors (tCO2e per unit)
const EMISSION_FACTORS = {
	// Energy (per unit)
	electricity: 0.00082, // tCO2e per kWh
	grid: 0.00082,
	diesel: 0.00268, // tCO2e per Liter
	"natural gas": 0.002, // tCO2e per m3 / unit
	gas: 0.002,
	coal: 0.0024, // tCO2e per kg
	solar: 0.00005,
	wind: 0.00002,

	// Materials (per kg)
	steel: 0.0018, // tCO2e per kg virgin steel
	"virgin steel": 0.0018,
	aluminum: 0.0089, // tCO2e per kg virgin aluminum
	plastic: 0.0025,
	polyethylene: 0.0025,
	concrete: 0.00015,
	paper: 0.0011,

	// Waste (per kg)
	landfill: 0.0005,
	incineration: 0.0007,
	recycling: 0.0001,
	"e-waste": 0.0012,
	"metal scrap": 0.0002,
};

/**
 * Perform rule-based IPCC emission calculation fallback
 */
function calculateFallbackAnalysis(onboardingData) {
	const business = onboardingData?.business || {};
	const energy = onboardingData?.energy || [];
	const materials = onboardingData?.materials || [];
	const waste = onboardingData?.waste || [];
	const costs = onboardingData?.costs || {};
	const constraints = onboardingData?.constraints || {};

	let totalEmissions = 0;
	const sourcesMap = new Map();

	// 1. Calculate Energy Emissions
	energy.forEach((item) => {
		const name = item.energyType || "Electricity (Grid)";
		const qty = Number(item.quantity) || 500000;
		const lowerName = name.toLowerCase();

		let factor = 0.00082; // default grid factor
		for (const key in EMISSION_FACTORS) {
			if (lowerName.includes(key)) {
				factor = EMISSION_FACTORS[key];
				break;
			}
		}
		const emissions = Math.round(qty * factor);
		totalEmissions += emissions;
		sourcesMap.set(name, (sourcesMap.get(name) || 0) + emissions);
	});

	// If no energy items provided, add baseline grid default
	if (energy.length === 0) {
		const defaultEmissions = 520;
		totalEmissions += defaultEmissions;
		sourcesMap.set("Natural Gas & Grid Energy", defaultEmissions);
	}

	// 2. Calculate Material Emissions
	materials.forEach((item) => {
		const name = item.materialName || "Virgin Steel";
		const qty = Number(item.quantity) || 200000;
		const isVirgin = item.materialType === "Virgin";
		const lowerName = name.toLowerCase();

		let factor = 0.0018;
		for (const key in EMISSION_FACTORS) {
			if (lowerName.includes(key)) {
				factor = EMISSION_FACTORS[key];
				break;
			}
		}
		if (!isVirgin) factor = factor * 0.25; // Recycled has 75% lower emissions

		const emissions = Math.round(qty * factor);
		totalEmissions += emissions;
		sourcesMap.set(name, (sourcesMap.get(name) || 0) + emissions);
	});

	if (materials.length === 0) {
		const defaultEmissions = 380;
		totalEmissions += defaultEmissions;
		sourcesMap.set("Virgin Steel Raw Feedstock", defaultEmissions);
	}

	// 3. Calculate Waste Emissions
	waste.forEach((item) => {
		const name = item.wasteType || "Process Waste";
		const qty = Number(item.quantity) || 150000;
		const method = (item.disposalMethod || "Landfill").toLowerCase();

		let factor = 0.0005;
		for (const key in EMISSION_FACTORS) {
			if (method.includes(key)) {
				factor = EMISSION_FACTORS[key];
				break;
			}
		}
		const emissions = Math.round(qty * factor);
		totalEmissions += emissions;
		sourcesMap.set(
			name + " (" + item.disposalMethod + ")",
			(sourcesMap.get(name) || 0) + emissions,
		);
	});

	if (waste.length === 0) {
		const defaultEmissions = 190;
		totalEmissions += defaultEmissions;
		sourcesMap.set("Process Solid Waste (Landfill)", defaultEmissions);
	}

	// Ensure reasonable baseline total ONLY if no inputs provided
	if (totalEmissions === 0) {
		totalEmissions = 1240;
		sourcesMap.clear();
		sourcesMap.set("Natural Gas", 520);
		sourcesMap.set("Virgin Steel", 380);
		sourcesMap.set("Process Waste", 190);
		sourcesMap.set("Grid Electricity", 150);
	}

	// Sort Top Emission Sources
	const sortedSources = Array.from(sourcesMap.entries())
		.map(([source, emissions]) => ({
			source,
			emissions,
			unit: "tCO2e",
			percentage: Math.round((emissions / totalEmissions) * 100) || 1,
		}))
		.sort((a, b) => b.emissions - a.emissions)
		.slice(0, 4);

	// Generate Tailored Prioritized Circular Interventions
	const topSource = sortedSources[0]?.source || "Energy & Materials";
	const recommendations = [
		{
			id: 1,
			title: `Optimize ${topSource} consumption and feedstock circularity`,
			category: "Material & Fuel Circularity",
			co2Reduction: `${Math.round(totalEmissions * 0.12)} tCO2e/year`,
			estimatedCost: "₹8 lakh",
			payback: "1.8 years",
			priority: "HIGH",
			description: `Transition high-impact ${topSource} usage to low-emission certified recycled alternatives to reduce Scope 1 & 3 carbon footprint.`,
		},
		{
			id: 2,
			title: "Install waste-heat & thermal recovery systems",
			category: "Energy Efficiency",
			co2Reduction: `${Math.round(totalEmissions * 0.09)} tCO2e/year`,
			estimatedCost: "₹5 lakh",
			payback: "1.5 years",
			priority: "HIGH",
			description:
				"Capture flue gas and process waste thermal energy to pre-heat primary operations, reducing raw energy demand.",
		},
		{
			id: 3,
			title: "Closed-loop process waste recycling & briquetting",
			category: "Waste Reduction",
			co2Reduction: `${Math.round(totalEmissions * 0.06)} tCO2e/year`,
			estimatedCost: "₹2.5 lakh",
			payback: "1.2 years",
			priority: "MEDIUM",
			description:
				"Implement automated scrap sorting and scrap re-feeding directly back into production cycles.",
		},
	];

	// Generate AI Executive Summary Paragraph
	const aiSummaryParagraph = `Based on comprehensive Scope 1-3 carbon accounting, your enterprise currently generates an estimated ${totalEmissions.toLocaleString()} tCO2e/year in total greenhouse emissions. The primary emission driver is ${topSource}, accounting for ${sortedSources[0]?.percentage || 40}% of total emissions. By implementing prioritized circular economy strategies—such as transitioning high-volume feedstock to certified recycled materials, deploying waste-heat recovery on primary thermal infrastructure, and setting up automated scrap reprocessing—your plant can achieve up to 24% net carbon reduction while generating substantial annual operational savings with payback periods under 2 years.`;

	// Generate Waste Reusability & Target Industries Feedstock Matchmaking
	const wasteReuseMatches = (
		waste.length > 0
			? waste
			: [
					{ wasteType: "Process Solid Waste", disposalMethod: "Landfill" },
					{ wasteType: "Metal & Industrial Scrap", disposalMethod: "Landfill" },
					{
						wasteType: "Flue Gas & Thermal Exhaust",
						disposalMethod: "Incineration",
					},
				]
	).map((wItem, idx) => {
		const wName = wItem.wasteType || "Industrial Slag / Scrap";
		const lowerW = wName.toLowerCase();

		if (
			lowerW.includes("metal") ||
			lowerW.includes("steel") ||
			lowerW.includes("scrap")
		) {
			return {
				id: idx + 1,
				strategyName: "Direct Foundry Sales",
				strategyDescription:
					"Briquette and segregate high-purity scrap to sell directly to electric arc furnace foundries as secondary raw feedstock, diverting 95%+ from landfills.",
				wasteUsedAsRawMaterial: wName,
				targetOrganizations:
					"Foundries, Steel Rolling Mills, Metallurgy Plants",
				marketValueRange: "₹22,000 - ₹35,000 / ton",
			};
		} else if (
			lowerW.includes("ash") ||
			lowerW.includes("slag") ||
			lowerW.includes("solid")
		) {
			return {
				id: idx + 1,
				strategyName: "Eco-Cement Integration",
				strategyDescription:
					"Supply non-hazardous solid residue to local cement clinker manufacturers as a calcined clay/silica substitute for eco-friendly concrete production.",
				wasteUsedAsRawMaterial: wName,
				targetOrganizations:
					"Cement Manufacturers, Concrete Block Plants, Road Construction",
				marketValueRange: "₹1,500 - ₹3,000 / ton",
			};
		} else {
			return {
				id: idx + 1,
				strategyName: "B2B Byproduct Exchange",
				strategyDescription:
					"Establish B2B circular byproduct exchange agreements with regional material recyclers to convert process waste into industrial packaging filler or secondary fuel.",
				wasteUsedAsRawMaterial: wName,
				targetOrganizations:
					"Recycled Packaging Plants, Thermal Power Auxiliary, Fertilizer Manufacturing",
				marketValueRange: "₹8,000 - ₹15,000 / ton",
			};
		}
	});

	return {
		totalCarbonFootprint: totalEmissions,
		unit: "tCO2e/year",
		topEmissionSources: sortedSources,
		recommendations,
		aiSummaryParagraph,
		wasteReuseMatches,
		calculationEngine: "IPCC Emission Factor Engine",
		analyzedAt: new Date().toISOString(),
	};
}

/**
 * Call Gemini AI model to calculate emissions and circular interventions
 */
async function analyzeCarbonFootprint(onboardingData) {
	const energy = onboardingData?.energy || [];
	const materials = onboardingData?.materials || [];
	const waste = onboardingData?.waste || [];
	const hasEnoughData =
		energy.length > 0 || materials.length > 0 || waste.length > 0;

	const apiKey = process.env.GEMINI_API_KEY;

	if (!hasEnoughData) {
		console.log(
			"Not enough onboarding data provided. Using fallback IPCC calculation engine with default baseline.",
		);
		return calculateFallbackAnalysis(onboardingData);
	}

	if (!apiKey) {
		console.log(
			"No GEMINI_API_KEY set in server env. Using fallback IPCC calculation engine.",
		);
		return calculateFallbackAnalysis(onboardingData);
	}

	const promptText = `
You are an expert industrial carbon footprint auditor and circular economy specialist.
Analyze the following SME process data and generate a precise carbon audit response in strictly valid JSON format.

Data Input:
${JSON.stringify(onboardingData, null, 2)}

Requirements:
1. Calculate total carbon footprint in tCO2e/year accurately based on input quantities.
2. Identify top 3-4 emission sources with exact emissions (tCO2e) and percentage breakdown.
3. Provide 3 prioritized, practical circular economy interventions tailored specifically to their input materials, energy, and waste streams.
4. Write a concise executive AI summary paragraph ("aiSummaryParagraph") summarizing total impact, primary emission hotspot, key recommended strategy, and potential carbon reduction %.
5. Generate an array ("wasteReuseMatches") identifying how generated waste streams are reusable. Include strategyName (name of the circular strategy), strategyDescription (description of how it works), wasteUsedAsRawMaterial (which waste will be used as raw material), targetOrganizations (what type of organization needs it), and marketValueRange (the range of market value of that waste).
6. Express every cost, budget, market value, and financial estimate in Indian rupees (INR), using the ₹ symbol. Do not use USD, $, or any other currency.

Respond ONLY with JSON using this exact structure (no extra keys, no markdown codeblocks):
{
  "totalCarbonFootprint": 1240,
  "unit": "tCO2e/year",
  "topEmissionSources": [
    { "source": "Natural Gas", "emissions": 520, "unit": "tCO2e", "percentage": 42 },
    { "source": "Virgin Steel", "emissions": 380, "unit": "tCO2e", "percentage": 31 },
    { "source": "Process Waste", "emissions": 190, "unit": "tCO2e", "percentage": 15 }
  ],
  "aiSummaryParagraph": "Based on Scope 1-3 carbon accounting, your enterprise generates an estimated 1,240 tCO2e/year. The primary emission driver is Natural Gas, contributing 42% of emissions. Transitioning feedstock to certified recycled alternatives and implementing waste-heat recovery will cut emissions by 24% while yielding strong financial ROI within 2 years.",
  "recommendations": [
    {
      "id": 1,
      "title": "Replace 30% virgin steel with recycled steel",
      "category": "Material Circularity",
      "co2Reduction": "140 tCO2e/year",
      "estimatedCost": "₹8 lakh",
      "payback": "2.1 years",
      "priority": "HIGH",
      "description": "Shift procurement to certified recycled scrap feedstock."
    }
  ],
  "wasteReuseMatches": [
    {
      "id": 1,
      "strategyName": "Direct Foundry Sales",
      "strategyDescription": "Segregate and briquette production scrap to sell directly to electric arc foundries as raw material feedstock.",
      "wasteUsedAsRawMaterial": "Process Solid Scrap",
      "targetOrganizations": "Metallurgy Plants, Foundries, Rolling Mills",
      "marketValueRange": "₹25,000 - ₹30,000 / ton"
    }
  ]
}
`;

	const modelsToTry = ["gemini-3.5-flash"];

	for (const model of modelsToTry) {
		try {
			const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: promptText }],
						},
					],
					generationConfig: {
						responseMimeType: "application/json",
						temperature: 0.2,
					},
				}),
			});

			if (!response.ok) {
				console.warn(
					`Gemini API endpoint ${model} returned status ${response.status}. Trying next model...`,
				);
				continue;
			}

			const data = await response.json();
			const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

			if (!responseText) {
				continue;
			}

			const cleanJsonStr = responseText
				.replace(/```json\n?/g, "")
				.replace(/```\n?/g, "")
				.trim();
			const parsedData = JSON.parse(cleanJsonStr);
			return {
				...parsedData,
				calculationEngine: `Google Gemini AI (${model})`,
				analyzedAt: new Date().toISOString(),
			};
		} catch (err) {
			console.warn(`Error trying Gemini API model ${model}:`, err.message);
		}
	}

	console.log(
		"All Gemini API models failed or unreachable. Using fallback IPCC engine.",
	);
	return calculateFallbackAnalysis(onboardingData);
}

module.exports = {
	analyzeCarbonFootprint,
	calculateFallbackAnalysis,
};
