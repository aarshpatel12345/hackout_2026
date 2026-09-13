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
	Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown";
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
			
			if (auth?.updateUser && auth?.user) {
				auth.updateUser({ ...auth.user, isOnboarded: true });
			}
			navigate("/dashboard");
		} catch (err) {
			const msg = err.response?.data?.message || err.message || "Failed to submit onboarding data.";
			setError(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

		const validateStep = () => {
		if (currentStep === 1) {
			if (!formData.business.industry || !formData.business.analysisPeriod || !formData.business.productionQuantity || !formData.business.productionUnit) return false;
		} else if (currentStep === 2) {
			for (let e of formData.energy) {
				if (!e.energyType || !e.quantity || !e.unit) return false;
			}
			for (let m of formData.materials) {
				if (!m.materialName || !m.quantity || !m.unit || !m.materialType) return false;
			}
		} else if (currentStep === 3) {
			for (let w of formData.waste) {
				if (!w.wasteType || !w.quantity || !w.unit || !w.disposalMethod) return false;
			}
		} else if (currentStep === 4) {
			for (let p of formData.processes) {
				if (!p.processName || !p.energyAssociated || !p.materialAssociated || !p.wasteAssociated) return false;
			}
		} else if (currentStep === 5) {
			if (!formData.costs.energyCost || !formData.costs.materialCost || !formData.costs.wasteCost || !formData.constraints.availableBudget || !formData.constraints.preferredPaybackPeriod) return false;
		}
		return true;
	};

	const nextStep = () => {
		setError(null);
		if (!validateStep()) {
			setError("Please fill all the compulsory fields before proceeding.");
			return;
		}
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
		<div className="relative min-h-screen w-full bg-gray-50 text-gray-900 flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans select-none overflow-x-hidden">
						
			{/* Top Header */}
			<header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between py-2">
				<div className="flex items-center space-x-3">
					<img
						src="/logo.jpg"
						alt="CarbonTrace Logo"
						className="h-10 sm:h-12 w-auto object-contain rounded-lg shadow-sm border border-gray-200"
						onError={(e) => { e.currentTarget.style.display = 'none'; }}
					/>
				</div>
				<div className="flex items-center space-x-2 bg-white  px-3.5 py-2.5 rounded-full border border-gray-200 text-xs font-mono text-gray-500">
					<Sparkles size={14} className="text-emerald-600" />
					<span>ENVIRONMENTAL ONBOARDING</span>
				</div>
			</header>

			{/* Central Onboarding Card */}
			<main className="relative z-10 max-w-4xl w-full mx-auto my-6">
				{/* Step Wizard Nav Header */}
				<div className="mb-6 overflow-x-auto pb-2 scrollbar-none pt-5">
					<div className="flex items-center justify-between min-w-[650px] relative px-4">
						{/* Progress Connecting Line */}
						<div className="absolute left-8 right-8 top-5 h-[2px] bg-gray-200 -z-0" />
						<div
							className="absolute left-8 top-5 h-[2px] bg-emerald-600 transition-all duration-500 -z-0"
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
												? "bg-emerald-600 text-white shadow-lg scale-110 font-bold"
												: isCompleted
												? "bg-gray-200 text-emerald-600 border border-emerald-200"
												: "bg-gray-50 text-gray-500 border border-gray-200"
										}`}
									>
										{isCompleted ? <Check size={18} className="stroke-[3]" /> : <IconComponent size={18} />}
									</div>
									<div className="text-center">
										<p
											className={`text-[11px] font-semibold tracking-wide ${
												isActive ? "text-emerald-600" : "text-gray-900"
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
						className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2 shadow-sm"
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
					className="rounded-3xl bg-white  border border-gray-200 p-6 sm:p-8 shadow-lg relative"
				>
					{/* Glowing Top Accent Accent */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-xs" />

					{/* Section Header */}
					<div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
						<div>
							<span className="text-[10px] font-mono font-bold tracking-[0.25em] text-emerald-600 uppercase">
								STEP 0{currentStep} OF 05
							</span>
							<h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
								{STEPS[currentStep - 1].title}
							</h2>
							<p className="text-xs text-gray-500 mt-0.5">
								{STEPS[currentStep - 1].subtitle}
							</p>
						</div>
					</div>

					{/* STEP 1: 🏭 BUSINESS */}
					{currentStep === 1 && (
						<div className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
										Industry / Sector *
									</label>
									<CustomDropdown
										value={formData.business.industry}
										onChange={(val) => handleBusinessChange("industry", val)}
										options={[
											{ value: "Manufacturing", label: "🏭 Manufacturing" },
											{ value: "Energy & Utilities", label: "⚡ Energy & Utilities" },
											{ value: "Chemicals & Synthetics", label: "🧪 Chemicals & Synthetics" },
											{ value: "Textiles & Apparel", label: "🧵 Textiles & Apparel" },
											{ value: "Food & Agriculture", label: "🌾 Food & Agriculture" },
											{ value: "Construction & Materials", label: "🧱 Construction & Materials" },
											{ value: "Technology & Electronics", label: "💻 Technology & Electronics" },
											{ value: "Logistics & Transport", label: "🚛 Logistics & Transport" },
											{ value: "Other", label: "🌐 Other Industry" }
										]}
									/>
								</div>

								<div>
									<label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
										Analysis Period *
									</label>
									<CustomDropdown
										value={formData.business.analysisPeriod}
										onChange={(val) => handleBusinessChange("analysisPeriod", val)}
										options={[
											{ value: "Annual (2025-2026)", label: "Annual (2025-2026)" },
											{ value: "Quarterly (Q1-Q4)", label: "Quarterly (Q1-Q4)" },
											{ value: "Monthly Baseline", label: "Monthly Baseline" },
											{ value: "Custom Project Scope", label: "Custom Project Scope" }
										]}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
								<div className="sm:col-span-2">
									<label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
										Production Quantity *
									</label>
									<input
										type="number"
										placeholder="e.g. 50000"
										value={formData.business.productionQuantity}
										onChange={(e) => handleBusinessChange("productionQuantity", e.target.value)}
										className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
										Unit
									</label>
									<CustomDropdown
            value={formData.business.productionUnit}
            onChange={(val) => handleBusinessChange("productionUnit", val)}
            options={[{value:"units/yr",label:"units/yr"},{value:"tons",label:"tons"},{value:"kg",label:"kg"}]}
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
									<h3 className="text-sm font-bold text-emerald-600 flex items-center space-x-2">
										<Zap size={16} />
										<span>⚡ Energy Consumption</span>
									</h3>
									<button
										type="button"
										onClick={() => addArrayItem("energy", { energyType: "Electricity (Grid)", quantity: "", unit: "kWh/yr" })}
										className="text-xs text-emerald-600 hover:text-emerald-500 flex items-center space-x-1 font-semibold transition-colors"
									>
										<Plus size={14} />
										<span>Add Energy Type</span>
									</button>
								</div>

								<div className="space-y-3">
									{formData.energy.map((item, index) => (
										<div
											key={index}
											className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-gray-50 border border-gray-200 p-3 rounded-xl"
										>
											<div className="sm:col-span-5">
												<CustomDropdown
            value={item.energyType}
            onChange={(val) => handleArrayItemChange("energy", index, "energyType", val)}
            options={[{value:"Electricity (Grid)",label:"Electricity (Grid)"},{value:"Solar",label:"Solar"},{value:"Diesel",label:"Diesel"},{value:"Natural Gas",label:"Natural Gas"},{value:"Wind",label:"Wind"}]}
        />
											</div>
											<div className="sm:col-span-4">
												<input
													type="number"
													placeholder="Quantity Consumed"
													value={item.quantity}
													onChange={(e) => handleArrayItemChange("energy", index, "quantity", e.target.value)}
													className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
												/>
											</div>
											<div className="sm:col-span-2">
												<CustomDropdown
            value={item.unit}
            onChange={(val) => handleArrayItemChange("energy", index, "unit", val)}
            options={[{value:"kWh/yr",label:"kWh/yr"},{value:"Liters",label:"Liters"},{value:"MMBtu",label:"MMBtu"},{value:"GJ",label:"GJ"},{value:"kg/yr",label:"kg/yr"},{value:"tons/yr",label:"tons/yr"},{value:"pieces/yr",label:"pieces/yr"}]}
        />
											</div>
											<div className="sm:col-span-1 flex justify-center">
												{formData.energy.length > 1 && (
													<button
														type="button"
														onClick={() => removeArrayItem("energy", index)}
														className="text-red-500 hover:text-red-600 transition-colors p-1"
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
									<h3 className="text-sm font-bold text-emerald-600 flex items-center space-x-2">
										<Box size={16} />
										<span>🧱 Raw & Industrial Materials</span>
									</h3>
									<button
										type="button"
										onClick={() => addArrayItem("materials", { materialName: "", quantity: "", unit: "kg/yr", materialType: "Virgin" })}
										className="text-xs text-emerald-600 hover:text-emerald-500 flex items-center space-x-1 font-semibold transition-colors"
									>
										<Plus size={14} />
										<span>Add Material</span>
									</button>
								</div>

								<div className="space-y-3">
									{formData.materials.map((item, index) => (
										<div
											key={index}
											className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-gray-50 border border-gray-200 p-3 rounded-xl"
										>
											<div className="sm:col-span-4">
												<CustomDropdown
            value={item.materialName}
            onChange={(val) => handleArrayItemChange("materials", index, "materialName", val)}
            options={[{value:"Steel",label:"Steel"},{value:"Polyethylene",label:"Polyethylene"},{value:"Aluminum",label:"Aluminum"},{value:"Copper",label:"Copper"},{value:"Wood",label:"Wood"},{value:"Cement",label:"Cement"},{value:"Other",label:"Other"}]}
        />
											</div>
											<div className="sm:col-span-3">
												<input
													type="number"
													placeholder="Quantity"
													value={item.quantity}
													onChange={(e) => handleArrayItemChange("materials", index, "quantity", e.target.value)}
													className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
												/>
											</div>
											<div className="sm:col-span-2">
												<CustomDropdown
            value={item.unit}
            onChange={(val) => handleArrayItemChange("materials", index, "unit", val)}
            options={[{value:"kWh/yr",label:"kWh/yr"},{value:"Liters",label:"Liters"},{value:"MMBtu",label:"MMBtu"},{value:"GJ",label:"GJ"},{value:"kg/yr",label:"kg/yr"},{value:"tons/yr",label:"tons/yr"},{value:"pieces/yr",label:"pieces/yr"}]}
        />
											</div>
											<div className="sm:col-span-2">
												<CustomDropdown
													value={item.materialType}
													onChange={(val) => handleArrayItemChange("materials", index, "materialType", val)}
													options={[
														{ value: "Virgin", label: "Virgin" },
														{ value: "Recycled", label: "Recycled" }
													]}
												/>
											</div>
											<div className="sm:col-span-1 flex justify-center">
												{formData.materials.length > 1 && (
													<button
														type="button"
														onClick={() => removeArrayItem("materials", index)}
														className="text-red-500 hover:text-red-600 transition-colors p-1"
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
								<h3 className="text-sm font-bold text-emerald-600 flex items-center space-x-2">
									<Trash2 size={16} />
									<span>♻️ Waste Generation & Disposal</span>
								</h3>
								<button
									type="button"
									onClick={() => addArrayItem("waste", { wasteType: "", quantity: "", unit: "kg/yr", disposalMethod: "Landfill" })}
									className="text-xs text-emerald-600 hover:text-emerald-500 flex items-center space-x-1 font-semibold transition-colors"
								>
									<Plus size={14} />
									<span>Add Waste Category</span>
								</button>
							</div>

							<div className="space-y-3">
								{formData.waste.map((item, index) => (
									<div
										key={index}
										className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-gray-50 border border-gray-200 p-3.5 rounded-xl"
									>
										<div className="sm:col-span-4">
											<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
												Waste Type
											</label>
											<CustomDropdown
            value={item.wasteType}
            onChange={(val) => handleArrayItemChange("waste", index, "wasteType", val)}
            options={[{value:"E-waste",label:"E-waste"},{value:"Scrap Metal",label:"Scrap Metal"},{value:"Plastics",label:"Plastics"},{value:"Organic",label:"Organic"},{value:"General Solid Waste",label:"General Solid Waste"},{value:"Hazardous",label:"Hazardous"}]}
        />
										</div>

										<div className="sm:col-span-3">
											<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
												Quantity
											</label>
											<input
												type="number"
												placeholder="Amount"
												value={item.quantity}
												onChange={(e) => handleArrayItemChange("waste", index, "quantity", e.target.value)}
												className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
											/>
										</div>

										<div className="sm:col-span-4">
											<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
												Disposal Method
											</label>
											<CustomDropdown
												value={item.disposalMethod}
												onChange={(val) => handleArrayItemChange("waste", index, "disposalMethod", val)}
												options={[
													{ value: "Landfill", label: "Landfill" },
													{ value: "Recycling", label: "Recycling Center" },
													{ value: "Incineration", label: "Incineration with Energy Recovery" },
													{ value: "Composting", label: "Organic Composting" },
													{ value: "Reuse", label: "Internal Reuse" },
													{ value: "Hazardous Processing", label: "Hazardous Waste Processing" }
												]}
											/>
										</div>

										<div className="sm:col-span-1 flex justify-center pt-4 sm:pt-0">
											{formData.waste.length > 1 && (
												<button
													type="button"
													onClick={() => removeArrayItem("waste", index)}
													className="text-red-500 hover:text-red-600 transition-colors p-1"
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
								<h3 className="text-sm font-bold text-emerald-600 flex items-center space-x-2">
									<Cpu size={16} />
									<span>⚙️ Operational & Production Processes</span>
								</h3>
								<button
									type="button"
									onClick={() => addArrayItem("processes", { processName: "", energyAssociated: "", materialAssociated: "", wasteAssociated: "" })}
									className="text-xs text-emerald-600 hover:text-emerald-500 flex items-center space-x-1 font-semibold transition-colors"
								>
									<Plus size={14} />
									<span>Add Process</span>
								</button>
							</div>

							<div className="space-y-4">
								{formData.processes.map((item, index) => (
									<div
										key={index}
										className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3 relative"
									>
										<div className="flex items-center justify-between border-b border-gray-200 pb-2">
											<span className="text-xs font-mono font-bold text-emerald-600">
												Process #{index + 1}
											</span>
											{formData.processes.length > 1 && (
												<button
													type="button"
													onClick={() => removeArrayItem("processes", index)}
													className="text-red-500 hover:text-red-600 text-xs flex items-center space-x-1 transition-colors"
												>
													<Trash size={14} />
													<span>Remove</span>
												</button>
											)}
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div>
												<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
													Process Name *
												</label>
												<CustomDropdown
            value={item.processName}
            onChange={(val) => handleArrayItemChange("processes", index, "processName", val)}
            options={[{value:"Machining",label:"Machining"},{value:"Assembly Line",label:"Assembly Line"},{value:"Boiler",label:"Boiler"},{value:"Heating",label:"Heating"},{value:"Cooling",label:"Cooling"},{value:"Chemical Treatment",label:"Chemical Treatment"},{value:"Packaging",label:"Packaging"},{value:"Other",label:"Other"}]}
        />
											</div>

											<div>
												<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
													Energy Source Associated
												</label>
												<CustomDropdown
            value={item.energyAssociated}
            onChange={(val) => handleArrayItemChange("processes", index, "energyAssociated", val)}
            options={[{value:"High Voltage Grid",label:"High Voltage Grid"},{value:"Diesel Generator",label:"Diesel Generator"},{value:"Solar Array",label:"Solar Array"},{value:"Natural Gas Burner",label:"Natural Gas Burner"},{value:"None",label:"None"}]}
        />
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div>
												<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
													Material Input Associated
												</label>
												<CustomDropdown
            value={item.materialAssociated}
            onChange={(val) => handleArrayItemChange("processes", index, "materialAssociated", val)}
            options={[{value:"Raw Aluminum Ingot",label:"Raw Aluminum Ingot"},{value:"Steel Sheets",label:"Steel Sheets"},{value:"Plastic Pellets",label:"Plastic Pellets"},{value:"Chemical Solvents",label:"Chemical Solvents"},{value:"None",label:"None"}]}
        />
											</div>

											<div>
												<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
													Waste Output Associated
												</label>
												<CustomDropdown
            value={item.wasteAssociated}
            onChange={(val) => handleArrayItemChange("processes", index, "wasteAssociated", val)}
            options={[{value:"Metal Slag & Coolant Fluid",label:"Metal Slag & Coolant Fluid"},{value:"Plastic Scraps",label:"Plastic Scraps"},{value:"Exhaust Gases",label:"Exhaust Gases"},{value:"Wastewater",label:"Wastewater"},{value:"None",label:"None"}]}
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
								<h3 className="text-sm font-bold text-emerald-600 flex items-center space-x-2 mb-3">
									<DollarSign size={16} />
									<span>💰 Annual Operating Costs</span>
								</h3>

								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div>
										<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">
											Energy Cost ($/yr)
										</label>
										<input
											type="number"
											placeholder="e.g. 12000"
											value={formData.costs.energyCost}
											onChange={(e) => handleCostChange("energyCost", e.target.value)}
											className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">
											Material Cost ($/yr)
										</label>
										<input
											type="number"
											placeholder="e.g. 45000"
											value={formData.costs.materialCost}
											onChange={(e) => handleCostChange("materialCost", e.target.value)}
											className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">
											Waste Disposal Cost ($/yr)
										</label>
										<input
											type="number"
											placeholder="e.g. 8000"
											value={formData.costs.wasteCost}
											onChange={(e) => handleCostChange("wasteCost", e.target.value)}
											className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
										/>
									</div>
								</div>
							</div>

							{/* CONSTRAINTS */}
							<div className="pt-2 border-t border-gray-200">
								<h3 className="text-sm font-bold text-emerald-600 flex items-center space-x-2 my-3">
									<Target size={16} />
									<span>🎯 Sustainability Targets & Budget Constraints</span>
								</h3>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">
											Available Budget for De-carbonization ($)
										</label>
										<input
											type="number"
											placeholder="e.g. 50000"
											value={formData.constraints.availableBudget}
											onChange={(e) => handleConstraintChange("availableBudget", e.target.value)}
											className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">
											Preferred Payback Period
										</label>
										<CustomDropdown
											value={formData.constraints.preferredPaybackPeriod}
											onChange={(val) => handleConstraintChange("preferredPaybackPeriod", val)}
											options={[
												{ value: "Under 1 Year", label: "Under 1 Year (Immediate ROI)" },
												{ value: "1-3 Years", label: "1 - 3 Years" },
												{ value: "3-5 Years", label: "3 - 5 Years" },
												{ value: "5+ Years", label: "5+ Years (Long-term Infrastructure)" }
											]}
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Navigation Footer */}
					<div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between">
						{currentStep > 1 ? (
							<button
								type="button"
								onClick={prevStep}
								className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-200 text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center space-x-2 transition-all cursor-pointer"
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
							className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer"
						>
							<span>
								{isSubmitting
									? "Saving Baseline..."
									: currentStep === STEPS.length
									? "Complete Onboarding & Go to Dashboard"
									: "Continue to Next Step"}
							</span>
							{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : currentStep === STEPS.length ? (
								<CheckCircle2 size={16} className="stroke-[2.5]" />
							) : (
								<ArrowRight size={16} className="stroke-[2.5]" />
							)}
						</button>
					</div>
				</motion.div>
			</main>

			{/* Footer Slogan */}
			<footer className="relative z-10 text-center py-2 text-[10px] tracking-[0.25em] text-gray-500 font-mono uppercase">
				ACCELERATING DE-CARBONIZATION THROUGH TRANSPARENT TRACEABILITY
			</footer>
		</div>
	);
}
