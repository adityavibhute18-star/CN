import React from 'react';
import { ShieldAlertIcon, CheckCircleIcon, ArrowRightIcon, ActivityIcon, RefreshCwIcon } from './Icons';

export const FaultToleranceSection = ({ servers, alertLogs, onFailServer, onRecoverServer }) => {
  const onlineServers = servers.filter(s => s.status === 'ONLINE');
  const offlineServers = servers.filter(s => s.status === 'OFFLINE');

  return (
    <div className="glass-card p-6 my-8 border-red-500/30">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
            <ShieldAlertIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">SERVER FAULT-TOLERANCE &amp; AUTOMATIC FAILOVER</h2>
            <p className="text-xs text-gray-400 font-sans">Simulate server hardware/network outages and observe automatic traffic re-routing</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            Active: {onlineServers.length} Healthy
          </span>
          {offlineServers.length > 0 && (
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-red-950/60 text-red-400 border border-red-800/50">
              Down: {offlineServers.length} Offline
            </span>
          )}
        </div>
      </div>

      {/* Concept Architecture Flow Banner */}
      <div className="bg-slate-950/90 p-5 rounded-xl border border-gray-800 mb-6">
        <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3">
          FAULTS &amp; RE-ROUTING WORKFLOW PROTOCOL:
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex-1 bg-red-950/40 p-3 rounded-lg border border-red-500/40 text-center">
            <div className="font-extrabold text-red-400 mb-1">1. FAULT DETECTED</div>
            <div className="text-[11px] text-gray-300">Server crashes or fails health probe</div>
          </div>

          <ArrowRightIcon className="text-gray-500 hidden md:block" size={20} />

          <div className="flex-1 bg-amber-950/40 p-3 rounded-lg border border-amber-500/40 text-center">
            <div className="font-extrabold text-amber-300 mb-1">2. SERVER REMOVED</div>
            <div className="text-[11px] text-gray-300">LB drops offline server from active routing pool</div>
          </div>

          <ArrowRightIcon className="text-gray-500 hidden md:block" size={20} />

          <div className="flex-1 bg-cyan-950/40 p-3 rounded-lg border border-cyan-500/40 text-center">
            <div className="font-extrabold text-cyan-300 mb-1">3. TRAFFIC RE-ROUTED</div>
            <div className="text-[11px] text-gray-300">Subsequent requests instantly target healthy nodes</div>
          </div>
        </div>
      </div>

      {/* Grid of Interactive Quick Controls & Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Instant Failure Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-gray-800">
            <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center gap-2">
              <ShieldAlertIcon size={16} className="text-red-400" /> INJECT SERVER FAILURE
            </h3>
            
            <p className="text-xs text-gray-300 mb-3 font-sans">
              Click a server below to simulate a hardware crash or network partition.
            </p>

            <div className="space-y-2">
              {servers.map((s) => {
                const isOffline = s.status === 'OFFLINE';
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-gray-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-emerald-400'}`}></span>
                      <span className="text-white font-bold">{s.name}</span>
                      <span className="text-gray-500">({s.ip})</span>
                    </div>

                    {isOffline ? (
                      <button
                        onClick={() => onRecoverServer(s.id)}
                        className="btn btn-success btn-sm text-[10px] py-1 px-2"
                      >
                        <CheckCircleIcon size={12} /> RECOVER
                      </button>
                    ) : (
                      <button
                        onClick={() => onFailServer(s.id)}
                        className="btn btn-danger btn-sm text-[10px] py-1 px-2"
                      >
                        <ShieldAlertIcon size={12} /> CRASH SERVER
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Fault Event Audit Log */}
        <div className="lg:col-span-7 bg-slate-950/90 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <ActivityIcon size={14} /> FAULT &amp; FAILOVER EVENT LOG
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Live Audit Trail</span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {alertLogs.map((log) => (
              <div
                key={log.id}
                className={`p-2.5 rounded-lg border text-xs font-mono flex items-start justify-between ${
                  log.type === 'DANGER'
                    ? 'bg-red-950/50 border-red-500/40 text-red-200'
                    : log.type === 'SUCCESS'
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                    : log.type === 'WARNING'
                    ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900 border-gray-800 text-gray-300'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold opacity-75 mr-2">[{log.timestamp}]</span>
                  <span>{log.message}</span>
                </div>
              </div>
            ))}

            {alertLogs.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-500 font-mono">
                No server failure events logged yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
