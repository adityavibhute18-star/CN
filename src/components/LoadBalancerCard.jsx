import React from 'react';
import { ALGORITHM_NAMES } from '../engine/simulationEngine';
import { ServerIcon, ActivityIcon, ZapIcon, LayersIcon, CheckCircleIcon } from './Icons';

export const LoadBalancerCard = ({ algorithm, activeConnections = 0, totalRequests = 0, servers = [], recentLogs = [] }) => {
  const healthyCount = (servers || []).filter(s => s.status === 'ONLINE').length;

  return (
    <div className="glass-card p-6 my-8 border-cyan-500/40 relative overflow-hidden">
      
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center text-cyan-300">
              <ServerIcon size={26} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-heading tracking-wide">CENTRAL LOAD BALANCER CORE</h2>
            <p className="text-xs text-cyan-300 font-mono">Layer 4/7 Dynamic Request Router &amp; Health Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            Health Check: PASS ({healthyCount}/{servers.length} Healthy)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Current Algorithm */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Active Algorithm
            </span>
            <div className="text-lg font-bold text-white font-heading">
              {ALGORITHM_NAMES[algorithm]}
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
              Strategy Active
            </div>
          </div>
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <LayersIcon size={22} />
          </div>
        </div>

        {/* Card 2: Active Connections */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Active Connections
            </span>
            <div className="text-2xl font-extrabold text-cyan-300 font-mono">
              {activeConnections}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
              Simultaneous Sockets
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ActivityIcon size={22} />
          </div>
        </div>

        {/* Card 3: Requests Routed */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Total Requests Routed
            </span>
            <div className="text-2xl font-extrabold text-white font-mono">
              {(totalRequests || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              100% Routing Accuracy
            </div>
          </div>
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ZapIcon size={22} />
          </div>
        </div>

      </div>

      {/* Decision Log Stream */}
      <div className="mt-6 bg-slate-950/90 p-4 rounded-xl border border-gray-800 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-2">
          <span className="text-gray-400 font-semibold flex items-center gap-1.5 text-[11px]">
            <CheckCircleIcon size={14} className="text-cyan-400" /> ROUTING DECISION INSPECTOR
          </span>
          <span className="text-[10px] text-gray-500">Auto-Generated Stream</span>
        </div>

        <div className="flex items-center justify-between py-1.5 text-gray-300">
          <span>Targeting Pool: <span className="text-cyan-400 font-bold">[{servers.map(s => s.id).join(', ')}]</span></span>
          <span>Health Probe: <span className="text-emerald-400">ONLINE</span></span>
        </div>
      </div>

    </div>
  );
};
