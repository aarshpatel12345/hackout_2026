import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	LayoutDashboard,
	Sparkles,
	Calculator,
	Recycle,
	SlidersHorizontal,
	RefreshCw,
	LogOut,
	ShieldCheck,
	Flame,
	Activity,
	Leaf,
	DollarSign,
	Clock,
	TrendingUp,
	Boxes,
	FileText,
	CheckCircle2,
	ArrowUpRight,
	Building2,
	HelpCircle,
	ChevronRight,
	User,
	Zap,
	Box,
	Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import ParticleBackground from "../components/ParticleBackground";
import { useAuth } from "../context/AuthContext";
import { calculateAnalysisApi, getAnalysisApi } from "../api/analysisApi";

export default function Dashboard() {
	const navigate = useNavigate();
	const auth = useAuth();
	const logout = auth?.logout;
	const user = auth?.user;

	const [analysis, setAnalysis] = useState(null);
	const [loading, setLoading] = useState(true);
	const [analyzing, setAnalyzing] = useState(false);
	const [activeTab, setActiveTab] = useState("overview"); // "overview" | "suggestions" | "roi" | "waste"
	const [activeFilter, setActiveFilter] = useState("ALL");

	// Interactive ROI Calculator State
	const [roiInvestment, setRoiInvestment] = useState(500000);
	const [roiEfficiency, setRoiEfficiency] = useState(24);
	const [roiAnnualCost, setRoiAnnualCost] = useState(1200000);

	// Fetch carbon footprint analysis on load
	useEffect(() => {
		let isMounted = true;
		const loadDashboardData = async () => {
			setLoading(true);
			try {
				const response = await getAnalysisApi();
				if (isMounted && response?.data) {
					setAnalysis(response.data);
				}
			} catch (err) {
				console.error("Dashboard analysis load error:", err);
			} finally {
				if (isMounted) setLoading(false);
			}
		};
		loadDashboardData();
		return () => { isMounted = false; };
	}, []);

	// Re-run AI analysis engine
	const handleReAnalyze = async () => {
		setAnalyzing(true);
		try {
			const response = await calculateAnalysisApi();
			if (response?.data) {
				setAnalysis(response.data);
			}
		} catch (err) {
			console.error("Re-analysis error:", err);
		} finally {
			setAnalyzing(false);
		}
	};

	const handleLogout = () => {
		if (logout) logout();
		navigate("/login");
	};

	// Fallback mock data matching exact requested layout & structure
	const data = analysis || {
		totalCarbonFootprint: 1240,
		unit: "tCO2e/year",
		topEmissionSources: [
			{ source: "Natural Gas", emissions: 520, unit: "tCO2e", percentage: 42 },
			{ source: "Virgin Steel Feedstock", emissions: 380, unit: "tCO2e", percentage: 31 },
			{ source: "Process Waste Slag", emissions: 190, unit: "tCO2e", percentage: 15 },
			{ source: "Grid Electricity", emissions: 150, unit: "tCO2e", percentage: 12 },
		],
		aiSummaryParagraph:
			"Based on comprehensive Scope 1-3 carbon accounting, your enterprise currently generates an estimated 1,240 tCO2e/year in total greenhouse emissions. The primary emission driver is Natural Gas, accounting for 42% of total emissions. By implementing prioritized circular economy strategies—such as transitioning high-volume feedstock to certified recycled materials, deploying waste-heat recovery on primary thermal infrastructure, and setting up automated scrap reprocessing—your plant can achieve up to 24% net carbon reduction while generating substantial annual operational savings with payback periods under 2 years.",
		recommendations: [
			{
				id: 1,
				title: "Replace 30% virgin steel with recycled scrap steel",
				category: "Material Circularity",
				co2Reduction: "140 tCO2e/year",
				estimatedCost: "₹8 lakh",
				payback: "1.8 years",
				priority: "HIGH",
				description:
					"Shift procurement to certified recycled scrap feedstock to eliminate high Scope 3 virgin extraction footprint.",
			},
			{
				id: 2,
				title: "Install waste-heat recovery on thermal furnace plant",
				category: "Energy Efficiency",
				co2Reduction: "95 tCO2e/year",
				estimatedCost: "₹5 lakh",
				payback: "1.5 years",
				priority: "HIGH",
				description:
					"Capture flue gas and process waste thermal energy to pre-heat boiler feed water, cutting raw fuel consumption.",
			},
			{
				id: 3,
				title: "Reuse production scrap & closed-loop briquetting",
				category: "Waste Reduction",
				co2Reduction: "60 tCO2e/year",
				estimatedCost: "₹2.5 lakh",
				payback: "1.2 years",
				priority: "MEDIUM",
				description:
					"Implement automated scrap sorting and briquetting to re-feed manufacturing processes directly.",
			},
		],
		wasteReuseMatches: [
			{
				id: 1,
				wasteType: "Metal & Industrial Steel Scrap",
				reusabilityPotential: "High (High Demand Raw Material)",
				rawMaterialSubstitute: "Secondary Ingot & Re-melting Feedstock",
				targetIndustries: "Electric Arc Foundries, Steel Rolling Mills, Metallurgy Plants",
				estimatedByproductValue: "₹25,000 - ₹35,000 / ton",
				diversionStrategy:
					"Segregate scrap types into high-purity briquettes and supply directly to metallurgy foundries as secondary raw material feedstock.",
			},
			{
				id: 2,
				wasteType: "Process Slag & Boiler Fly Ash",
				reusabilityPotential: "High (Building Material Feedstock)",
				rawMaterialSubstitute: "Calcined Clay & Pozzolanic Cement Aggregates",
				targetIndustries: "Cement Manufacturers, Paver Block Units, Infrastructure Contractors",
				estimatedByproductValue: "₹1,800 - ₹3,500 / ton",
				diversionStrategy:
					"Divert solid industrial residues to eco-cement manufacturing plants to serve as a pozzolanic binder replacement.",
			},
			{
				id: 3,
				wasteType: "Polymer & Plastic Offcuts",
				reusabilityPotential: "Medium to High (Recycled Polymer)",
				rawMaterialSubstitute: "Refined Plastic Pellets & Packaging Filler",
				targetIndustries: "Recycled Plastics Industry, Automotive Trim Producers, Packaging Manufacturers",
				estimatedByproductValue: "₹10,000 - ₹18,000 / ton",
				diversionStrategy:
					"Pelletize waste polymers for sales to secondary plastic compounders, achieving 90%+ diversion rate.",
			},
		],
		calculationEngine: "Google Gemini AI Engine",
	};

	// ROI Calculations based on interactive sliders
	const annualSavingsMoney = Math.round((roiAnnualCost * roiEfficiency) / 100);
	const annualCO2Saved = Math.round(((data.totalCarbonFootprint || 1240) * roiEfficiency) / 100);
	const paybackYears = Number((roiInvestment / (annualSavingsMoney || 1)).toFixed(1));
	const roiPercent = Math.round(((annualSavingsMoney * 5 - roiInvestment) / roiInvestment) * 100);

	const roiChartData = [
		{ year: 'Y0', balance: -roiInvestment },
		{ year: 'Y1', balance: -roiInvestment + annualSavingsMoney },
		{ year: 'Y2', balance: -roiInvestment + annualSavingsMoney * 2 },
		{ year: 'Y3', balance: -roiInvestment + annualSavingsMoney * 3 },
		{ year: 'Y4', balance: -roiInvestment + annualSavingsMoney * 4 },
		{ year: 'Y5', balance: -roiInvestment + annualSavingsMoney * 5 },
	];

	// Filter recommendations
	const filteredRecommendations = (data.recommendations || []).filter((rec) => {
		if (activeFilter === "ALL") return true;
		if (activeFilter === "HIGH") return rec.priority === "HIGH";
		if (activeFilter === "MATERIAL") return rec.category?.toLowerCase().includes("material");
		if (activeFilter === "ENERGY") return rec.category?.toLowerCase().includes("energy");
		return true;
	});

	// Get user initial badge
	const userInitial = user?.name ? user.name.trim()[0].toUpperCase() : "S";

	return (
		<div className="relative min-h-screen w-full bg-[#030908] text-[#EAF7F2] flex font-sans select-none overflow-x-hidden">
			{/* Animated Canvas Background */}
			<ParticleBackground />

			{/* ========================================== */}
			{/* LEFT FIXED NAVIGATION SIDEBAR (DESKTOP)   */}
			{/* ========================================== */}
			<aside className="hidden lg:flex flex-col w-60 xl:w-64 fixed left-0 top-0 bottom-0 z-30 bg-[#051411]/90 backdrop-blur-2xl border-r border-[#16362E] p-3 justify-between">
				<div className="space-y-4">
					{/* Brand Logo Header */}
					<div className="flex items-center space-x-2 px-1 py-1">
						<img
							src="/logo.png"
							alt="CarbonTrace Logo"
							className="h-10 xl:h-11 w-auto object-contain drop-shadow-[0_0_18px_rgba(32,214,138,0.55)]"
							onError={(e) => { e.currentTarget.style.display = "none"; }}
						/>
					</div>

					{/* Navigation Links List */}
					<nav className="space-y-1 pt-1">
						<p className="px-2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#86A399]/60 mb-1.5">
							NAVIGATION MENU
						</p>

						<button
							onClick={() => setActiveTab("overview")}
							className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
								activeTab === "overview"
									? "bg-[#20D68A]/15 border border-[#20D68A]/50 text-[#20D68A] shadow-[0_0_15px_rgba(32,214,138,0.15)]"
									: "text-[#86A399] hover:text-[#EAF7F2] hover:bg-[#071916]/80"
							}`}
						>
							<LayoutDashboard size={15} className={`shrink-0 ${activeTab === "overview" ? "text-[#20D68A]" : ""}`} />
							<span className="whitespace-nowrap">Dashboard Overview</span>
						</button>

						<button
							onClick={() => setActiveTab("suggestions")}
							className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
								activeTab === "suggestions"
									? "bg-[#20D68A]/15 border border-[#20D68A]/50 text-[#20D68A] shadow-[0_0_15px_rgba(32,214,138,0.15)]"
									: "text-[#86A399] hover:text-[#EAF7F2] hover:bg-[#071916]/80"
							}`}
						>
							<Sparkles size={15} className={`shrink-0 ${activeTab === "suggestions" ? "text-[#20D68A]" : ""}`} />
							<span className="whitespace-nowrap">AI Strategic Suggestions</span>
						</button>

						<button
							onClick={() => setActiveTab("roi")}
							className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
								activeTab === "roi"
									? "bg-[#20D68A]/15 border border-[#20D68A]/50 text-[#20D68A] shadow-[0_0_15px_rgba(32,214,138,0.15)]"
									: "text-[#86A399] hover:text-[#EAF7F2] hover:bg-[#071916]/80"
							}`}
						>
							<Calculator size={15} className={`shrink-0 ${activeTab === "roi" ? "text-[#20D68A]" : ""}`} />
							<span className="whitespace-nowrap">ROI & Cost Calculator</span>
						</button>

						<button
							onClick={() => setActiveTab("waste")}
							className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
								activeTab === "waste"
									? "bg-[#20D68A]/15 border border-[#20D68A]/50 text-[#20D68A] shadow-[0_0_15px_rgba(32,214,138,0.15)]"
									: "text-[#86A399] hover:text-[#EAF7F2] hover:bg-[#071916]/80"
							}`}
						>
							<Recycle size={15} className={`shrink-0 ${activeTab === "waste" ? "text-[#20D68A]" : ""}`} />
							<span className="whitespace-nowrap">Waste Feedstock Exchange</span>
						</button>
					</nav>
				</div>

				{/* Sidebar Footer - Baseline Action & USER AVATAR */}
				<div className="space-y-1.5 pt-2 border-t border-[#16362E]">
					<button
						onClick={() => navigate("/onboarding")}
						className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-[#16362E] bg-[#04120E] text-[10.5px] font-semibold text-[#86A399] hover:text-[#20D68A] hover:border-[#20D68A]/50 transition-all cursor-pointer shadow-sm"
					>
						<div className="flex items-center space-x-2">
							<SlidersHorizontal size={13} />
							<span>Update Baseline</span>
						</div>
						<ChevronRight size={12} />
					</button>

					{/* BOTTOM LEFT USER AVATAR BADGE */}
					<div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-[#04120E] border border-[#16362E]">
						<div className="flex items-center space-x-2 min-w-0">
							{/* First Letter Avatar Circle */}
							<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#20D68A] to-[#0FAF70] text-[#030908] font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(32,214,138,0.3)]">
								{userInitial}
							</div>
							<div className="min-w-0 flex flex-col justify-center leading-tight">
								<p className="text-[10.5px] font-bold text-[#EAF7F2] truncate leading-tight m-0 p-0">
									{user?.name || "SME Enterprise"}
								</p>
								<p className="text-[9px] text-[#86A399] font-mono truncate leading-tight m-0 p-0">
									{user?.email || "enterprise@carbontrace.io"}
								</p>
							</div>
						</div>

						<button
							onClick={handleLogout}
							className="p-1 rounded-md text-[#86A399] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors cursor-pointer shrink-0"
							title="Sign Out"
						>
							<LogOut size={14} />
						</button>
					</div>
				</div>
			</aside>

			{/* ========================================== */}
			{/* MAIN CONTENT PANEL AREA                    */}
			{/* ========================================== */}
			<div className="lg:pl-60 xl:pl-64 flex-1 flex flex-col min-w-0 min-h-screen">
				{/* Top Header Navigation Bar */}
				<header className="relative z-20 border-b border-[#16362E] bg-[#071916]/80 backdrop-blur-2xl sticky top-0 px-4 sm:px-6 py-2.5">
					<div className="max-w-7xl mx-auto flex items-center justify-between">
						{/* Title Indicator */}
						<div className="flex items-center space-x-2.5">
							<div className="w-2 h-2 rounded-full bg-[#20D68A] animate-pulse" />
							<h1 className="text-xs sm:text-sm font-bold text-[#EAF7F2] tracking-wide uppercase font-mono">
								{activeTab === "overview" && "DASHBOARD OVERVIEW"}
								{activeTab === "suggestions" && "AI STRATEGIC SUGGESTIONS"}
								{activeTab === "roi" && "ROI & COST PAYBACK CALCULATOR"}
								{activeTab === "waste" && "CIRCULAR WASTE REUSABILITY EXCHANGE"}
							</h1>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center space-x-2.5">
							<button
								onClick={handleReAnalyze}
								disabled={analyzing}
								className="btn-direct-fill px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center space-x-1.5 cursor-pointer shadow-md"
							>
								<RefreshCw size={13} className={analyzing ? "animate-spin" : ""} />
								<span>{analyzing ? "Analyzing..." : "Re-run AI Analysis"}</span>
							</button>

							<button
								onClick={handleLogout}
								className="lg:hidden p-1.5 rounded-lg border border-[#16362E] text-[#86A399] hover:text-[#FF5C5C] transition-colors"
								title="Sign Out"
							>
								<LogOut size={15} />
							</button>
						</div>
					</div>

					{/* Mobile Navigation Pills Bar */}
					<div className="flex lg:hidden overflow-x-auto space-x-1.5 pt-2 pb-1 border-t border-[#16362E]/60 mt-2 scrollbar-none">
						<button
							onClick={() => setActiveTab("overview")}
							className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
								activeTab === "overview" ? "bg-[#20D68A] text-[#030908]" : "text-[#86A399] bg-[#04120E]"
							}`}
						>
							Overview
						</button>
						<button
							onClick={() => setActiveTab("suggestions")}
							className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
								activeTab === "suggestions" ? "bg-[#20D68A] text-[#030908]" : "text-[#86A399] bg-[#04120E]"
							}`}
						>
							AI Suggestions
						</button>
						<button
							onClick={() => setActiveTab("roi")}
							className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
								activeTab === "roi" ? "bg-[#20D68A] text-[#030908]" : "text-[#86A399] bg-[#04120E]"
							}`}
						>
							ROI Calculator
						</button>
						<button
							onClick={() => setActiveTab("waste")}
							className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
								activeTab === "waste" ? "bg-[#20D68A] text-[#030908]" : "text-[#86A399] bg-[#04120E]"
							}`}
						>
							Waste Exchange
						</button>
					</div>
				</header>

				{/* Main Tab Content Body */}
				<main className="relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-5 lg:p-6 space-y-6 flex-1">
					{/* Welcome Header Banner */}
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-[#071916]/80 backdrop-blur-xl border border-[#16362E] p-4 sm:p-5 rounded-2xl shadow-[0_0_40px_rgba(32,214,138,0.1)]">
						<div>
							<div className="flex items-center space-x-1.5 text-[11px] text-[#20D68A] font-mono mb-1">
								<ShieldCheck size={14} />
								<span>DE-CARBONIZATION OS & AUDIT INTELLIGENCE</span>
							</div>
							<h1 className="text-xl sm:text-2xl font-extrabold text-[#EAF7F2] tracking-tight">
								Welcome back, <span className="text-[#20D68A]">{user?.name || "SME Enterprise"}</span>
							</h1>
							<p className="text-xs text-[#86A399] mt-0.5 leading-relaxed">
								Real-time carbon accounting, AI audit narrative, financial ROI calculations, and circular waste feedstock matching.
							</p>
						</div>

						<div className="flex items-center space-x-2.5 bg-[#04120E] border border-[#16362E] px-3.5 py-2 rounded-xl self-start md:self-auto shadow-inner">
							<Sparkles size={16} className="text-[#20D68A] shrink-0" />
							<div>
								<p className="text-[9.5px] uppercase font-mono tracking-wider text-[#86A399]">
									AI Calculation Engine
								</p>
								<p className="text-[11px] font-semibold text-[#EAF7F2]">
									{data.calculationEngine || "Google Gemini AI"}
								</p>
							</div>
						</div>
					</div>

					{/* TAB 1: OVERVIEW DASHBOARD */}
					{activeTab === "overview" && (
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.35 }}
							className="space-y-5"
						>
							{/* Top Metrics Row: Total Carbon Footprint Hero & Summary Cards */}
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
								{/* HERO CARD: Total Carbon Footprint */}
								<div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#071916] via-[#04120E] to-[#030908] border border-[#20D68A]/40 p-5 sm:p-6 shadow-[0_0_40px_rgba(32,214,138,0.18)] relative overflow-hidden flex flex-col justify-between">
									<div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#20D68A]/10 blur-3xl rounded-full pointer-events-none" />

									<div>
										<div className="flex items-center justify-between mb-3">
											<span className="text-[10.5px] font-mono font-bold tracking-[0.18em] text-[#20D68A] uppercase flex items-center space-x-1.5">
												<Flame size={14} />
												<span>TOTAL CARBON FOOTPRINT</span>
											</span>
											<span className="px-2.5 py-0.5 rounded-full bg-[#20D68A]/15 border border-[#20D68A]/40 text-[#20D68A] text-[9.5px] font-mono font-bold">
												ANNUAL SCOPE 1-3
											</span>
										</div>

										<div className="my-3">
											<div className="flex items-baseline space-x-2.5">
												<h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#EAF7F2] tracking-tight">
													{typeof data.totalCarbonFootprint === "number"
														? data.totalCarbonFootprint.toLocaleString()
														: data.totalCarbonFootprint}
												</h2>
												<span className="text-xs sm:text-sm text-[#20D68A] font-mono font-bold">
													tCO₂e/year
												</span>
											</div>
											<p className="text-[11px] text-[#86A399] mt-1.5 leading-relaxed">
												Estimated annual greenhouse gas footprint calculated from SME process inputs across Energy, Materials, and Waste streams.
											</p>
										</div>
									</div>

									{/* Quick Stat Pill Bar */}
									<div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#16362E]">
										<div className="bg-[#04120E]/90 p-2.5 rounded-xl border border-[#16362E]">
											<p className="text-[9.5px] text-[#86A399] uppercase font-mono">Potential Savings</p>
											<p className="text-xs font-bold text-[#20D68A]">~{Math.round((data.totalCarbonFootprint || 1240) * 0.24)} tCO₂e/yr</p>
										</div>
										<div className="bg-[#04120E]/90 p-2.5 rounded-xl border border-[#16362E]">
											<p className="text-[9.5px] text-[#86A399] uppercase font-mono">Net De-carbonization</p>
											<p className="text-xs font-bold text-[#38D9E8]">-24.0% Total</p>
										</div>
									</div>
								</div>

								{/* TOP EMISSION SOURCES CARD */}
								<div className="lg:col-span-7 rounded-2xl bg-[#071916]/85 backdrop-blur-2xl border border-[#16362E] p-5 sm:p-6 shadow-[0_0_35px_rgba(32,214,138,0.1)] flex flex-col justify-between">
									<div>
										<div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#16362E]">
											<div className="flex items-center space-x-2">
												<Activity size={16} className="text-[#20D68A]" />
												<h3 className="text-base font-bold text-[#EAF7F2]">Top Emission Sources</h3>
											</div>
											<span className="text-[11px] text-[#86A399] font-mono">
												Ranked by CO₂e Impact
											</span>
										</div>

										{/* Emission Source List */}
										<div className="space-y-3">
											{(data.topEmissionSources || []).map((item, index) => (
												<div key={index} className="space-y-1">
													<div className="flex items-center justify-between text-xs">
														<div className="flex items-center space-x-2 font-medium">
															<span className="w-4.5 h-4.5 rounded-full bg-[#16362E] text-[#20D68A] text-[10px] font-bold font-mono flex items-center justify-center shrink-0">
																{index + 1}
															</span>
															<span className="text-[#EAF7F2] font-semibold">{item.source}</span>
														</div>
														<div className="flex items-center space-x-1.5 font-mono text-xs">
															<span className="text-[#20D68A] font-bold">
																{item.emissions} {item.unit || "tCO2e"}
															</span>
															<span className="text-[#86A399] text-[11px]">
																({item.percentage}%)
															</span>
														</div>
													</div>

													<div className="w-full h-2 rounded-full bg-[#04120E] overflow-hidden border border-[#16362E]">
														<motion.div
															initial={{ width: 0 }}
															animate={{ width: `${item.percentage}%` }}
															transition={{ duration: 0.8, delay: index * 0.15 }}
															className={`h-full rounded-full ${
																index === 0
																	? "bg-gradient-to-r from-[#20D68A] to-[#38D9E8]"
																	: index === 1
																	? "bg-[#20D68A]"
																	: "bg-[#86A399]"
															}`}
														/>
													</div>
												</div>
											))}
										</div>
									</div>

									<div className="mt-4 pt-2.5 border-t border-[#16362E]/60 flex items-center justify-between text-[11px] text-[#86A399]">
										<span>Identified major hotspots requiring circular material & energy intervention.</span>
									</div>
								</div>
							</div>

							{/* Prioritized Circular Interventions */}
							<div className="space-y-5">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#16362E] pb-3">
									<div>
										<span className="text-[10.5px] font-mono font-bold text-[#20D68A] uppercase tracking-widest">
											CIRCULAR INTERVENTION ANALYSIS
										</span>
										<h2 className="text-lg sm:text-xl font-bold text-[#EAF7F2] tracking-tight">
											Recommended Interventions & Action Plan
										</h2>
									</div>

									{/* Filter Pills */}
									<div className="flex items-center space-x-1.5 bg-[#04120E] border border-[#16362E] p-1 rounded-xl text-[11px] font-semibold">
										{["ALL", "HIGH", "MATERIAL", "ENERGY"].map((filter) => (
											<button
												key={filter}
												onClick={() => setActiveFilter(filter)}
												className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
													activeFilter === filter
														? "bg-[#20D68A] text-[#030908] font-bold shadow-md"
														: "text-[#86A399] hover:text-[#EAF7F2]"
												}`}
											>
												{filter === "ALL" ? "All Interventions" : filter === "HIGH" ? "High Priority" : filter}
											</button>
										))}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{filteredRecommendations.map((item, index) => (
										<div
											key={item.id || index}
											className="rounded-2xl bg-[#071916]/85 backdrop-blur-2xl border border-[#16362E] p-4 sm:p-5 shadow-[0_0_25px_rgba(32,214,138,0.06)] hover:border-[#20D68A]/50 transition-all flex flex-col justify-between relative group space-y-3"
										>
											<div>
												<div className="flex items-center justify-between mb-2">
													<span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#86A399] bg-[#04120E] px-2.5 py-0.5 rounded-lg border border-[#16362E]">
														{item.category || "Circular Strategy"}
													</span>
													<span
														className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold font-mono tracking-wider border ${
															item.priority === "HIGH"
																? "bg-[#20D68A]/15 border-[#20D68A]/50 text-[#20D68A]"
																: "bg-[#38D9E8]/15 border-[#38D9E8]/50 text-[#38D9E8]"
														}`}
													>
														{item.priority} PRIORITY
													</span>
												</div>

												<h3 className="text-xs sm:text-sm font-bold text-[#EAF7F2] group-hover:text-[#20D68A] transition-colors leading-snug mb-1.5">
													{item.id || index + 1}. {item.title}
												</h3>
												<p className="text-[11px] text-[#86A399] leading-relaxed">
													{item.description}
												</p>
											</div>

											<div className="space-y-2 pt-2.5 border-t border-[#16362E]/80 font-mono bg-[#04120E]/50 p-2.5 rounded-xl border border-[#16362E]/40 text-[11px]">
												<div className="flex items-center justify-between">
													<span className="text-[#86A399] flex items-center space-x-1.5">
														<Leaf size={13} className="text-[#20D68A]" />
														<span>Est. CO₂ Reduction:</span>
													</span>
													<span className="text-[#20D68A] font-bold">{item.co2Reduction}</span>
												</div>

												<div className="flex items-center justify-between">
													<span className="text-[#86A399] flex items-center space-x-1.5">
														<DollarSign size={13} className="text-[#38D9E8]" />
														<span>Est. Cost:</span>
													</span>
													<span className="text-[#EAF7F2] font-semibold">{item.estimatedCost}</span>
												</div>

												<div className="flex items-center justify-between">
													<span className="text-[#86A399] flex items-center space-x-1.5">
														<Clock size={13} className="text-[#86A399]" />
														<span>Payback Period:</span>
													</span>
													<span className="text-[#EAF7F2] font-semibold">{item.payback}</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</motion.div>
					)}

					{/* TAB 2: AI STRATEGIC SUGGESTIONS PARAGRAPH & AUDIT REPORT */}
					{activeTab === "suggestions" && (
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.35 }}
							className="space-y-5"
						>
							{/* AI EXECUTIVE NARRATIVE PARAGRAPH BLOCK */}
							<div className="rounded-2xl bg-gradient-to-br from-[#071916] via-[#051613] to-[#030908] border border-[#20D68A]/40 p-5 sm:p-6 shadow-[0_0_40px_rgba(32,214,138,0.12)] relative overflow-hidden">
								<div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-[#20D68A] uppercase mb-3">
									<Sparkles size={16} />
									<span>AI EXECUTIVE AUDIT NARRATIVE & SUGGESTIONS</span>
								</div>

								<div className="p-4 sm:p-5 rounded-xl bg-[#04120E]/90 border border-[#20D68A]/30 text-xs sm:text-sm leading-relaxed text-[#EAF7F2] shadow-inner font-sans">
									<p className="first-letter:text-2xl first-letter:font-extrabold first-letter:text-[#20D68A] first-letter:mr-1">
										{data.aiSummaryParagraph}
									</p>
								</div>
							</div>

							{/* STRATEGIC DE-CARBONIZATION PILLARS */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="rounded-2xl bg-[#071916]/85 border border-[#16362E] p-4.5 space-y-2.5">
									<div className="w-8 h-8 rounded-xl bg-[#20D68A]/10 border border-[#20D68A]/30 text-[#20D68A] flex items-center justify-center">
										<Zap size={16} />
									</div>
									<h3 className="text-sm font-bold text-[#EAF7F2]">Scope 1 Thermal Recovery</h3>
									<p className="text-[11px] text-[#86A399] leading-relaxed">
										Deploy high-efficiency waste heat recovery on boilers and flue gas exhaust stacks. Recover thermal energy to pre-heat feedwater and reduce fossil gas burn by 15-20%.
									</p>
								</div>

								<div className="rounded-2xl bg-[#071916]/85 border border-[#16362E] p-4.5 space-y-2.5">
									<div className="w-8 h-8 rounded-xl bg-[#38D9E8]/10 border border-[#38D9E8]/30 text-[#38D9E8] flex items-center justify-center">
										<Box size={16} />
									</div>
									<h3 className="text-sm font-bold text-[#EAF7F2]">Scope 3 Feedstock Substitution</h3>
									<p className="text-[11px] text-[#86A399] leading-relaxed">
										Replace virgin industrial metal/polymer inputs with 30-40% certified recycled scrap feedstock. Drastically lowers upstream extraction footprint and raw material procurement costs.
									</p>
								</div>

								<div className="rounded-2xl bg-[#071916]/85 border border-[#16362E] p-4.5 space-y-2.5">
									<div className="w-8 h-8 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 text-[#A78BFA] flex items-center justify-center">
										<Recycle size={16} />
									</div>
									<h3 className="text-sm font-bold text-[#EAF7F2]">Circular Byproduct Monetization</h3>
									<p className="text-[11px] text-[#86A399] leading-relaxed">
										Channel solid process slag, ash, and polymer offcuts to verified B2B recycling partners in cement, metallurgy, and packaging industries to turn waste into a secondary revenue line.
									</p>
								</div>
							</div>
						</motion.div>
					)}

					{/* TAB 3: ROI & FINANCIAL PAYBACK CALCULATOR */}
					{activeTab === "roi" && (
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.35 }}
							className="space-y-5"
						>
							<div className="border-b border-[#16362E] pb-3">
								<span className="text-[10.5px] font-mono font-bold text-[#20D68A] uppercase tracking-widest">
									INTERACTIVE FINANCIAL MODELING
								</span>
								<h2 className="text-lg sm:text-xl font-bold text-[#EAF7F2]">
									De-carbonization ROI & Payback Calculator
								</h2>
								<p className="text-[11px] text-[#86A399] mt-0.5">
									Adjust investment variables below to calculate your estimated annual utility cost savings, payback timeline, and 5-year return on investment.
								</p>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
								{/* SLIDERS & INPUT CONTROL PANEL */}
								<div className="lg:col-span-6 rounded-2xl bg-[#071916]/85 backdrop-blur-2xl border border-[#16362E] p-5 sm:p-6 space-y-4 shadow-xl">
									<h3 className="text-xs font-bold text-[#20D68A] uppercase font-mono flex items-center space-x-2">
										<SlidersHorizontal size={14} />
										<span>Investment & Operational Variables</span>
									</h3>

									{/* Investment Slider */}
									<div className="space-y-1.5">
										<div className="flex justify-between text-[11px] font-semibold">
											<span className="text-[#86A399]">Capital Investment Budget ($)</span>
											<span className="text-[#20D68A] font-mono font-bold">
												${roiInvestment.toLocaleString()}
											</span>
										</div>
										<input
											type="range"
											min="100000"
											max="2000000"
											step="50000"
											value={roiInvestment}
											onChange={(e) => setRoiInvestment(Number(e.target.value))}
											className="w-full accent-[#20D68A] cursor-pointer bg-[#04120E] h-1.5 rounded-lg"
										/>
									</div>

									{/* Target Efficiency Reduction Slider */}
									<div className="space-y-1.5">
										<div className="flex justify-between text-[11px] font-semibold">
											<span className="text-[#86A399]">Target Energy & Material Reduction (%)</span>
											<span className="text-[#38D9E8] font-mono font-bold">{roiEfficiency}%</span>
										</div>
										<input
											type="range"
											min="5"
											max="50"
											step="1"
											value={roiEfficiency}
											onChange={(e) => setRoiEfficiency(Number(e.target.value))}
											className="w-full accent-[#38D9E8] cursor-pointer bg-[#04120E] h-1.5 rounded-lg"
										/>
									</div>

									{/* Annual Utility & Feedstock Cost Slider */}
									<div className="space-y-1.5">
										<div className="flex justify-between text-[11px] font-semibold">
											<span className="text-[#86A399]">Annual Energy & Raw Material Expense ($/yr)</span>
											<span className="text-[#EAF7F2] font-mono font-bold">
												${roiAnnualCost.toLocaleString()}
											</span>
										</div>
										<input
											type="range"
											min="300000"
											max="5000000"
											step="100000"
											value={roiAnnualCost}
											onChange={(e) => setRoiAnnualCost(Number(e.target.value))}
											className="w-full accent-[#20D68A] cursor-pointer bg-[#04120E] h-1.5 rounded-lg"
										/>
									</div>
								</div>

								{/* ROI METRICS OUTPUT PANEL */}
								<div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
									<div className="rounded-2xl bg-[#04120E] border border-[#20D68A]/40 p-4.5 flex flex-col justify-between shadow-[0_0_25px_rgba(32,214,138,0.12)]">
										<div className="flex items-center justify-between text-[#86A399] text-[10.5px] font-mono uppercase">
											<span>Annual Utility Cost Saved</span>
											<DollarSign size={14} className="text-[#20D68A]" />
										</div>
										<div className="my-2">
											<p className="text-2xl sm:text-3xl font-extrabold text-[#20D68A] font-mono">
												${annualSavingsMoney.toLocaleString()}
											</p>
											<p className="text-[10px] text-[#86A399] mt-0.5">Direct annual operational savings</p>
										</div>
									</div>

									<div className="rounded-2xl bg-[#04120E] border border-[#38D9E8]/40 p-4.5 flex flex-col justify-between shadow-[0_0_25px_rgba(56,217,232,0.12)]">
										<div className="flex items-center justify-between text-[#86A399] text-[10.5px] font-mono uppercase">
											<span>Payback Timeline</span>
											<Clock size={14} className="text-[#38D9E8]" />
										</div>
										<div className="my-2">
											<p className="text-2xl sm:text-3xl font-extrabold text-[#38D9E8] font-mono">
												{paybackYears} Years
											</p>
											<p className="text-[10px] text-[#86A399] mt-0.5">Break-even capital recovery</p>
										</div>
									</div>

									<div className="rounded-2xl bg-[#04120E] border border-[#16362E] p-4.5 flex flex-col justify-between">
										<div className="flex items-center justify-between text-[#86A399] text-[10.5px] font-mono uppercase">
											<span>Annual CO₂ Carbon Offset</span>
											<Leaf size={14} className="text-[#20D68A]" />
										</div>
										<div className="my-2">
											<p className="text-2xl sm:text-3xl font-extrabold text-[#EAF7F2] font-mono">
												{annualCO2Saved.toLocaleString()} tCO₂e
											</p>
											<p className="text-[10px] text-[#86A399] mt-0.5">Emissions avoided annually</p>
										</div>
									</div>

									<div className="rounded-2xl bg-[#04120E] border border-[#16362E] p-4.5 flex flex-col justify-between">
										<div className="flex items-center justify-between text-[#86A399] text-[10.5px] font-mono uppercase">
											<span>5-Year Net ROI</span>
											<TrendingUp size={14} className="text-[#20D68A]" />
										</div>
										<div className="my-2">
											<p className="text-2xl sm:text-3xl font-extrabold text-[#20D68A] font-mono">
												+{roiPercent}%
											</p>
											<p className="text-[10px] text-[#86A399] mt-0.5">Cumulative net return</p>
										</div>
									</div>
								</div>
							</div>

							{/* ROI DOTTED LINE CHART */}
							<div className="rounded-2xl bg-[#071916]/85 backdrop-blur-2xl border border-[#16362E] p-5 sm:p-6 shadow-xl">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-xs font-bold text-[#20D68A] uppercase font-mono flex items-center space-x-2">
										<TrendingUp size={14} />
										<span>5-Year Cumulative Cash Flow Projection</span>
									</h3>
								</div>
								<div className="w-full h-64">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={roiChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
											<CartesianGrid strokeDasharray="3 3" stroke="#16362E" vertical={false} />
											<XAxis dataKey="year" stroke="#86A399" fontSize={10} tickLine={false} axisLine={false} />
											<YAxis
												stroke="#86A399"
												fontSize={10}
												tickLine={false}
												axisLine={false}
												tickFormatter={(value) => `$${(value / 1000)}k`}
											/>
											<RechartsTooltip
												contentStyle={{ backgroundColor: '#04120E', borderColor: '#16362E', borderRadius: '8px', fontSize: '11px', color: '#EAF7F2' }}
												itemStyle={{ color: '#20D68A' }}
												formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
											/>
											<Line
												type="monotone"
												dataKey="balance"
												stroke="#20D68A"
												strokeWidth={2}
												strokeDasharray="5 5"
												dot={{ r: 4, fill: '#04120E', stroke: '#38D9E8', strokeWidth: 2 }}
												activeDot={{ r: 6, fill: '#20D68A', stroke: '#04120E' }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						</motion.div>
					)}

					{/* TAB 4: CIRCULAR WASTE REUSABILITY & RAW MATERIAL FEEDSTOCK EXCHANGE */}
					{activeTab === "waste" && (
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.35 }}
							className="space-y-5"
						>
							<div className="border-b border-[#16362E] pb-3">
								<span className="text-[10.5px] font-mono font-bold text-[#20D68A] uppercase tracking-widest">
									CIRCULAR ECONOMY WASTAGE MATCHMAKING
								</span>
								<h2 className="text-lg sm:text-xl font-bold text-[#EAF7F2]">
									Waste Reusability & Feedstock Exchange
								</h2>
								<p className="text-[11px] text-[#86A399] mt-0.5">
									Identify how your plant's waste streams can be repurposed into valuable raw materials for target purchasing industries and organizations.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{(data.wasteReuseMatches || []).map((item, index) => (
									<div
										key={item.id || index}
										className="rounded-2xl bg-[#071916]/85 backdrop-blur-2xl border border-[#16362E] p-4.5 shadow-[0_0_25px_rgba(32,214,138,0.06)] hover:border-[#20D68A]/50 transition-all flex flex-col justify-between space-y-3"
									>
										<div>
											<div className="flex items-center justify-between mb-2">
												<span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#20D68A] bg-[#20D68A]/10 border border-[#20D68A]/30 px-2.5 py-0.5 rounded-full">
													{item.reusabilityPotential || "High Reusability"}
												</span>
											</div>

											<h3 className="text-xs sm:text-sm font-bold text-[#EAF7F2] mb-1">
												{index + 1}. {item.wasteType}
											</h3>
											<p className="text-[11px] text-[#86A399] leading-relaxed">
												{item.diversionStrategy}
											</p>
										</div>

										<div className="space-y-2 pt-2.5 border-t border-[#16362E] font-mono text-[11px] bg-[#04120E]/60 p-3 rounded-xl border border-[#16362E]/40">
											<div>
												<span className="text-[9.5px] text-[#86A399] uppercase block font-semibold">
													Raw Material Substitute:
												</span>
												<span className="text-[#20D68A] font-bold block">
													{item.rawMaterialSubstitute}
												</span>
											</div>

											<div className="pt-0.5">
												<span className="text-[9.5px] text-[#86A399] uppercase block font-semibold">
													Target Purchasing Organizations:
												</span>
												<span className="text-[#EAF7F2] font-semibold block leading-tight">
													{item.targetIndustries}
												</span>
											</div>

											<div className="pt-1 flex justify-between items-center border-t border-[#16362E]/60">
												<span className="text-[9.5px] text-[#86A399] uppercase">
													Byproduct Value:
												</span>
												<span className="text-[#38D9E8] font-bold">
													{item.estimatedByproductValue}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</motion.div>
					)}
				</main>

				{/* Footer */}
				<footer className="relative z-10 border-t border-[#16362E] py-3 text-center text-[10.5px] text-[#86A399]/60 font-mono">
					CARBONTRACE &copy; 2026 &bull; POWERED BY GOOGLE GEMINI AI & IPCC EMISSION AUDIT PROTOCOLS
				</footer>
			</div>
		</div>
	);
}
