import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Calculator,
  Flame,
  FileText,
  Database,
  Settings,
  HelpCircle,
  Sun,
  RefreshCw,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  TreePine,
  Coins,
  Activity,
  Zap,
  Trash2,
  PlusCircle,
  Upload,
  BarChart3,
  ChevronRight,
  Leaf,
  Recycle,
  LayoutDashboard,
  Loader2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { getAnalysisApi, calculateAnalysisApi } from "../api/analysisApi";

// Hardcoded charts fallback/mock data
const barData = [
  { name: 'Jan', scope1: 45, scope2: 25, scope3: 20 },
  { name: 'Feb', scope1: 50, scope2: 28, scope3: 22 },
  { name: 'Mar', scope1: 48, scope2: 26, scope3: 21 },
  { name: 'Apr', scope1: 42, scope2: 22, scope3: 18 },
  { name: 'May', scope1: 46, scope2: 24, scope3: 20 },
  { name: 'Jun', scope1: 49, scope2: 27, scope3: 23 },
  { name: 'Jul', scope1: 52, scope2: 29, scope3: 25 },
  { name: 'Aug', scope1: 55, scope2: 30, scope3: 26 },
  { name: 'Sep', scope1: 47, scope2: 25, scope3: 21 },
  { name: 'Oct', scope1: 44, scope2: 23, scope3: 19 },
  { name: 'Nov', scope1: 41, scope2: 21, scope3: 18 },
  { name: 'Dec', scope1: 39, scope2: 20, scope3: 17 },
];

const miniLineData1 = [{v: 40}, {v: 30}, {v: 45}, {v: 25}, {v: 35}, {v: 20}];
const miniLineData2 = [{v: 100}, {v: 120}, {v: 105}, {v: 130}, {v: 140}, {v: 160}];

const COLORS = ['#059669', '#34d399', '#a7f3d0', '#6ee7b7'];

export default function Dashboard() {
  return (
    <Layout activeMenu="Dashboard">
      <DashboardOverview />
    </Layout>
  );
}

function SkeletonLoader() {
  return (
    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
      <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
      <h3 className="text-lg font-bold text-gray-900">Gemini AI is analyzing your data...</h3>
      <p className="text-sm text-gray-500">Recalculating emissions and optimizing circular interventions.</p>
    </div>
  );
}

