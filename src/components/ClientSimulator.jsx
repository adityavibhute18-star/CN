import React from 'react';
import { UsersIcon, GlobeIcon, ActivityIcon, CheckCircleIcon, XCircleIcon } from './Icons';

export const ClientSimulator = ({ clients, recentLogs }) => {
  return (
    <div className="glass-card p-6 my-8 border-blue-900/40">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <UsersIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">VIRTUAL CLIENT SIMULATOR</h2>
            <p className="text-xs text-gray-400 font-sans">Simulating concurrent distributed clients generating HTTP requests</p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/50">
          Active Clients: {clients.length} Nodes
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Virtual Client Nodes Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {clients.map((client) => {
              const isSending = client.status === 'SENDING';
              return (
                <div
                  key={client.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isSending
                      ? 'bg-blue-950/60 border-cyan-400/80 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-slate-900/80 border-gray-800/80 hover:border-blue-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSending ? 'bg-cyan-400 animate-ping' : 'bg-gray-500'}`}></span>
                      <span className="text-xs font-bold text-white font-mono">{client.id}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-gray-800">
                      {client.requestsSent} reqs
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                    <GlobeIcon size={12} className="text-gray-500" />
                    <span>{client.location}</span>
                  </div>
                  <div className="text-[9px] text-gray-500 font-mono mt-0.5">
                    IP: {client.ip}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Request Inspector Feed */}
        <div className="lg:col-span-4 bg-slate-950/80 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <ActivityIcon size={14} /> LIVE REQUEST FEED
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Real-time Payload</span>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {recentLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-900/90 border border-gray-800/80 text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{log.id}</span>
                    <span className="text-[10px] text-cyan-400">{log.clientId}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-[10px] text-emerald-300 font-bold">{log.serverId}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {log.timestamp} • Algo: {log.algorithm}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-bold text-cyan-300">{log.responseTime} ms</div>
                  <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                    log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-red-950 text-red-400 border border-red-800/50'
                  }`}>
                    {log.status === 'SUCCESS' ? <CheckCircleIcon size={10} /> : <XCircleIcon size={10} />}
                    {log.status}
                  </span>
                </div>
              </div>
            ))}

            {recentLogs.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-500 font-mono">
                Waiting for incoming client requests...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
