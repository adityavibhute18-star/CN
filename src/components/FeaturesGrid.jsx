import React from 'react';
import { UsersIcon, LayersIcon, ActivityIcon, ShieldAlertIcon, BarChartIcon, ZapIcon } from './Icons';

export const FeaturesGrid = () => {
  const features = [
    {
      title: 'Dynamic Request Simulation',
      desc: 'Generate concurrent virtual client requests with adjustable speed (1–50 rps) and payload metadata.',
      icon: UsersIcon,
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/40'
    },
    {
      title: 'Intelligent Routing',
      desc: 'Select backend servers dynamically using Round Robin, Least Connections, or Weighted Round Robin strategies.',
      icon: LayersIcon,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40'
    },
    {
      title: 'Real-Time Server Monitoring',
      desc: 'Monitor individual server CPU loads, active socket connections, and average response latencies in real time.',
      icon: ActivityIcon,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
    },
    {
      title: 'Server Fault Tolerance',
      desc: 'Simulate server crashes and hardware outages. Observe zero-downtime automatic traffic re-routing.',
      icon: ShieldAlertIcon,
      color: 'text-red-400 border-red-500/30 bg-red-950/40'
    },
    {
      title: 'Performance Analytics',
      desc: 'Measure total requests, success/failure counts, throughput rates, and average response times.',
      icon: BarChartIcon,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/40'
    },
    {
      title: 'Algorithm Comparison Matrix',
      desc: 'Empirically benchmark latency, throughput, and load distribution efficiency across all 3 routing algorithms.',
      icon: ZapIcon,
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/40'
    }
  ];

  return (
    <div className="glass-card p-6 my-8 border-cyan-500/30">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-800 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          <ZapIcon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-heading">MINI-PROJECT CORE FEATURES</h2>
          <p className="text-xs text-gray-400 font-sans">Key Computer Networks concepts demonstrated in simulation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="bg-slate-900/60 p-5 rounded-xl border border-gray-800 hover:border-cyan-500/40 transition-all flex items-start gap-4">
              <div className={`p-3 rounded-xl border flex-shrink-0 ${feat.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-heading mb-1">{feat.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
