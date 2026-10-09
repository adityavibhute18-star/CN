import React from 'react';
import { ServerIcon, CpuIcon, ActivityIcon, ClockIcon, ShieldAlertIcon, CheckCircleIcon, ZapIcon } from './Icons';

export const ServerMonitoring = ({ servers, onFailServer, onRecoverServer, onUpdateWeight }) => {
  return (
    <div className="glass-card p-6 my-8 border-blue-900/40">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <ServerIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">SERVER POOL HEALTH &amp; TELEMETRY</h2>
            <p className="text-xs text-gray-400 font-sans">Individual server load, connection pools, and latency metrics</p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/50">
          Server Pool Size: {servers.length} Virtual Nodes
        </div>
      </div>

      {/* Grid of Server Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server) => {
          const isOffline = server.status === 'OFFLINE';
          const isHighLoad = server.cpuLoad > 80;

          return (
            <div
              key={server.id}
              className={`glass-card p-5 border transition-all flex flex-col justify-between ${
                isOffline
                  ? 'border-red-500/50 bg-red-950/20'
                  : isHighLoad
                  ? 'border-amber-500/50 bg-amber-950/20'
                  : 'border-cyan-500/30 bg-slate-900/70 hover:border-cyan-400/60'
              }`}
            >
              
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${
                      isOffline ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      <ServerIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white font-mono">{server.name}</h3>
                      <div className="text-[10px] text-gray-400 font-mono">IP: {server.ip}</div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`badge ${isOffline ? 'badge-offline' : isHighLoad ? 'badge-warning' : 'badge-online'}`}>
                    <span className={`pulse-dot ${isOffline ? 'offline' : 'online'}`}></span>
                    {server.status}
                  </span>
                </div>

                {/* Telemetry Metrics */}
                <div className="space-y-4 my-4 font-mono text-xs">
                  
                  {/* CPU / Load */}
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <CpuIcon size={14} className="text-cyan-400" /> CPU / Load
                      </span>
                      <span className={`font-bold ${isHighLoad ? 'text-amber-400' : isOffline ? 'text-red-400' : 'text-cyan-300'}`}>
                        {server.cpuLoad}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-gray-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isOffline
                            ? 'bg-red-500'
                            : isHighLoad
                            ? 'bg-gradient-to-r from-amber-500 to-red-500'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        }`}
                        style={{ width: `${server.cpuLoad}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Active Connections */}
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <ActivityIcon size={14} className="text-blue-400" /> Active Connections
                      </span>
                      <span className="font-bold text-white">
                        {server.activeConnections} / {server.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-gray-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (server.activeConnections / 20) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-gray-800/60">
                    <div className="bg-slate-950/70 p-2 rounded border border-gray-800/80">
                      <div className="text-gray-400 text-[10px]">Requests Processed</div>
                      <div className="text-sm font-bold text-white mt-0.5">{server.requestsProcessed}</div>
                    </div>
                    <div className="bg-slate-950/70 p-2 rounded border border-gray-800/80">
                      <div className="text-gray-400 text-[10px]">Avg Response Time</div>
                      <div className="text-sm font-bold text-cyan-300 mt-0.5">{server.avgResponseTime} ms</div>
                    </div>
                  </div>

                  {/* Weighted RR Weight Config */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                      <span>WRR Weight Capacity:</span>
                      <span className="font-bold text-purple-400">Weight {server.weight}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={server.weight}
                      onChange={(e) => onUpdateWeight(server.id, parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
                {isOffline ? (
                  <button
                    onClick={() => onRecoverServer(server.id)}
                    className="btn btn-success w-full text-xs py-2"
                  >
                    <CheckCircleIcon size={14} />
                    RECOVER SERVER
                  </button>
                ) : (
                  <button
                    onClick={() => onFailServer(server.id)}
                    className="btn btn-danger w-full text-xs py-2"
                  >
                    <ShieldAlertIcon size={14} />
                    FAIL SERVER
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
