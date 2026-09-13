const fs = require('fs');

let file = fs.readFileSync('client/src/pages/OnboardingPage.jsx', 'utf8');

file = file.replace(/import ParticleBackground from "..\/components\/ParticleBackground";\r?\n/g, '');
file = file.replace(/<ParticleBackground \/>\r?\n/g, '');
file = file.replace(/\{\/\* Animated Canvas Background \*\/\}\r?\n/g, '');
file = file.replace(/\{\/\* Animated Background Canvas \*\/\}\r?\n/g, '');
file = file.replace(/import CustomDropdown from "..\/components\/CustomDropdown";\r?\n/g, 'import CustomDropdown from "../components/CustomDropdown";\n');


const replacements = [
  { p: /bg-\[#030908\]/g, r: 'bg-gray-50' },
  { p: /bg-\[#071916\](?:\/(85|80))?/g, r: 'bg-white' },
  { p: /bg-\[#04120E\](?:\/80)?/g, r: 'bg-gray-50' },
  { p: /text-\[#EAF7F2\]/g, r: 'text-gray-900' },
  { p: /text-\[#86A399\](?:\/(75|50|40))?/g, r: 'text-gray-500' },
  { p: /border-\[#16362E\](?:\/60)?/g, r: 'border-gray-200' },
  { p: /text-\[#20D68A\]/g, r: 'text-emerald-600' },
  { p: /bg-\[#20D68A\]/g, r: 'bg-emerald-600' },
  { p: /text-\[#FF5C5C\]/g, r: 'text-red-500' },
  { p: /text-\[#FF7575\]/g, r: 'text-red-600' },
  { p: /bg-\[#FF5C5C\]\/10/g, r: 'bg-red-50' },
  { p: /border-\[#FF5C5C\]\/40/g, r: 'border-red-200' },
  { p: /text-\[#38D9E8\]/g, r: 'text-emerald-500' },
  { p: /border-\[#20D68A\]\/50/g, r: 'border-emerald-200' },
  { p: /btn-direct-fill/g, r: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors' },
  { p: /placeholder-\[#86A399\]\/40/g, r: 'placeholder-gray-400' },
  { p: /focus:border-\[#20D68A\]/g, r: 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white' },
  { p: /hover:border-\[#20D68A\]\/50/g, r: 'hover:border-emerald-300 hover:bg-gray-100' },
  { p: /hover:text-\[#EAF7F2\]/g, r: 'hover:text-gray-900' },
  { p: /hover:text-\[#20D68A\]/g, r: 'hover:text-emerald-600' },
  { p: /text-\[#030908\]/g, r: 'text-white' },
  { p: /shadow-\[.*?\]/g, r: 'shadow-lg' },
  { p: /backdrop-blur-2xl/g, r: '' },
  { p: /backdrop-blur-md/g, r: '' },
  { p: /bg-gradient-to-r from-transparent via-\[#20D68A\] to-transparent/g, r: 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent' },
  { p: /bg-\[#16362E\]/g, r: 'bg-gray-200' }
];

for (const {p, r} of replacements) {
  file = file.replace(p, r);
}

fs.writeFileSync('client/src/pages/OnboardingPage.jsx', file);
console.log('Replaced styles');