function DashboardOverview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);

  const loadData = async () => {
    try {
      const response = await getAnalysisApi();
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickAction = async (actionName) => {
    if (actionName === "Run AI Analysis") {
      setRefetching(true);
      try {
        let onboardingData = null;
        try {
          const saved = localStorage.getItem("onboardingData");
          if (saved) onboardingData = JSON.parse(saved);
        } catch (e) {}
        const response = await calculateAnalysisApi(onboardingData);
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setRefetching(false);
      }
    } else if (actionName === "Calculate ROI") {
      navigate("/roi-calculator");
    } else {
      navigate(`/${actionName.toLowerCase().replace(/ /g, '-')}`);
    }
  };

  const totalEmissions = data?.totalCarbonFootprint || 73.1;
  const topSources = data?.topEmissionSources || [];
  const pieData = topSources.length > 0 
    ? topSources.map((s, i) => ({ name: s.source, value: s.percentage, color: COLORS[i % COLORS.length] }))
    : [
        { name: 'Energy', value: 45.0, color: '#059669' }, 
        { name: 'Virgin Material', value: 28.0, color: '#34d399' }, 
        { name: 'Landfilled Waste', value: 27.0, color: '#a7f3d0' }, 
      ];

  const recommendations = data?.recommendations || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      {refetching && <SkeletonLoader />}
      
      {/* Top Hero Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Hero Banner */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden relative shadow-sm flex min-h-[220px]">
          <div className="w-full lg:w-[60%] p-6 flex flex-col justify-center relative z-10 bg-gradient-to-r from-white via-white to-transparent">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-3 tracking-wide uppercase">
              <ShieldCheck size={16} className="text-emerald-500" />
              DE-CARBONIZATION OS & AUDIT INTELLIGENCE
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome back, <span className="text-emerald-600">Adam Mays</span>
            </h2>
            <p className="text-gray-600 font-medium text-lg mb-2">
              Turn operational data into measurable climate action.
            </p>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed">
              Real-time carbon accounting, AI audit narrative, financial ROI calculations, and circular waste feedstock matching — all in one place.
            </p>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-[50%] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10 w-1/3"></div>
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" 
              alt="Forest Landscape" 
              className="w-full h-full object-cover object-left"
            />
            <div className="absolute bottom-6 right-6 z-20 text-right">
              <p className="text-white font-bold text-sm drop-shadow-md">Smarter Decisions.</p>
              <p className="text-white font-extrabold text-lg drop-shadow-md">A Cleaner Tomorrow.</p>
            </div>
          </div>
        </div>

        {/* AI Engine Card */}
        <div className="w-full lg:w-72 bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex flex-col justify-between border-t-4 border-t-emerald-400">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600">
                <Sparkles size={18} />
              </div>
              <h3 className="font-bold text-xs text-gray-500 tracking-wide uppercase">AI Analysis Engine</h3>
            </div>
            <p className="font-bold text-gray-900 text-base leading-tight mb-2">
              Powered by <span className="text-emerald-600">Google Gemini AI</span><br/>
              <span className="text-xs font-normal text-gray-500">({data?.calculationEngine || 'gemini-3.5-flash'})</span>
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Get instant insights, recommendations and audit-ready narratives.
            </p>
          </div>
          <button 
            onClick={() => handleQuickAction("Run AI Analysis")}
            disabled={refetching}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {refetching ? 'Analyzing...' : 'Re-run AI Analysis'}
            {!refetching && <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Total Carbon Footprint */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                <TreePine size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Total Footprint</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                <TrendingDown size={12} className="mr-1" /> 24.0%
              </span>
              <span className="text-[9px] text-gray-400 mt-0.5">vs. baseline</span>
            </div>
          </div>
          <div className="flex items-end gap-2 mt-4">
            <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">{totalEmissions.toLocaleString()}</span>
            <span className="text-sm font-semibold text-emerald-600 mb-1">tCO₂e/yr</span>
          </div>
          <div className="h-8 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniLineData1}>
                <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Potential Savings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                <Leaf size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Potential Savings</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">~{Math.round(totalEmissions * 0.24).toLocaleString()}</span>
              <span className="text-sm font-semibold text-emerald-600 mb-1">tCO₂e/yr</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[11px] font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
            <TreePine size={14} className="text-emerald-600" />
            Equivalent to planting ~{Math.round(totalEmissions * 0.24 * 45)} trees
          </div>
        </div>

        {/* Estimated Cost Savings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-50 rounded-full text-amber-500">
                <Coins size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Est. Cost Savings</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">$12,400</span>
            </div>
          </div>
          <div className="h-8 mt-1 w-full relative">
              <div className="absolute -top-6 right-0 text-[10px] text-gray-400">by year-end</div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniLineData2}>
                <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">Based on recommended interventions</p>
        </div>

        {/* Active Interventions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-full text-blue-500">
                <Settings size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Active Interventions</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-gray-900 tracking-tighter">{recommendations.length}</span>
              <span className="text-sm font-medium text-gray-500 mb-1">identified</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1.5">
              <span>{recommendations.length} total opportunities</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        {/* Bar Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Leaf size={16} /> Carbon Emissions Trend
          </h3>
          
          <div className="flex gap-4 justify-end mb-2 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-800"></span> Scope 1</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> Scope 2</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-300"></span> Scope 3</div>
          </div>

          <div className="h-[200px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 } }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="scope1" stackId="a" fill="#065f46" radius={[0, 0, 4, 4]} barSize={16} />
                <Bar dataKey="scope2" stackId="a" fill="#059669" />
                <Bar dataKey="scope3" stackId="a" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Database size={16} /> Emissions by Source
          </h3>
          
          <div className="flex-1 flex items-center gap-4">
            <div className="relative w-[140px] h-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-gray-900">{totalEmissions.toLocaleString()}</span>
                <span className="text-[9px] font-medium text-gray-500">tCO₂e/yr</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="text-[10px] text-gray-400 font-medium text-right mb-1 border-b border-gray-100 pb-1">%</div>
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[11px] font-semibold text-gray-700 truncate" title={item.name}>{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900 ml-2">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Zap size={16} /> Quick Actions
          </h3>
          
          <div className="space-y-2 flex-1">
            {[
              { name: "Run AI Analysis", icon: Sparkles, primary: true },
              { name: "Add New Facility", icon: PlusCircle },
              { name: "Generate Report", icon: FileText },
              { name: "Calculate ROI", icon: Calculator },
            ].map((action, idx) => (
              <button 
                key={idx} 
                onClick={() => handleQuickAction(action.name)}
                disabled={refetching}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer disabled:opacity-50 ${action.primary ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  <action.icon size={16} className={action.primary ? "text-emerald-600" : "text-gray-400"} />
                  {action.name}
                </div>
                <ChevronRight size={16} className={action.primary ? "text-emerald-500" : "text-gray-300"} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interventions Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-emerald-500" size={20} />
              Recommended Interventions & Action Plan
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">AI-prioritized recommendations based on your data, with estimated impact and ROI.</p>
          </div>
          <button onClick={() => navigate('/roi-calculator')} className="text-sm font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((rec, idx) => (
            <div key={idx} onClick={() => navigate('/roi-calculator')} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded ${
                    rec.priority === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-100' :
                    rec.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {rec.category}
                  </span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-emerald-700 transition-colors">{rec.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">{rec.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mb-1"><Leaf size={12} className="text-emerald-500"/> CO₂ Red.</div>
                  <div className="text-[11px] font-bold text-emerald-700">{rec.co2Reduction}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mb-1"><Coins size={12} className="text-emerald-500"/> Est. Cost</div>
                  <div className="text-[11px] font-bold text-gray-900">{rec.estimatedCost}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mb-1"><Calendar size={12} className="text-gray-400"/> Payback</div>
                  <div className="text-[11px] font-bold text-gray-900">{rec.payback}</div>
                </div>
              </div>
            </div>
          ))}
          {recommendations.length === 0 && (
             <div className="col-span-3 bg-gray-50 border border-gray-200 text-gray-500 p-8 rounded-2xl text-center">
               No recommendations generated yet. Run the AI analysis to get started.
             </div>
          )}
        </div>
      </div>

      <footer className="pt-8 pb-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 mt-8 text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Leaf size={14} className="text-emerald-500" />
          <span className="font-bold text-gray-700">CARBONTRACE</span>
          <span className="text-gray-400">v1.0.0</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">Made for a Sustainable Future <Leaf size={12} className="text-emerald-500" /></span>
        </div>
      </footer>
    </div>
  );
}
