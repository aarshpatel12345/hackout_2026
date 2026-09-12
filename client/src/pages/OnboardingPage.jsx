import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Building2,
	Zap,
	Box,
	Trash2,
	Cpu,
	DollarSign,
	Target,
	Plus,
	Trash,
	ArrowRight,
	ArrowLeft,
	CheckCircle2,
	Sparkles,
	AlertCircle,
	Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";
import { useAuth } from "../context/AuthContext";
import { saveOnboardingApi, getOnboardingApi } from "../api/onboardingApi";
import { calculateAnalysisApi } from "../api/analysisApi";

const STEPS = [
	{ id: 1, title: "Business", icon: Building2, subtitle: "Company & Production baseline" },
	{ id: 2, title: "Energy & Materials", icon: Zap, subtitle: "Resource consumption details" },
	{ id: 3, title: "Waste Management", icon: Trash2, subtitle: "Waste types & disposal methods" },
	{ id: 4, title: "Processes", icon: Cpu, subtitle: "Core manufacturing workflow" },
	{ id: 5, title: "Costs & Constraints", icon: DollarSign, subtitle: "Financial & payback goals" },
];

export default function OnboardingPage() {
	const navigate = useNavigate();
	const auth = useAuth();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	// Comprehensive Form State
	const [formData, setFormData] = useState({
		// 🏭 Business
		business: {
			industry: "Manufacturing",
			productionQuantity: "",
			productionUnit: "units/yr",
			analysisPeriod: "Annual (2025-2026)",
		},
		// ⚡ Energy
		energy: [
			{ energyType: "Electricity (Grid)", quantity: "", unit: "kWh/yr" },
		],
		// 🧱 Materials
		materials: [
			{ materialName: "", quantity: "", unit: "kg/yr", materialType: "Virgin" },
		],
		// ♻️ Waste
		waste: [
			{ wasteType: "Non-Hazardous Solid Waste", quantity: "", unit: "kg/yr", disposalMethod: "Landfill" },
		],
		// ⚙️ Processes
		processes: [
			{ processName: "", energyAssociated: "", materialAssociated: "", wasteAssociated: "" },
		],
		// 💰 Costs
		costs: {
			energyCost: "",
			materialCost: "",
			wasteCost: "",
			currency: "USD ($)",
		},
		// 🎯 Constraints
		constraints: {
			availableBudget: "",
			preferredPaybackPeriod: "1-3 Years",
		},
	});

	// Load existing onboarding data if available
	useEffect(() => {
		let isMounted = true;
		const loadExisting = async () => {
			try {
				const response = await getOnboardingApi();
				if (isMounted && response?.data) {
					const data = response.data;
					setFormData((prev) => ({
						business: { ...prev.business, ...(data.business || {}) },
						energy: data.energy?.length ? data.energy : prev.energy,
						materials: data.materials?.length ? data.materials : prev.materials,
						waste: data.waste?.length ? data.waste : prev.waste,
						processes: data.processes?.length ? data.processes : prev.processes,
						costs: { ...prev.costs, ...(data.costs || {}) },
						constraints: { ...prev.constraints, ...(data.constraints || {}) },
					}));
				}
			} catch (err) {
				console.log("No existing onboarding state found, starting fresh.");
			}
		};
		if (auth?.isAuthenticated) {
			loadExisting();
		}
		return () => { isMounted = false; };
	}, [auth?.isAuthenticated]);

	// Input Handlers
	const handleBusinessChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			business: { ...prev.business, [field]: value },
		}));
	};

	const handleCostChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			costs: { ...prev.costs, [field]: value },
		}));
	};

	const handleConstraintChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			constraints: { ...prev.constraints, [field]: value },
		}));
	};

	// Array Field Item Handlers
	const handleArrayItemChange = (category, index, field, value) => {
		setFormData((prev) => {
			const updated = [...prev[category]];
			updated[index] = { ...updated[index], [field]: value };
			return { ...prev, [category]: updated };
		});
	};

	const addArrayItem = (category, defaultItem) => {
		setFormData((prev) => ({
			...prev,
			[category]: [...prev[category], defaultItem],
		}));
	};

	const removeArrayItem = (category, index) => {
		setFormData((prev) => {
			if (prev[category].length <= 1) return prev;
			return {
				...prev,
				[category]: prev[category].filter((_, i) => i !== index),
			};
		});
	};

	// Form Submission
	const handleSubmit = async () => {
		setIsSubmitting(true);
		setError(null);
		try {
			// Convert numeric values
			const sanitizedData = {
				business: {
					...formData.business,
					productionQuantity: Number(formData.business.productionQuantity) || 0,
				},
				energy: formData.energy.map((e) => ({
					...e,
					quantity: Number(e.quantity) || 0,
				})),
				materials: formData.materials.map((m) => ({
					...m,
					quantity: Number(m.quantity) || 0,
				})),
				waste: formData.waste.map((w) => ({
					...w,
					quantity: Number(w.quantity) || 0,
				})),
				processes: formData.processes,
				costs: {
					...formData.costs,
					energyCost: Number(formData.costs.energyCost) || 0,
					materialCost: Number(formData.costs.materialCost) || 0,
					wasteCost: Number(formData.costs.wasteCost) || 0,
				},
				constraints: {
					...formData.constraints,
					availableBudget: Number(formData.constraints.availableBudget) || 0,
				},
			};

			await saveOnboardingApi(sanitizedData);
			try {
				await calculateAnalysisApi(sanitizedData);
			} catch (calcErr) {
				console.warn("Analysis calculation completed with fallback.");
			}
			navigate("/dashboard");
		} catch (err) {
			const msg = err.response?.data?.message || err.message || "Failed to submit onboarding data.";
			setError(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	const nextStep = () => {
		setError(null);
		if (currentStep < STEPS.length) {
			setCurrentStep((prev) => prev + 1);
		} else {
			handleSubmit();
		}
	};

	const prevStep = () => {
		setError(null);
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	return (
		<div className="relative min-h-screen w-full bg-[#030908] text-[#EAF7F2] flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans select-none overflow-x-hidden">
			{/* Animated Canvas Background */}
			<ParticleBackground />

			{/* Top Header */}
			<header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between py-2">
				<div className="flex items-center space-x-3">
					<img
						src="/logo.png"
						alt="CarbonTrace Logo"
						className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(32,214,138,0.5)]"
						onError={(e) => { e.currentTarget.style.display = 'none'; }}
					/>
				</div>
				<div className="flex items-center space-x-2 bg-[#071916]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#16362E] text-xs font-mono text-[#86A399]">
					<Sparkles size={14} className="text-[#20D68A]" />
					<span>ENVIRONMENTAL ONBOARDING</span>
				</div>
			</header>

			{/* Central Onboarding Card */}
			<main className="relative z-10 max-w-4xl w-full mx-auto my-6">
				{/* Step Wizard Nav Header */}
				<div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
					<div className="flex items-center justify-between min-w-[650px] relative px-4">
						{/* Progress Connecting Line */}
						<div className="absolute left-8 right-8 top-5 h-[2px] bg-[#16362E] -z-0" />
						<div
							className="absolute left-8 top-5 h-[2px] bg-[#20D68A] transition-all duration-500 -z-0"
							style={{
								width: `${((currentStep - 1) / (STEPS.length - 1)) * 92}%`,
							}}
						/>

						{STEPS.map((step) => {
							const IconComponent = step.icon;
							const isCompleted = currentStep > step.id;
							const isActive = currentStep === step.id;

							return (
								<div
									key={step.id}
									onClick={() => currentStep > step.id && setCurrentStep(step.id)}
									className={`flex flex-col items-center space-y-2 cursor-pointer z-10 ${
										isActive || isCompleted ? "opacity-100" : "opacity-40 hover:opacity-70"
									} transition-opacity duration-200`}
								>
									<div
										className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
											isActive
												? "bg-[#20D68A] text-[#030908] shadow-[0_0_20px_rgba(32,214,138,0.6)] scale-110 font-bold"
												: isCompleted
												? "bg-[#16362E] text-[#20D68A] border border-[#20D68A]/50"
												: "bg-[#04120E] text-[#86A399] border border-[#16362E]"
										}`}
									>
										{isCompleted ? <Check size={18} className="stroke-[3]" /> : <IconComponent size={18} />}
									</div>
									<div className="text-center">
										<p
											className={`text-[11px] font-semibold tracking-wide ${
												isActive ? "text-[#20D68A]" : "text-[#EAF7F2]"
											}`}
										>
											{step.title}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Error Alert */}
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-4 p-3 rounded-2xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/40 text-[#FF7575] text-xs flex items-center space-x-2 shadow-sm"
					>
						<AlertCircle size={16} className="shrink-0" />
						<span>{error}</span>
					</motion.div>
				)}

				{/* Main Section Content Card */}
				<motion.div
					key={currentStep}
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -15 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
					className="rounded-3xl bg-[#071916]/85 backdrop-blur-2xl border border-[#16362E] p-6 sm:p-8 shadow-[0_0_50px_rgba(32,214,138,0.15)] relative overflow-hidden"
				>
					{/* Glowing Top Accent Accent */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-[2px] bg-gradient-to-r from-transparent via-[#20D68A] to-transparent blur-xs" />

					{/* Section Header */}
					<div className="mb-6 flex items-center justify-between border-b border-[#16362E] pb-4">
						<div>
							<span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#20D68A] uppercase">
								STEP 0{currentStep} OF 05
							</span>
							<h2 className="text-xl sm:text-2xl font-bold text-[#EAF7F2] tracking-tight">
								{STEPS[currentStep - 1].title}
							</h2>
							<p className="text-xs text-[#86A399] mt-0.5">
								{STEPS[currentStep - 1].subtitle}
							</p>
						</div>
					</div>

					{/* STEP 1: 🏭 BUSINESS */}
					{currentStep === 1 && (
						<div className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-[11px] font-bold uppercase tracking-wider text-[#86A399] mb-1.5">
										Industry / Sector *
									</label>
									<select
										value={formData.business.industry}
										onChange={(e) => handleBusinessChange("industry", e.target.value)}
										className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs focus:border-[#20D68A] outline-none transition-all"
									>
										<option value="Manufacturing">🏭 Manufacturing</option>
										<option value="Energy & Utilities">⚡ Energy & Utilities</option>
										<option value="Chemicals & Synthetics">🧪 Chemicals & Synthetics</option>
										<option value="Textiles & Apparel">🧵 Textiles & Apparel</option>
										<option value="Food & Agriculture">🌾 Food & Agriculture</option>
										<option value="Construction & Materials">🧱 Construction & Materials</option>
										<option value="Technology & Electronics">💻 Technology & Electronics</option>
										<option value="Logistics & Transport">🚛 Logistics & Transport</option>
										<option value="Other">🌐 Other Industry</option>
									</select>
								</div>

								<div>
									<label className="block text-[11px] font-bold uppercase tracking-wider text-[#86A399] mb-1.5">
										Analysis Period *
									</label>
									<select
										value={formData.business.analysisPeriod}
										onChange={(e) => handleBusinessChange("analysisPeriod", e.target.value)}
										className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs focus:border-[#20D68A] outline-none transition-all"
									>
										<option value="Annual (2025-2026)">Annual (2025-2026)</option>
										<option value="Quarterly (Q1-Q4)">Quarterly</option>
										<option value="Monthly Baseline">Monthly Baseline</option>
										<option value="Custom Project Scope">Custom Project Scope</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
								<div className="sm:col-span-2">
									<label className="block text-[11px] font-bold uppercase tracking-wider text-[#86A399] mb-1.5">
										Production Quantity *
									</label>
									<input
										type="number"
										placeholder="e.g. 50000"
										value={formData.business.productionQuantity}
										onChange={(e) => handleBusinessChange("productionQuantity", e.target.value)}
										className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] placeholder-[#86A399]/40 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#20D68A] outline-none transition-all"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-bold uppercase tracking-wider text-[#86A399] mb-1.5">
										Unit
									</label>
									<input
										type="text"
										placeholder="units/yr, tons, kg"
										value={formData.business.productionUnit}
										onChange={(e) => handleBusinessChange("productionUnit", e.target.value)}
										className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs focus:border-[#20D68A] outline-none transition-all"
									/>
								</div>
							</div>
						</div>
					)}

					{/* STEP 2: ⚡ ENERGY & 🧱 MATERIALS */}
					{currentStep === 2 && (
						<div className="space-y-6">
							{/* ENERGY CONSUMPTION */}
							<div>
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-sm font-bold text-[#20D68A] flex items-center space-x-2">
										<Zap size={16} />
										<span>⚡ Energy Consumption</span>
									</h3>
									<button
										type="button"
										onClick={() => addArrayItem("energy", { energyType: "Electricity (Grid)", quantity: "", unit: "kWh/yr" })}
										className="text-xs text-[#20D68A] hover:text-[#38D9E8] flex items-center space-x-1 font-semibold transition-colors"
									>
										<Plus size={14} />
										<span>Add Energy Type</span>
									</button>
								</div>

								<div className="space-y-3">
									{formData.energy.map((item, index) => (
										<div
											key={index}
											className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-[#04120E]/80 border border-[#16362E] p-3 rounded-xl"
										>
											<div className="sm:col-span-5">
												<input
													type="text"
													placeholder="Energy Type (e.g. Solar, Diesel, Natural Gas)"
													value={item.energyType}
													onChange={(e) => handleArrayItemChange("energy", index, "energyType", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>
											<div className="sm:col-span-4">
												<input
													type="number"
													placeholder="Quantity Consumed"
													value={item.quantity}
													onChange={(e) => handleArrayItemChange("energy", index, "quantity", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>
											<div className="sm:col-span-2">
												<input
													type="text"
													placeholder="Unit (kWh, Liters)"
													value={item.unit}
													onChange={(e) => handleArrayItemChange("energy", index, "unit", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>
											<div className="sm:col-span-1 flex justify-center">
												{formData.energy.length > 1 && (
													<button
														type="button"
														onClick={() => removeArrayItem("energy", index)}
														className="text-[#FF5C5C] hover:text-[#FF7575] transition-colors p-1"
													>
														<Trash size={15} />
													</button>
												)}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* MATERIALS */}
							<div className="pt-2">
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-sm font-bold text-[#20D68A] flex items-center space-x-2">
										<Box size={16} />
										<span>🧱 Raw & Industrial Materials</span>
									</h3>
									<button
										type="button"
										onClick={() => addArrayItem("materials", { materialName: "", quantity: "", unit: "kg/yr", materialType: "Virgin" })}
										className="text-xs text-[#20D68A] hover:text-[#38D9E8] flex items-center space-x-1 font-semibold transition-colors"
									>
										<Plus size={14} />
										<span>Add Material</span>
									</button>
								</div>

								<div className="space-y-3">
									{formData.materials.map((item, index) => (
										<div
											key={index}
											className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-[#04120E]/80 border border-[#16362E] p-3 rounded-xl"
										>
											<div className="sm:col-span-4">
												<input
													type="text"
													placeholder="Material Name (e.g. Steel, Polyethylene)"
													value={item.materialName}
													onChange={(e) => handleArrayItemChange("materials", index, "materialName", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>
											<div className="sm:col-span-3">
												<input
													type="number"
													placeholder="Quantity"
													value={item.quantity}
													onChange={(e) => handleArrayItemChange("materials", index, "quantity", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>
											<div className="sm:col-span-2">
												<input
													type="text"
													placeholder="Unit (kg, tons)"
													value={item.unit}
													onChange={(e) => handleArrayItemChange("materials", index, "unit", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>
											<div className="sm:col-span-2">
												<select
													value={item.materialType}
													onChange={(e) => handleArrayItemChange("materials", index, "materialType", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#20D68A]"
												>
													<option value="Virgin">Virgin</option>
													<option value="Recycled">Recycled</option>
												</select>
											</div>
											<div className="sm:col-span-1 flex justify-center">
												{formData.materials.length > 1 && (
													<button
														type="button"
														onClick={() => removeArrayItem("materials", index)}
														className="text-[#FF5C5C] hover:text-[#FF7575] transition-colors p-1"
													>
														<Trash size={15} />
													</button>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{/* STEP 3: ♻️ WASTE MANAGEMENT */}
					{currentStep === 3 && (
						<div className="space-y-4">
							<div className="flex items-center justify-between mb-2">
								<h3 className="text-sm font-bold text-[#20D68A] flex items-center space-x-2">
									<Trash2 size={16} />
									<span>♻️ Waste Generation & Disposal</span>
								</h3>
								<button
									type="button"
									onClick={() => addArrayItem("waste", { wasteType: "", quantity: "", unit: "kg/yr", disposalMethod: "Landfill" })}
									className="text-xs text-[#20D68A] hover:text-[#38D9E8] flex items-center space-x-1 font-semibold transition-colors"
								>
									<Plus size={14} />
									<span>Add Waste Category</span>
								</button>
							</div>

							<div className="space-y-3">
								{formData.waste.map((item, index) => (
									<div
										key={index}
										className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-[#04120E]/80 border border-[#16362E] p-3.5 rounded-xl"
									>
										<div className="sm:col-span-4">
											<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1">
												Waste Type
											</label>
											<input
												type="text"
												placeholder="e.g. E-waste, Scrap Metal, Plastics"
												value={item.wasteType}
												onChange={(e) => handleArrayItemChange("waste", index, "wasteType", e.target.value)}
												className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#20D68A]"
											/>
										</div>

										<div className="sm:col-span-3">
											<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1">
												Quantity
											</label>
											<input
												type="number"
												placeholder="Amount"
												value={item.quantity}
												onChange={(e) => handleArrayItemChange("waste", index, "quantity", e.target.value)}
												className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#20D68A]"
											/>
										</div>

										<div className="sm:col-span-4">
											<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1">
												Disposal Method
											</label>
											<select
												value={item.disposalMethod}
												onChange={(e) => handleArrayItemChange("waste", index, "disposalMethod", e.target.value)}
												className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#20D68A]"
											>
												<option value="Landfill">Landfill</option>
												<option value="Recycling">Recycling Center</option>
												<option value="Incineration">Incineration with Energy Recovery</option>
												<option value="Composting">Organic Composting</option>
												<option value="Reuse">Internal Reuse</option>
												<option value="Hazardous Processing">Hazardous Waste Processing</option>
											</select>
										</div>

										<div className="sm:col-span-1 flex justify-center pt-4 sm:pt-0">
											{formData.waste.length > 1 && (
												<button
													type="button"
													onClick={() => removeArrayItem("waste", index)}
													className="text-[#FF5C5C] hover:text-[#FF7575] transition-colors p-1"
												>
													<Trash size={16} />
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* STEP 4: ⚙️ PROCESSES */}
					{currentStep === 4 && (
						<div className="space-y-4">
							<div className="flex items-center justify-between mb-2">
								<h3 className="text-sm font-bold text-[#20D68A] flex items-center space-x-2">
									<Cpu size={16} />
									<span>⚙️ Operational & Production Processes</span>
								</h3>
								<button
									type="button"
									onClick={() => addArrayItem("processes", { processName: "", energyAssociated: "", materialAssociated: "", wasteAssociated: "" })}
									className="text-xs text-[#20D68A] hover:text-[#38D9E8] flex items-center space-x-1 font-semibold transition-colors"
								>
									<Plus size={14} />
									<span>Add Process</span>
								</button>
							</div>

							<div className="space-y-4">
								{formData.processes.map((item, index) => (
									<div
										key={index}
										className="bg-[#04120E]/80 border border-[#16362E] p-4 rounded-xl space-y-3 relative"
									>
										<div className="flex items-center justify-between border-b border-[#16362E]/60 pb-2">
											<span className="text-xs font-mono font-bold text-[#20D68A]">
												Process #{index + 1}
											</span>
											{formData.processes.length > 1 && (
												<button
													type="button"
													onClick={() => removeArrayItem("processes", index)}
													className="text-[#FF5C5C] hover:text-[#FF7575] text-xs flex items-center space-x-1 transition-colors"
												>
													<Trash size={14} />
													<span>Remove</span>
												</button>
											)}
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div>
												<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1">
													Process Name *
												</label>
												<input
													type="text"
													placeholder="e.g. Machining, Assembly Line, Boiler"
													value={item.processName}
													onChange={(e) => handleArrayItemChange("processes", index, "processName", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>

											<div>
												<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1">
													Energy Source Associated
												</label>
												<input
													type="text"
													placeholder="e.g. High Voltage Grid, Diesel Generator"
													value={item.energyAssociated}
													onChange={(e) => handleArrayItemChange("processes", index, "energyAssociated", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div>
												<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1">
													Material Input Associated
												</label>
												<input
													type="text"
													placeholder="e.g. Raw Aluminum Ingot"
													value={item.materialAssociated}
													onChange={(e) => handleArrayItemChange("processes", index, "materialAssociated", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>

											<div>
												<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1">
													Waste Output Associated
												</label>
												<input
													type="text"
													placeholder="e.g. Metal Slag & Coolant Fluid"
													value={item.wasteAssociated}
													onChange={(e) => handleArrayItemChange("processes", index, "wasteAssociated", e.target.value)}
													className="w-full bg-[#071916] border border-[#16362E] text-[#EAF7F2] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#20D68A]"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* STEP 5: 💰 COSTS & 🎯 CONSTRAINTS */}
					{currentStep === 5 && (
						<div className="space-y-6">
							{/* FINANCIAL COSTS */}
							<div>
								<h3 className="text-sm font-bold text-[#20D68A] flex items-center space-x-2 mb-3">
									<DollarSign size={16} />
									<span>💰 Annual Operating Costs</span>
								</h3>

								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div>
										<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1.5">
											Energy Cost ($/yr)
										</label>
										<input
											type="number"
											placeholder="e.g. 12000"
											value={formData.costs.energyCost}
											onChange={(e) => handleCostChange("energyCost", e.target.value)}
											className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#20D68A]"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1.5">
											Material Cost ($/yr)
										</label>
										<input
											type="number"
											placeholder="e.g. 45000"
											value={formData.costs.materialCost}
											onChange={(e) => handleCostChange("materialCost", e.target.value)}
											className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#20D68A]"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1.5">
											Waste Disposal Cost ($/yr)
										</label>
										<input
											type="number"
											placeholder="e.g. 8000"
											value={formData.costs.wasteCost}
											onChange={(e) => handleCostChange("wasteCost", e.target.value)}
											className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#20D68A]"
										/>
									</div>
								</div>
							</div>

							{/* CONSTRAINTS */}
							<div className="pt-2 border-t border-[#16362E]">
								<h3 className="text-sm font-bold text-[#20D68A] flex items-center space-x-2 my-3">
									<Target size={16} />
									<span>🎯 Sustainability Targets & Budget Constraints</span>
								</h3>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1.5">
											Available Budget for De-carbonization ($)
										</label>
										<input
											type="number"
											placeholder="e.g. 50000"
											value={formData.constraints.availableBudget}
											onChange={(e) => handleConstraintChange("availableBudget", e.target.value)}
											className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#20D68A]"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold uppercase text-[#86A399] mb-1.5">
											Preferred Payback Period
										</label>
										<select
											value={formData.constraints.preferredPaybackPeriod}
											onChange={(e) => handleConstraintChange("preferredPaybackPeriod", e.target.value)}
											className="w-full bg-[#04120E] border border-[#16362E] text-[#EAF7F2] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#20D68A]"
										>
											<option value="Under 1 Year">Under 1 Year (Immediate ROI)</option>
											<option value="1-3 Years">1 - 3 Years</option>
											<option value="3-5 Years">3 - 5 Years</option>
											<option value="5+ Years">5+ Years (Long-term Infrastructure)</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Navigation Footer */}
					<div className="mt-8 pt-4 border-t border-[#16362E] flex items-center justify-between">
						{currentStep > 1 ? (
							<button
								type="button"
								onClick={prevStep}
								className="px-4 py-2 rounded-xl border border-[#16362E] bg-[#04120E] hover:border-[#20D68A]/50 text-xs font-semibold text-[#86A399] hover:text-[#EAF7F2] flex items-center space-x-2 transition-all cursor-pointer"
							>
								<ArrowLeft size={15} />
								<span>Previous Step</span>
							</button>
						) : (
							<div />
						)}

						<button
							type="button"
							onClick={nextStep}
							disabled={isSubmitting}
							className="btn-direct-fill px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer"
						>
							<span>
								{isSubmitting
									? "Saving Baseline..."
									: currentStep === STEPS.length
									? "Complete Onboarding & Go to Dashboard"
									: "Continue to Next Step"}
							</span>
							{currentStep === STEPS.length ? (
								<CheckCircle2 size={16} className="stroke-[2.5]" />
							) : (
								<ArrowRight size={16} className="stroke-[2.5]" />
							)}
						</button>
					</div>
				</motion.div>
			</main>

			{/* Footer Slogan */}
			<footer className="relative z-10 text-center py-2 text-[10px] tracking-[0.25em] text-[#86A399]/40 font-mono uppercase">
				ACCELERATING DE-CARBONIZATION THROUGH TRANSPARENT TRACEABILITY
			</footer>
		</div>
	);
}
