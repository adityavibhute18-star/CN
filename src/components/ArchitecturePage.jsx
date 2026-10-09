import React from 'react';
import { LayersIcon, ArrowRightIcon, ServerIcon, ActivityIcon, UsersIcon, ShieldAlertIcon, BarChartIcon, ZapIcon } from './Icons';

export const ArchitecturePage = () => {
  const components = [
    {
      step: '01',
      title: 'CLIENT SIMULATOR',
      icon: UsersIcon,
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/40',
      description: 'Generates distributed virtual client nodes (C001, C002...) simulating incoming HTTP requests from multiple geographical regions.'
    },
    {
      step: '02',
      title: 'REQUEST GENERATOR',
      icon: ZapIcon,
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40',
      description: 'Packages request metadata (Request ID, Client ID, Timestamp, payload size) and transmits packets at specified RPS rates.'
    },
    {
      step: '03',
      title: 'LOAD BALANCER CORE',
      icon: ServerIcon,
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/40',
      description: 'Central reverse proxy node that receives incoming network traffic and coordinates routing decisions without exposing internal server IPs.'
    },
    {
      step: '04',
      title: 'ALGORITHM ENGINE',
      icon: LayersIcon,
      color: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
      description: 'Executes configured load-balancing logic (Round Robin, Least Connections, or Weighted Round Robin) to select the optimal server.'
    },
    {
      step: '05',
      title: 'HEALTH MONITOR',
      icon: ShieldAlertIcon,
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
      description: 'Continuously performs heartbeat health checks. Immediately detects server outages, removes crashed nodes from rotation, and triggers re-routing.'
    },
    {
      step: '06',
      title: 'SERVER POOL',
      icon: ServerIcon,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
      description: 'Pool of virtual backend web servers (S01, S02...) that process incoming requests, manage active sockets, and return HTTP responses.'
    },
    {
      step: '07',
      title: 'METRICS ENGINE',
      icon: ActivityIcon,
      color: 'border-teal-500/40 text-teal-400 bg-teal-950/40',
      description: 'Aggregates response time latency, active socket connection numbers, throughput rates, and CPU utilization across all servers.'
    },
    {
      step: '08',
      title: 'ANALYTICS DASHBOARD',
      icon: BarChartIcon,
      color: 'border-rose-500/40 text-rose-400 bg-rose-950/40',
      description: 'Renders real-time telemetry charts, request distribution breakdowns, comparative algorithm benchmark metrics, and visual audit trails.'
    }
  ];

  return (
    <div className="glass-card p-6 my-8 border-cyan-500/30">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-8">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <LayersIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-heading">SYSTEM ARCHITECTURE &amp; COMPONENT FLOW</h2>
            <p className="text-xs text-gray-400 font-sans">End-to-end Computer Networks modular design</p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/50">
          8 Core Modules
        </div>
      </div>

      {/* Top Architecture Flow Diagram */}
      <div className="bg-slate-950/90 p-6 rounded-2xl border border-gray-800 mb-10 overflow-x-auto">
        <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4 text-center">
          SYSTEM COMPONENT PIPELINE DIAGRAM
        </div>

        <div className="flex items-center justify-between min-w-[900px] gap-2 py-4 px-2">
          {components.map((comp, idx) => {
            const Icon = comp.icon;
            return (
              <React.Fragment key={comp.step}>
                <div className="flex flex-col items-center text-center flex-1">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-2 ${comp.color} shadow-lg shadow-cyan-500/5`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">{comp.step}</span>
                  <span className="text-[11px] font-bold text-white font-heading leading-tight mt-0.5">{comp.title}</span>
                </div>

                {idx < components.length - 1 && (
                  <ArrowRightIcon size={16} className="text-gray-600 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Component Detail Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {components.map((comp) => {
          const Icon = comp.icon;
          return (
            <div key={comp.step} className="bg-slate-900/60 p-5 rounded-xl border border-gray-800 hover:border-blue-900 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg border ${comp.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    MODULE {comp.step}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white font-heading mb-2">
                  {comp.title}
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {comp.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
