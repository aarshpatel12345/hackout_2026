const fs = require('fs');
const path = require('path');

const filePath = path.join('client/src/components/Layout.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add Menu and X to imports
content = content.replace('LayoutDashboard,', 'Menu,\n  X,\n  LayoutDashboard,');

// Add state for sidebar
content = content.replace(
    'const [showProfileMenu, setShowProfileMenu] = useState(false);',
    'const [showProfileMenu, setShowProfileMenu] = useState(false);\n  const [isSidebarOpen, setIsSidebarOpen] = useState(false);'
);

// Close sidebar on mobile when navigating
content = content.replace(
    'navigate(item.path);',
    'navigate(item.path);\n      setIsSidebarOpen(false);'
);

// Update sidebar container
content = content.replace(
    /<aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen">/,
    `{/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={\`fixed lg:sticky inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 \${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} h-screen\`}>`
);

// Add close button to mobile sidebar
content = content.replace(
    /<div className="px-4 mb-8 mt-4 cursor-pointer" onClick=\{\(\) => navigate\('\/dashboard'\)\}>/,
    `<div className="flex items-center justify-between px-4 mb-8 mt-4">
            <div className="cursor-pointer flex-1" onClick={() => navigate('/dashboard')}>
                <img src="/logo.jpg" alt="CarbonTrace Logo" className="w-full h-auto rounded-xl shadow-md border border-gray-800" />
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-2 px-2 text-center">Decarbonize Today. A Greener Tomorrow.</p>
            </div>
            <button 
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg ml-2"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="hidden">`
);

// Cleanup the hidden div we just introduced hackily, by actually just replacing the whole block properly
content = content.replace(
    /<div className="flex items-center justify-between px-4 mb-8 mt-4">[\s\S]*?<div className="hidden">[\s\S]*?<img src="\/logo.jpg" alt="CarbonTrace Logo" className="w-full h-auto rounded-xl shadow-md border border-gray-800" \/>\s*<p className="text-\[9px\] text-gray-500 uppercase tracking-wider mt-2 px-2 text-center">Decarbonize Today\. A Greener Tomorrow\.<\/p>\s*<\/div>/,
    `<div className="flex items-start justify-between px-4 mb-8 mt-4">
            <div className="cursor-pointer flex-1" onClick={() => navigate('/dashboard')}>
                <img src="/logo.jpg" alt="CarbonTrace Logo" className="w-full h-auto rounded-xl shadow-md border border-gray-800" />
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-2 px-2 text-center">Decarbonize Today. A Greener Tomorrow.</p>
            </div>
            <button 
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg ml-2"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>`
);


// Add mobile menu button to header
content = content.replace(
    /<header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">\s*<div className="flex-1 max-w-xl relative">/,
    `<header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex-1 relative">`
);

// Add closing div for the flex-1 relative
content = content.replace(
    /<\/kbd>\s*<\/div>\s*<\/div>/,
    `</kbd>
              </div>
            </div>
          </div>`
);


fs.writeFileSync(filePath, content);
console.log('Script completed phase 1');
