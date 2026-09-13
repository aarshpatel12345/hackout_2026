import React from 'react';
import Layout from '../components/Layout';
import { FileText } from 'lucide-react';

export default function Reports() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <FileText size={64} className="mb-4 text-gray-200" />
        <h2 className="text-xl font-bold text-gray-600 mb-2">Reports & Exports</h2>
        <p className="text-sm">This module is part of the CarbonTrace enterprise suite.</p>
      </div>
    </Layout>
  );
}
