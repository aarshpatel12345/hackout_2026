import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Calculator, AlertCircle, Coins, Calendar, Leaf } from 'lucide-react';
import { getAnalysisApi } from '../api/analysisApi';

export default function RoiCalculator() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <Layout activeMenu="ROI & Cost Calculator">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calculator className="text-emerald-500" />
          ROI & Cost Calculator
        </h2>
        <p className="text-gray-500 text-sm mt-1">Financial impact of recommended circular interventions</p>
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
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-xl">
          No recommendations available. Please complete onboarding.
        </div>
      )}
    </Layout>
  );
}
