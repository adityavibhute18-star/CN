import React from 'react';
import { ServerIcon, ActivityIcon, PlayIcon, SparklesIcon } from './Icons';

export const Navbar = ({ activeTab, setActiveTab, isRunning, onToggleRun, onStartDemo }) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'servers', label: 'Servers' },
    { id: 'algorithms', label: 'Algorithms' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'logs', label: 'Request Logs' },
    { id: 'architecture', label: 'Architecture' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070a12]/90 backdrop-blur-md border-b border-blue-900/30 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
              <ServerIcon className="text-cyan-400" size={22} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white font-heading">
                LOAD BALANCER <span className="text-cyan-400">SIMULATOR</span>
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                v2.4 CN
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans hidden sm:block">
              Dynamic Request Distribution & Fault-Tolerance Simulation
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full py-1 scrollbar-none">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Side Status & Demo CTA */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] tracking-wider uppercase">System Status: ONLINE</span>
          </div>

          {/* Quick Demo Mode Button */}
          <button
            onClick={onStartDemo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all hover:scale-105"
          >
            <SparklesIcon size={14} />
            <span>DEMO MODE</span>
          </button>
        </div>

      </div>
    </header>
  );
};
