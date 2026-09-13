import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Calculator, AlertCircle, Coins, Calendar, Leaf, Settings2, TrendingUp } from 'lucide-react';
import { getAnalysisApi } from '../api/analysisApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

export default function RoiCalculator() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sliders state
  const [years, setYears] = useState(5);
  const [inflationRate, setInflationRate] = useState(3);
  const [budgetCap, setBudgetCap] = useState(1000000);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getAnalysisApi();
        setData(response.data);
      } catch (err) {
        setError('Failed to load ROI Calculator data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Parse recommendation numbers for chart calculation
  const chartData = useMemo(() => {
    if (!data?.recommendations) return [];

    let totalInitialCost = 0;
    let totalAnnualSavings = 0;

    data.recommendations.forEach(rec => {
      // Basic parser for cost. Assumes numbers are present. 
      // If "lakh" is present, multiply by 100,000.
      let costStr = rec.estimatedCost.toLowerCase();
      let costVal = parseFloat(costStr.replace(/[^0-9.]/g, ''));
      if (costStr.includes('lakh')) costVal *= 100000;
      else if (costStr.includes('k')) costVal *= 1000;

      // Extract payback period
      let paybackVal = parseFloat(rec.payback.replace(/[^0-9.]/g, ''));
      if (!paybackVal || paybackVal <= 0) paybackVal = 1;

      // If budget cap is too low to implement all, this simulates partial implementation 
      // (simplification: we just sum up everything within budget, or scale it)
      if (totalInitialCost + costVal <= budgetCap) {
        totalInitialCost += costVal;
        totalAnnualSavings += (costVal / paybackVal);
      } else if (budgetCap > totalInitialCost) {
        // Implement partially up to budget
        const remainingBudget = budgetCap - totalInitialCost;
        const ratio = remainingBudget / costVal;
        totalInitialCost += remainingBudget;
        totalAnnualSavings += (costVal / paybackVal) * ratio;
      }
    });

    const projection = [];
    let cumulativeSavings = 0;
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        projection.push({
          year: 'Year 0',
          cost: totalInitialCost,
          netROI: -totalInitialCost,
          savings: 0
        });
      } else {
        // Apply inflation to savings (assuming energy/material costs rise)
        const inflatedSavings = totalAnnualSavings * Math.pow(1 + inflationRate / 100, year - 1);
        cumulativeSavings += inflatedSavings;
        projection.push({
          year: `Year ${year}`,
          cost: totalInitialCost,
          netROI: Math.round(cumulativeSavings - totalInitialCost),
          savings: Math.round(cumulativeSavings)
        });
      }
    }
    return projection;
  }, [data, years, inflationRate, budgetCap]);

  return (
    <Layout activeMenu="ROI & Cost Calculator">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="text-emerald-500" />
            ROI & Cost Calculator
          </h2>
          <p className="text-gray-500 text-sm mt-1">Financial impact & interactive projections for circular interventions</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      ) : data?.recommendations?.length > 0 ? (
        <div className="space-y-6">
          
          {/* Interactive Chart Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col xl:flex-row gap-8 border-t-4 border-t-emerald-400">
            {/* Sliders panel */}
            <div className="w-full xl:w-1/3 space-y-6">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Settings2 size={20} className="text-emerald-500" /> Prediction Variables
              </h3>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Projection Horizon</label>
                  <span className="text-sm font-bold text-emerald-700">{years} Years</span>
                </div>
                <input 
                  type="range" min="1" max="15" step="1" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Annual Cost Inflation</label>
                  <span className="text-sm font-bold text-emerald-700">{inflationRate}%</span>
                </div>
                <input 
                  type="range" min="0" max="15" step="0.5" 
                  value={inflationRate} 
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
                <p className="text-[10px] text-gray-400 mt-1">Expected annual increase in energy & raw material prices.</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Max Implementation Budget</label>
                  <span className="text-sm font-bold text-emerald-700">{(budgetCap).toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="5000" max="5000000" step="10000" 
                  value={budgetCap} 
                  onChange={(e) => setBudgetCap(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                  <TrendingUp size={16} /> Est. Net ROI (Year {years})
                </div>
                <div className="text-2xl font-extrabold text-emerald-700">
                  {chartData[chartData.length - 1]?.netROI > 0 ? '+' : ''}
                  {(chartData[chartData.length - 1]?.netROI || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="w-full xl:w-2/3 h-[350px]">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                Cumulative ROI Projection
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNetROI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" name="Net ROI (Cumulative Savings - Cost)" dataKey="netROI" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNetROI)" />
                  <Line type="stepAfter" name="Initial Investment Cap" dataKey="cost" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 className="font-bold text-xl text-gray-900 mt-8 mb-4">Recommended Interventions Breakdown</h3>
          <div className="grid grid-cols-1 gap-6">
            {data.recommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded ${
                        rec.priority === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-100' :
                        rec.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {rec.priority} Priority
                      </span>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {rec.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{rec.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-3xl">
                  {rec.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
                      <Leaf size={14} className="text-emerald-500" /> Est. CO₂ Reduction
                    </div>
                    <div className="text-sm font-bold text-emerald-700">{rec.co2Reduction}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
                      <Coins size={14} className="text-emerald-500" /> Estimated Cost
                    </div>
                    <div className="text-sm font-bold text-gray-900">{rec.estimatedCost}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
                      <Calendar size={14} className="text-gray-400" /> Payback Period
                    </div>
                    <div className="text-sm font-bold text-gray-900">{rec.payback}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-xl">
          No recommendations available. Please complete onboarding.
        </div>
      )}
    </Layout>
  );
}
