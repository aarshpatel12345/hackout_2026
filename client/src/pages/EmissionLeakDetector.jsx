import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Activity, ShieldCheck, Flame, PieChart as PieChartIcon, ArrowRight,
    Box, Zap, Server
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

const EmissionLeakDetector = () => {
    const navigate = useNavigate();
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

    useEffect(() => {
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

    const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]; // Tailwind colors

    return (
        <Layout activeMenu="Emission Leak Detector">
            <div className="max-w-6xl mx-auto w-full">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-4 text-gray-500 hover:text-emerald-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                    <ArrowRight size={14} className="rotate-180" /> Back to Dashboard
                </button>
                <div className="flex items-center space-x-2 text-xs text-emerald-600 font-semibold mb-2 uppercase tracking-wide">
                    <ShieldCheck size={16} />
                    <span>EMISSION LEAK DETECTOR (CORE)</span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">AI Carbon Leak Analysis</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* INPUT FORM */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Server size={18} className="text-emerald-500" />
                            Factory Input Data
                        </h2>
                        <form onSubmit={handleAnalyze} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Industry Type</label>
                                <input type="text" name="industryType" value={formData.industryType} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Fuel Source</label>
                                <input type="text" name="fuelSource" value={formData.fuelSource} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Electricity Usage (kWh/month)</label>
                                <input type="number" name="electricityUsage" value={formData.electricityUsage} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Raw Materials</label>
                                <input type="text" name="rawMaterials" value={formData.rawMaterials} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Waste Streams</label>
                                <input type="text" name="wasteStreams" value={formData.wasteStreams} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Transportation</label>
                                <input type="text" name="transportation" value={formData.transportation} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                            </div>
                            
                            <button type="submit" disabled={loading} className="w-full mt-4 bg-emerald-600 text-white p-2.5 rounded-lg font-bold flex justify-center items-center gap-2 cursor-pointer hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70">
                                {loading ? "Analyzing..." : "Detect Leaks"}
                                <Activity size={16} />
                            </button>
                        </form>
                    </div>

                    {/* OUTPUT DASHBOARD */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading && (
                            <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                                <span className="text-emerald-600 font-medium animate-pulse flex items-center gap-2">
                                    <Activity className="animate-spin" size={18} /> Scanning factory processes...
                                </span>
                            </div>
                        )}
                        {!loading && result && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                
                                {/* Top Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center shadow-sm">
                                        <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wide">Total Emissions</p>
                                        <p className="text-2xl font-extrabold text-emerald-600 mt-1">{result.totalEmissions} <span className="text-xs font-semibold">tCO₂e</span></p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Scope 1</p>
                                        <p className="text-xl font-bold text-gray-900 mt-1">{result.scopes?.["Scope 1"]} <span className="text-xs font-semibold text-gray-500">tCO₂e</span></p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Scope 2</p>
                                        <p className="text-xl font-bold text-gray-900 mt-1">{result.scopes?.["Scope 2"]} <span className="text-xs font-semibold text-gray-500">tCO₂e</span></p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Scope 3</p>
                                        <p className="text-xl font-bold text-gray-900 mt-1">{result.scopes?.["Scope 3"]} <span className="text-xs font-semibold text-gray-500">tCO₂e</span></p>
                                    </div>
                                </div>

                                {/* Heatmap / Ranking */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Flame size={16} className="text-red-500" />
                                            Leak-Point Ranking
                                        </h3>
                                        <div className="h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={result.sources} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={80} stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
                                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <PieChartIcon size={16} className="text-blue-500" />
                                            Emission Percentage
                                        </h3>
                                        <div className="h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={result.sources} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2}>
                                                        {result.sources.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow / Sankey Logic visualization */}
                                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Activity size={16} className="text-purple-500" />
                                        Carbon Flow mapping (Source to Scope)
                                    </h3>
                                    <div className="space-y-3">
                                        {result.sankey?.map((flow, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-3 w-1/3">
                                                    <Box size={14} className="text-emerald-500" />
                                                    <span className="font-semibold text-sm text-gray-800">{flow.source}</span>
                                                </div>
                                                <div className="flex-1 px-4 flex items-center gap-2">
                                                    <div className="h-px bg-gradient-to-r from-emerald-400 to-purple-400 flex-1"></div>
                                                    <ArrowRight size={14} className="text-purple-400" />
                                                </div>
                                                <div className="flex items-center gap-3 w-1/3 justify-end">
                                                    <span className="font-semibold text-sm text-purple-600">{flow.target}</span>
                                                    <span className="text-xs bg-gray-200 font-medium px-2 py-1 rounded text-gray-700">{flow.value} tCO₂e</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Identified Leak Points */}
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Zap size={16} className="text-emerald-600" />
                                        AI Identified Leak Points & Reasons
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {result.leakPoints?.map((leak, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                                                        <Flame size={12} /> Leak Point
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-900">{leak.point}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{leak.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </motion.div>
                        )}
                        {!loading && !result && (
                            <div className="h-64 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                                <Server size={32} className="mb-3 opacity-50" />
                                <p className="text-sm font-medium">Submit data to generate Leak Report</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EmissionLeakDetector;
