import React, { useEffect, useRef } from 'react';
import { ALGORITHM_NAMES } from '../engine/simulationEngine';
import { ServerIcon, UsersIcon, ShieldAlertIcon, ActivityIcon } from './Icons';

export const NetworkVisualizer = ({
  servers,
  clients,
  algorithm,
  activePackets,
  onFailServer,
  onRecoverServer
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Coordinates setup
      const lbX = width * 0.48;
      const lbY = height * 0.5;

      // Draw Client connections to LB
      const clientPositions = clients.map((c, idx) => {
        const yPos = (height * 0.15) + (idx * ((height * 0.7) / Math.max(1, clients.length - 1)));
        return { x: width * 0.12, y: yPos, client: c };
      });

      // Draw Server positions
      const serverPositions = servers.map((s, idx) => {
        const yPos = (height * 0.12) + (idx * ((height * 0.76) / Math.max(1, servers.length - 1)));
        return { x: width * 0.85, y: yPos, server: s };
      });

      // 1. Draw glowing background network lines from Clients to LB
      clientPositions.forEach(cp => {
        ctx.beginPath();
        ctx.moveTo(cp.x, cp.y);
        ctx.bezierCurveTo(width * 0.28, cp.y, width * 0.32, lbY, lbX, lbY);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // 2. Draw lines from LB to Servers
      serverPositions.forEach(sp => {
        ctx.beginPath();
        ctx.moveTo(lbX, lbY);
        ctx.bezierCurveTo(width * 0.62, lbY, width * 0.7, sp.y, sp.x, sp.y);
        
        if (sp.server.status === 'OFFLINE') {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.setLineDash([4, 4]);
        } else if (sp.server.cpuLoad > 80) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
          ctx.setLineDash([]);
        }
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Draw animated glowing request packets traveling
      activePackets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) pkt.progress = 1;

        const targetServerPos = serverPositions.find(sp => sp.server.id === pkt.serverId) || serverPositions[0];
        const clientPos = clientPositions[0]; // fallback

        if (targetServerPos && clientPos) {
          let px, py;
          if (pkt.progress < 0.5) {
            // Client -> LB
            const t = pkt.progress * 2;
            const cx1 = width * 0.28;
            const cy1 = clientPos.y;
            const cx2 = width * 0.32;
            const cy2 = lbY;

            // Bezier interpolation
            px = Math.pow(1 - t, 3) * clientPos.x + 3 * Math.pow(1 - t, 2) * t * cx1 + 3 * (1 - t) * Math.pow(t, 2) * cx2 + Math.pow(t, 3) * lbX;
            py = Math.pow(1 - t, 3) * clientPos.y + 3 * Math.pow(1 - t, 2) * t * cy1 + 3 * (1 - t) * Math.pow(t, 2) * cy2 + Math.pow(t, 3) * lbY;
          } else {
            // LB -> Server
            const t = (pkt.progress - 0.5) * 2;
            const cx1 = width * 0.62;
            const cy1 = lbY;
            const cx2 = width * 0.7;
            const cy2 = targetServerPos.y;

            px = Math.pow(1 - t, 3) * lbX + 3 * Math.pow(1 - t, 2) * t * cx1 + 3 * (1 - t) * Math.pow(t, 2) * cx2 + Math.pow(t, 3) * targetServerPos.x;
            py = Math.pow(1 - t, 3) * lbY + 3 * Math.pow(1 - t, 2) * t * cy1 + 3 * (1 - t) * Math.pow(t, 2) * cy2 + Math.pow(t, 3) * targetServerPos.y;
          }

          // Draw Glowing Packet Core
          ctx.save();
          ctx.shadowColor = targetServerPos.server.status === 'OFFLINE' ? '#ef4444' : '#22d3ee';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = targetServerPos.server.status === 'OFFLINE' ? '#f87171' : '#ffffff';
          ctx.fill();
          ctx.restore();
        }
      });

      // Filter completed packets
      for (let i = activePackets.length - 1; i >= 0; i--) {
        if (activePackets[i].progress >= 1) {
          activePackets.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [servers, clients, activePackets]);

  return (
    <div className="glass-card p-6 my-8 border-cyan-500/30">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <ActivityIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">NETWORK VISUALIZATION DIAGRAM</h2>
            <p className="text-xs text-gray-400 font-sans">Real-time packet routing topology (Client → Load Balancer → Servers)</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> 🟢 Healthy
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 🟡 High Load
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> 🔴 Failed
          </span>
        </div>
      </div>

      {/* Main Canvas Diagram Area */}
      <div className="relative w-full h-[420px] bg-slate-950/80 rounded-xl border border-gray-800 overflow-hidden bg-grid">
        
        {/* HTML5 Canvas overlay for Bezier Curves & Animated Packets */}
        <canvas
          ref={canvasRef}
          width={1000}
          height={420}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Overlay Node Elements */}
        
        {/* Left Column: Virtual Clients */}
        <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-around py-4 z-20 w-36">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1 font-semibold text-center bg-slate-900/90 py-1 rounded border border-gray-800">
            CLIENT POOL ({clients.length})
          </div>
          {clients.slice(0, 5).map((client) => (
            <div
              key={client.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-blue-900/50 shadow-md text-xs font-mono"
            >
              <UsersIcon size={14} className="text-blue-400" />
              <div>
                <div className="text-white font-bold">{client.id}</div>
                <div className="text-[9px] text-gray-400">{client.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Column: Load Balancer */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950 via-slate-900 to-cyan-950 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-500/20 max-w-[200px]">
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-2 border border-cyan-400/40">
              <ServerIcon size={24} />
            </div>
            <h3 className="text-sm font-extrabold text-white font-heading tracking-wide">LOAD BALANCER</h3>
            <div className="text-[11px] font-mono text-cyan-300 mt-1 font-bold">
              {ALGORITHM_NAMES[algorithm]}
            </div>
            <div className="mt-2 text-[10px] text-gray-400 font-mono bg-slate-950/80 py-1 px-2 rounded border border-gray-800">
              Intelligent Routing
            </div>
          </div>
        </div>

        {/* Right Column: Virtual Servers */}
        <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-around py-3 z-20 w-44">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1 font-semibold text-center bg-slate-900/90 py-1 rounded border border-gray-800">
            SERVER POOL ({servers.length})
          </div>
          {servers.map((server) => {
            const isOffline = server.status === 'OFFLINE';
            const isHighLoad = server.cpuLoad > 75;

            return (
              <div
                key={server.id}
                className={`p-2.5 rounded-xl border transition-all text-xs font-mono relative group ${
                  isOffline
                    ? 'bg-red-950/40 border-red-500/60 text-red-300'
                    : isHighLoad
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                    : 'bg-slate-900/90 border-cyan-500/40 text-cyan-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={`w-2 h-2 rounded-full ${
                      isOffline ? 'bg-red-500' : isHighLoad ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
                    }`}></span>
                    <span>{server.id}</span>
                  </div>
                  <span className="text-[10px] opacity-80">{server.cpuLoad}% CPU</span>
                </div>

                <div className="flex items-center justify-between text-[10px] opacity-90">
                  <span>Reqs: {server.requestsProcessed}</span>
                  <span>Conns: {server.activeConnections}</span>
                </div>

                {/* Quick Toggle Action on Hover */}
                <div className="mt-2 pt-1 border-t border-gray-800/80 flex justify-end">
                  {isOffline ? (
                    <button
                      onClick={() => onRecoverServer(server.id)}
                      className="text-[9px] bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-bold"
                    >
                      RECOVER
                    </button>
                  ) : (
                    <button
                      onClick={() => onFailServer(server.id)}
                      className="text-[9px] bg-red-900/80 hover:bg-red-800 text-red-200 px-2 py-0.5 rounded font-bold"
                    >
                      CRASH
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
