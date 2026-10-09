import React from 'react';
import { TerminalIcon, LayersIcon, ActivityIcon, ZapIcon } from './Icons';

export const TechStackGrid = () => {
  const stacks = [
    {
      category: 'Frontend Core',
      icon: LayersIcon,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
      items: [
        { name: 'React.js', desc: 'Component Architecture & State' },
        { name: 'HTML5 & Vanilla CSS', desc: 'Glassmorphism Design System' },
        { name: 'JavaScript ES6+', desc: 'Async Engines & Algorithms' }
      ]
    },
    {
      category: 'Backend & Simulation API',
      icon: TerminalIcon,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
      items: [
        { name: 'Node.js & Express.js', desc: 'Simulated REST API Endpoints' },
        { name: 'Routing Logic Engine', desc: 'Smooth Weighted Round Robin' },
        { name: 'Health Probe Service', desc: 'Real-time Heartbeat Monitor' }
      ]
    },
    {
      category: 'Visualization & Animation',
      icon: ActivityIcon,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
      items: [
        { name: 'HTML5 2D Canvas', desc: 'Bezier Packet Physics & Particle Trails' },
        { name: 'Chart.js / SVG Telemetry', desc: 'Real-time Line & Bar Sparklines' },
        { name: 'Lucide Vector Icons', desc: 'Crisp Cyber Tech Visuals' }
      ]
    },
    {
      category: 'Communication & Infrastructure',
      icon: ZapIcon,
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
      items: [
        { name: 'RESTful API Protocol', desc: 'JSON Payloads over HTTP' },
        { name: 'Git & GitHub', desc: 'Version Control & Project Hosting' },
        { name: 'In-Memory Telemetry DB', desc: 'High-speed Log Aggregator' }
      ]
    }
  ];

  return (
    <div className="glass-card p-6 my-8 border-blue-900/40">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-800 mb-6">
        <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <TerminalIcon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-heading">TECHNOLOGY STACK ARCHITECTURE</h2>
          <p className="text-xs text-gray-400 font-sans">Engineering stack powering the Load Balancer mini-project</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stacks.map((stack, idx) => {
          const Icon = stack.icon;
          return (
            <div key={idx} className="bg-slate-900/60 p-5 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
                <div className={`p-2 rounded-lg border ${stack.color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-extrabold text-white font-heading">{stack.category}</h3>
              </div>

              <div className="space-y-3">
                {stack.items.map((item, i) => (
                  <div key={i} className="text-xs font-mono">
                    <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      {item.name}
                    </div>
                    <div className="text-[11px] text-gray-400 font-sans pl-3">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
