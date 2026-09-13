const fs = require('fs');
const pages = [
  { name: 'AiInsights', path: 'AiInsights.jsx', title: 'AI Strategic Insights', icon: 'Sparkles' },
  { name: 'RoiCalculator', path: 'RoiCalculator.jsx', title: 'ROI & Cost Calculator', icon: 'Calculator' },
  { name: 'WasteExchange', path: 'WasteExchange.jsx', title: 'Waste Reusability', icon: 'Recycle' },
  { name: 'SettingsPage', path: 'Settings.jsx', title: 'Settings', icon: 'Settings' }
];

pages.forEach(p => {
  const content = `import React from 'react';
import Layout from '../components/Layout';
import { ${p.icon} } from 'lucide-react';

export default function ${p.name}() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <${p.icon} size={64} className="mb-4 text-gray-200" />
        <h2 className="text-xl font-bold text-gray-600 mb-2">${p.title}</h2>
        <p className="text-sm">This module is part of the CarbonTrace enterprise suite.</p>
      </div>
    </Layout>
  );
}
`;
  fs.writeFileSync('client/src/pages/' + p.path, content);
});
console.log('Created placeholder pages.');
