const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../src/app/page.tsx');
const navPath = path.join(__dirname, '../src/components/Navbar.tsx');

let page = fs.readFileSync(pagePath, 'utf8');
let nav = fs.readFileSync(navPath, 'utf8');

// Colors replacement mapping
const map = [
  { from: /bg-white/g, to: 'bg-zinc-950' },
  { from: /bg-slate-50/g, to: 'bg-zinc-900' },
  { from: /bg-slate-100/g, to: 'bg-zinc-800' },
  { from: /text-slate-900/g, to: 'text-white' },
  { from: /text-slate-700/g, to: 'text-zinc-300' },
  { from: /text-slate-600/g, to: 'text-zinc-400' },
  { from: /text-slate-500/g, to: 'text-zinc-500' },
  { from: /border-slate-200\/70/g, to: 'border-white\/10' },
  { from: /border-slate-200/g, to: 'border-white/10' },
  { from: /hover:bg-slate-50/g, to: 'hover:bg-white/5' },
  { from: /hover:bg-slate-100/g, to: 'hover:bg-white/10' },
  { from: /hover:text-slate-900/g, to: 'hover:text-white' },
  { from: /rgba\(255,255,255,/g, to: 'rgba(9,9,11,' }, // for zinc-950 gradient
  { from: /bg-white\/75/g, to: 'bg-zinc-950/75' }
];

map.forEach(({from, to}) => {
  page = page.replace(from, to);
  nav = nav.replace(from, to);
});

// Since we replaced bg-white with bg-zinc-950, some overrides on ButtonLink in page.tsx might be weird
// e.g., className="border border-white/10 bg-zinc-950 text-white shadow-sm hover:bg-white/5" is perfectly fine!

fs.writeFileSync(pagePath, page);
fs.writeFileSync(navPath, nav);
console.log('Dark mode applied successfully.');
