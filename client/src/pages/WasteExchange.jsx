import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Recycle, AlertCircle, TrendingUp, Building, PackageOpen } from 'lucide-react';
import { getAnalysisApi } from '../api/analysisApi';

export default function WasteExchange() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getAnalysisApi();
        setData(response.data);
      } catch (err) {
        setError('Failed to load Waste Reusability data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <Layout activeMenu="Waste Reusability">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Recycle className="text-emerald-500" />
          Waste Reusability & Feedstock Matching
        </h2>
        <p className="text-gray-500 text-sm mt-1">Discover B2B exchange opportunities for your waste streams</p>
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
      ) : data?.wasteReuseMatches?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {data.wasteReuseMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-emerald-300 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{match.strategyName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <PackageOpen size={16} className="text-emerald-500" />
                    <span>Waste Stream: <span className="font-semibold text-gray-700">{match.wasteUsedAsRawMaterial}</span></span>
                  </div>
                </div>
                <div className="shrink-0 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Est. Market Value</span>
                  <span className="font-bold text-gray-900">{match.marketValueRange}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {match.strategyDescription}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <Building size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Target Buyer Organizations</span>
                  <span className="text-sm font-semibold text-gray-800">{match.targetOrganizations}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-xl">
          No waste reuse matches available. Please complete onboarding.
        </div>
      )}
    </Layout>
  );
}
