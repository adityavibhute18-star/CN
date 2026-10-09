import React from 'react';
import { ALGORITHMS, ALGORITHM_NAMES } from '../engine/simulationEngine';
import { LayersIcon, ArrowRightIcon, CpuIcon, ActivityIcon, CheckCircleIcon } from './Icons';

export const AlgorithmShowcase = ({ currentAlgorithm, onSelectAlgorithm, servers }) => {
  const algoDetails = [
    {
      id: ALGORITHMS.ROUND_ROBIN,
      title: '1. Round Robin (RR)',
      subtitle: 'Sequential Circular Distribution',
      description: 'Requests are distributed sequentially down the list of healthy servers in a circular order. Simple, deterministic, and ideal when all servers have equal processing capacity.',
      sequence: ['Request 1 → Server 01', 'Request 2 → Server 02', 'Request 3 → Server 03', 'Request 4 → Server 01', 'Request 5 → Server 02'],
      badge: 'Deterministic'
    },
    {
      id: ALGORITHMS.LEAST_CONNECTIONS,
      title: '2. Least Connections (LC)',
      subtitle: 'Dynamic Load-Aware Selection',
      description: 'Evaluates real-time active connections across all healthy servers and routes the incoming request to the server with the fewest active tasks. Best for long-lived sessions.',
      sequence: [
        `Server 01: ${servers[0]?.activeConnections || 8} conns`,
        `Server 02: ${servers[1]?.activeConnections || 3} conns`,
        `Server 03: ${servers[2]?.activeConnections || 5} conns`,
        `➔ Next Request → Target: Server 02 (Lowest: ${servers[1]?.activeConnections || 3})`
      ],
      badge: 'Dynamic & Load-Aware'
    },
    {
      id: ALGORITHMS.WEIGHTED_ROUND_ROBIN,
      title: '3. Weighted Round Robin (WRR)',
      subtitle: 'Proportional Capacity Routing',
      description: 'Assigns integer weights to servers based on hardware capability (e.g. CPU/RAM). Powerful servers with higher weights receive proportionally higher traffic slices (e.g., 5 : 3 : 2).',
      sequence: [
        `Server 01 (Weight 5) → ~50% Traffic`,
        `Server 02 (Weight 3) → ~30% Traffic`,
        `Server 03 (Weight 2) → ~20% Traffic`
      ],
      badge: 'Capacity Weighted'
    }
  ];

  return (
    <div className="glass-card p-6 my-8 border-cyan-500/30">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <LayersIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">LOAD BALANCING ALGORITHMS SHOWCASE</h2>
            <p className="text-xs text-gray-400 font-sans">Interactive breakdown &amp; mathematical distribution strategies</p>
          </div>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Click any strategy below to switch active algorithm
        </div>
      </div>

      {/* Algorithm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {algoDetails.map((algo) => {
          const isActive = currentAlgorithm === algo.id;
          return (
            <div
              key={algo.id}
              onClick={() => onSelectAlgorithm(algo.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-950/70 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                  : 'bg-slate-900/60 border-gray-800 hover:border-blue-900 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/50">
                    {algo.badge}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      <CheckCircleIcon size={12} /> ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-white font-heading mt-2">
                  {algo.title}
                </h3>
                <div className="text-xs font-semibold text-cyan-300 font-mono mb-2">
                  {algo.subtitle}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans mb-4">
                  {algo.description}
                </p>
              </div>

              {/* Live Sequence Visualizer Box */}
              <div className="bg-slate-950/90 p-3 rounded-lg border border-gray-800/80 font-mono text-[11px] text-gray-300 space-y-1">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                  Routing Sequence Sample:
                </div>
                {algo.sequence.map((seq, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-cyan-200">
                    <ArrowRightIcon size={10} className="text-cyan-400" />
                    <span>{seq}</span>
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
