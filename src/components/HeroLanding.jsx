import React from 'react';
import { PlayIcon, LayersIcon, ServerIcon, UsersIcon, ShieldAlertIcon, ActivityIcon, SparklesIcon } from './Icons';

export const HeroLanding = ({ onStartSimulation, onViewArchitecture, onStartDemo }) => {
  return (
    <div className="relative overflow-hidden py-12 md:py-20 px-4 max-w-7xl mx-auto">
      {/* Background Cyber Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <SparklesIcon size={14} />
            <span>Computer Networks University Mini-Project</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading">
            LOAD BALANCER <br />
            <span className="gradient-text">SIMULATOR</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-cyan-400 font-heading">
            "Dynamic Request Distribution &amp; Server Fault-Tolerance Simulation"
          </p>

          <p className="text-gray-300 text-base leading-relaxed max-w-2xl font-sans">
            Simulate client requests, intelligently distribute network traffic, monitor server performance,
            and visualize fault-tolerant load balancing in real time. Built with high-performance routing algorithms
            and live server monitoring.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onStartSimulation}
              className="btn btn-primary px-7 py-3 text-base shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40"
            >
              <PlayIcon size={18} />
              <span>START SIMULATION</span>
            </button>

            <button
              onClick={onViewArchitecture}
              className="btn btn-secondary px-6 py-3 text-base"
            >
              <LayersIcon size={18} />
              <span>VIEW ARCHITECTURE</span>
            </button>

            <button
              onClick={onStartDemo}
              className="btn btn-demo px-6 py-3 text-base"
            >
              <SparklesIcon size={18} />
              <span>DEMO MODE</span>
            </button>
          </div>

          {/* Specs Quick Pill */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800/80">
            <div>
              <div className="text-xl font-bold text-white font-mono">3 Algorithms</div>
              <div className="text-xs text-gray-400">RR, LC &amp; WRR</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400 font-mono">2–10 Servers</div>
              <div className="text-xs text-gray-400 font-sans">Dynamic Scaling</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400 font-mono">Fault Tolerant</div>
              <div className="text-xs text-gray-400 font-sans">Auto Re-routing</div>
            </div>
          </div>

        </div>

        {/* Right Interactive Architecture Visual Summary */}
        <div className="lg:col-span-6">
          <div className="glass-card p-6 md:p-8 border-cyan-500/30 relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                <ActivityIcon size={16} /> Topology Overview
              </span>
              <span className="text-xs text-gray-400 font-mono">Live Simulation Diagram</span>
            </div>

            {/* Visual Topology Diagram */}
            <div className="py-8 space-y-8 relative">

              {/* Step 1: Clients */}
              <div className="flex items-center justify-around bg-slate-900/60 p-4 rounded-xl border border-blue-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
                    <UsersIcon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white font-heading">VIRTUAL CLIENTS</div>
                    <div className="text-xs text-gray-400 font-mono">C001, C002, C003... C008</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-blue-900/40 text-blue-300 text-xs font-mono">
                  Generates Requests
                </div>
              </div>

              {/* Animated Connecting Vector line down */}
              <div className="flex justify-center -my-4 relative z-10">
                <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-cyan-400 animate-pulse"></div>
              </div>

              {/* Step 2: Load Balancer */}
              <div className="mx-auto max-w-sm bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 p-5 rounded-xl border border-cyan-500/40 text-center shadow-lg shadow-cyan-500/10">
                <div className="inline-flex p-2 rounded-lg bg-cyan-500/20 text-cyan-300 mb-2">
                  <ServerIcon size={24} />
                </div>
                <h3 className="text-base font-extrabold text-white font-heading tracking-wide">
                  CENTRAL LOAD BALANCER
                </h3>
                <p className="text-xs text-cyan-300 font-mono mt-1">
                  Intelligent Request Router &amp; Health Engine
                </p>
              </div>

              {/* Animated Splitting Lines */}
              <div className="flex justify-around -my-4 relative z-10 px-8">
                <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-emerald-400 animate-pulse"></div>
                <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-emerald-400 animate-pulse"></div>
                <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-emerald-400 animate-pulse"></div>
              </div>

              {/* Step 3: Server Pool */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Server 01', ip: '192.168.1.11', status: 'ONLINE', load: '42%' },
                  { name: 'Server 02', ip: '192.168.1.12', status: 'ONLINE', load: '38%' },
                  { name: 'Server 03', ip: '192.168.1.13', status: 'ONLINE', load: '55%' }
                ].map((srv, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-xs font-bold text-white font-mono">{srv.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">{srv.ip}</div>
                    <div className="mt-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 py-0.5 rounded border border-emerald-800/40">
                      {srv.status}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
