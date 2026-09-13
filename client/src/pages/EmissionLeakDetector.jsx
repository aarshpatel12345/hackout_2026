import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Activity, ShieldCheck, Flame, PieChart as PieChartIcon, ArrowRight,
    CheckCircle2, Box, Zap, Recycle, Server
} from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import api from "../api/axios";

const EmissionLeakDetector = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        industryType: "Textile",
        fuelSource: "Coal",
        electricityUsage: "25000",
        rawMaterials: "Cotton",
        wasteStreams: "Wastewater",
        transportation: "Trucks",
    });

    // Restore last state on mount from database
    React.useEffect(() => {
        const fetchLeakData = async () => {
            try {
                const res = await api.get("/analysis/leak-detector");
                if (res.data?.success && res.data.data) {
                    const savedData = res.data.data;
                    if (savedData.input) setFormData(savedData.input);
                    if (savedData.output) setResult(savedData.output);
                }
            } catch (e) {
                console.error("Failed to restore state from database", e);
            }
        };
        fetchLeakData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post(`/analysis/leak-detector`, formData);
            if (res.data?.success) {
                setResult(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ["#20D68A", "#38D9E8", "#A78BFA", "#F472B6", "#FBBF24"];

    return (
        <div className="relative min-h-screen w-full bg-[#030908] text-[#EAF7F2] font-sans overflow-x-hidden p-6">
            <ParticleBackground />
            
            <div className="max-w-6xl mx-auto relative z-10 pt-4">
                <button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="mb-4 text-[#86A399] hover:text-[#20D68A] text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                >
                    <ArrowRight size={14} className="rotate-180" /> Back to Dashboard
                </button>
                <div className="flex items-center space-x-2 text-[11px] text-[#20D68A] font-mono mb-2">
                    <ShieldCheck size={16} />
                    <span>EMISSION LEAK DETECTOR (CORE)</span>
                </div>
                <h1 className="text-3xl font-bold mb-8">AI Carbon Leak Analysis</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* INPUT FORM */}
                    <div className="lg:col-span-1 bg-[#071916]/80 p-6 rounded-2xl border border-[#16362E]">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Server size={18} className="text-[#20D68A]" />
                            Factory Input Data
                        </h2>
                        <form onSubmit={handleAnalyze} className="space-y-4">
                            <div>
                                <label className="block text-xs text-[#86A399] mb-1">Industry Type</label>
                                <input type="text" name="industryType" value={formData.industryType} onChange={handleChange} className="w-full bg-[#04120E] border border-[#16362E] p-2 rounded-lg text-sm text-[#EAF7F2]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#86A399] mb-1">Fuel Source</label>
                                <input type="text" name="fuelSource" value={formData.fuelSource} onChange={handleChange} className="w-full bg-[#04120E] border border-[#16362E] p-2 rounded-lg text-sm text-[#EAF7F2]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#86A399] mb-1">Electricity Usage (kWh/month)</label>
                                <input type="number" name="electricityUsage" value={formData.electricityUsage} onChange={handleChange} className="w-full bg-[#04120E] border border-[#16362E] p-2 rounded-lg text-sm text-[#EAF7F2]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#86A399] mb-1">Raw Materials</label>
                                <input type="text" name="rawMaterials" value={formData.rawMaterials} onChange={handleChange} className="w-full bg-[#04120E] border border-[#16362E] p-2 rounded-lg text-sm text-[#EAF7F2]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#86A399] mb-1">Waste Streams</label>
                                <input type="text" name="wasteStreams" value={formData.wasteStreams} onChange={handleChange} className="w-full bg-[#04120E] border border-[#16362E] p-2 rounded-lg text-sm text-[#EAF7F2]" />
                            </div>
                            <div>
                                <label className="block text-xs text-[#86A399] mb-1">Transportation</label>
                                <input type="text" name="transportation" value={formData.transportation} onChange={handleChange} className="w-full bg-[#04120E] border border-[#16362E] p-2 rounded-lg text-sm text-[#EAF7F2]" />
                            </div>
                            
                            <button type="submit" disabled={loading} className="w-full mt-4 bg-[#20D68A] text-[#030908] p-2.5 rounded-lg font-bold flex justify-center items-center gap-2 cursor-pointer hover:bg-[#38D9E8] transition-colors">
                                {loading ? "Analyzing..." : "Detect Leaks"}
                                <Activity size={16} />
                            </button>
                        </form>
                    </div>

                    {/* OUTPUT DASHBOARD */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading && (
                            <div className="h-64 bg-[#071916]/80 rounded-2xl animate-pulse flex items-center justify-center border border-[#16362E]">
                                <span className="text-[#20D68A] font-mono animate-pulse">Scanning factory processes...</span>
                            </div>
                        )}
                        {!loading && result && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                
                                {/* Top Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-[#071916]/80 p-4 rounded-xl border border-[#20D68A]/40 text-center">
                                        <p className="text-[10px] text-[#86A399] uppercase">Total Emissions</p>
                                        <p className="text-2xl font-bold text-[#20D68A]">{result.totalEmissions} <span className="text-xs">tCO₂e</span></p>
                                    </div>
                                    <div className="bg-[#071916]/80 p-4 rounded-xl border border-[#16362E] text-center">
                                        <p className="text-[10px] text-[#86A399] uppercase">Scope 1</p>
                                        <p className="text-xl font-bold">{result.scopes?.["Scope 1"]} <span className="text-xs">tCO₂e</span></p>
                                    </div>
                                    <div className="bg-[#071916]/80 p-4 rounded-xl border border-[#16362E] text-center">
                                        <p className="text-[10px] text-[#86A399] uppercase">Scope 2</p>
                                        <p className="text-xl font-bold">{result.scopes?.["Scope 2"]} <span className="text-xs">tCO₂e</span></p>
                                    </div>
                                    <div className="bg-[#071916]/80 p-4 rounded-xl border border-[#16362E] text-center">
                                        <p className="text-[10px] text-[#86A399] uppercase">Scope 3</p>
                                        <p className="text-xl font-bold">{result.scopes?.["Scope 3"]} <span className="text-xs">tCO₂e</span></p>
                                    </div>
                                </div>

                                {/* Heatmap / Ranking */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#071916]/80 p-5 rounded-2xl border border-[#16362E]">
                                        <h3 className="text-sm font-bold text-[#EAF7F2] mb-4 flex items-center gap-2">
                                            <Flame size={16} className="text-[#FF5C5C]" />
                                            Leak-Point Ranking
                                        </h3>
                                        <div className="h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={result.sources} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={80} stroke="#86A399" fontSize={11} tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{ fill: '#04120E' }} contentStyle={{ backgroundColor: '#04120E', borderColor: '#16362E' }} />
                                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                        {result.sources.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Pie Chart */}
                                    <div className="bg-[#071916]/80 p-5 rounded-2xl border border-[#16362E]">
                                        <h3 className="text-sm font-bold text-[#EAF7F2] mb-4 flex items-center gap-2">
                                            <PieChartIcon size={16} className="text-[#38D9E8]" />
                                            Emission Percentage
                                        </h3>
                                        <div className="h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={result.sources} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                                                        {result.sources.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ backgroundColor: '#04120E', borderColor: '#16362E', borderRadius: '8px', color: '#fff' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow / Sankey Logic visualization */}
                                <div className="bg-[#071916]/80 p-5 rounded-2xl border border-[#16362E]">
                                    <h3 className="text-sm font-bold text-[#EAF7F2] mb-4 flex items-center gap-2">
                                        <Activity size={16} className="text-[#A78BFA]" />
                                        Carbon Flow mapping (Source to Scope)
                                    </h3>
                                    <div className="space-y-3">
                                        {result.sankey?.map((flow, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-[#04120E] p-3 rounded-lg border border-[#16362E]">
                                                <div className="flex items-center gap-3 w-1/3">
                                                    <Box size={14} className="text-[#20D68A]" />
                                                    <span className="font-semibold text-sm">{flow.source}</span>
                                                </div>
                                                <div className="flex-1 px-4 flex items-center gap-2">
                                                    <div className="h-px bg-gradient-to-r from-[#20D68A] to-[#A78BFA] flex-1"></div>
                                                    <ArrowRight size={14} className="text-[#A78BFA]" />
                                                </div>
                                                <div className="flex items-center gap-3 w-1/3 justify-end">
                                                    <span className="font-semibold text-sm text-[#A78BFA]">{flow.target}</span>
                                                    <span className="text-xs bg-[#16362E] px-2 py-1 rounded text-[#EAF7F2]">{flow.value} tCO₂e</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Identified Leak Points */}
                                <div className="bg-gradient-to-br from-[#071916] to-[#04120E] p-5 rounded-2xl border border-[#20D68A]/30">
                                    <h3 className="text-sm font-bold text-[#EAF7F2] mb-4 flex items-center gap-2">
                                        <Zap size={16} className="text-[#20D68A]" />
                                        AI Identified Leak Points & Reasons
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {result.leakPoints?.map((leak, idx) => (
                                            <div key={idx} className="bg-[#030908] p-4 rounded-xl border border-[#16362E] relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF5C5C]"></div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-[#FF5C5C] uppercase flex items-center gap-1">
                                                        <Flame size={12} /> Leak Point
                                                    </span>
                                                    <span className="text-sm font-bold text-[#EAF7F2]">{leak.point}</span>
                                                </div>
                                                <p className="text-xs text-[#86A399] mt-2">{leak.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </motion.div>
                        )}
                        {!loading && !result && (
                            <div className="h-64 border border-dashed border-[#16362E] rounded-2xl flex flex-col items-center justify-center text-[#86A399]">
                                <Server size={32} className="mb-3 opacity-50" />
                                <p className="text-sm">Submit data to generate Leak Report</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmissionLeakDetector;
