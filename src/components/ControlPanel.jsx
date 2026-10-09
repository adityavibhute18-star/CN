import React, { useState } from 'react';
import { ALGORITHMS, ALGORITHM_NAMES } from '../engine/simulationEngine';
import { PlayIcon, PauseIcon, RotateCcwIcon, SlidersIcon, ShieldAlertIcon, CheckCircleIcon, SparklesIcon } from './Icons';

export const ControlPanel = ({
  isRunning,
  onToggleRun,
  onReset,
  serverCount,
  onServerCountChange,
  rps,
  onRpsChange,
  algorithm,
  onAlgorithmChange,
  servers,
  onFailServer,
  onRecoverServer,
  onStartDemo
}) => {
  const [selectedFailTarget, setSelectedFailTarget] = useState('');
  const [selectedRecoverTarget, setSelectedRecoverTarget] = useState('');

  const onlineServers = servers.filter(s => s.status === 'ONLINE');
  const offlineServers = servers.filter(s => s.status === 'OFFLINE');

  const handleFailSubmit = (e) => {
    e.preventDefault();
    if (selectedFailTarget) {
      onFailServer(selectedFailTarget);
      setSelectedFailTarget('');
    }
  };

  const handleRecoverSubmit = (e) => {
    e.preventDefault();
    if (selectedRecoverTarget) {
      onRecoverServer(selectedRecoverTarget);
      setSelectedRecoverTarget('');
    }
  };

  return (
    <div className="glass-card p-5 md:p-6 mb-8 border-blue-900/40">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800/80 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <SlidersIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">SIMULATION CONTROL PANEL</h2>
            <p className="text-xs text-gray-400 font-sans">Configure server pool, request rate, and load balancing strategy</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleRun}
            className={`btn ${isRunning ? 'btn-secondary text-amber-300 border-amber-500/30' : 'btn-primary'} px-5`}
          >
            {isRunning ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
            <span>{isRunning ? 'PAUSE' : 'START SIMULATION'}</span>
          </button>

          <button
            onClick={onReset}
            className="btn btn-secondary px-4 text-gray-300"
            title="Reset Simulation State"
          >
            <RotateCcwIcon size={18} />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            onClick={onStartDemo}
            className="btn btn-demo px-4"
          >
            <SparklesIcon size={18} />
            <span>DEMO MODE</span>
          </button>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 1. Number of Servers */}
        <div className="form-group bg-slate-900/60 p-4 rounded-xl border border-gray-800">
          <div className="form-label">
            <span className="text-xs font-semibold text-gray-300">Number of Servers</span>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
              {serverCount} Servers
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="10"
            value={serverCount}
            onChange={(e) => onServerCountChange(parseInt(e.target.value, 10))}
            className="my-3"
          />
          <div className="flex justify-between text-[11px] text-gray-500 font-mono">
            <span>2 Virtual</span>
            <span>5 Optimal</span>
            <span>10 Max</span>
          </div>
        </div>

        {/* 2. Requests Per Second */}
        <div className="form-group bg-slate-900/60 p-4 rounded-xl border border-gray-800">
          <div className="form-label">
            <span className="text-xs font-semibold text-gray-300">Requests Per Second</span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/50">
              {rps} req/s
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={rps}
            onChange={(e) => onRpsChange(parseInt(e.target.value, 10))}
            className="my-3"
          />
          <div className="flex justify-between text-[11px] text-gray-500 font-mono">
            <span>1 Slow</span>
            <span>25 Medium</span>
            <span>50 High Load</span>
          </div>
        </div>

        {/* 3. Load Balancing Algorithm */}
        <div className="form-group bg-slate-900/60 p-4 rounded-xl border border-gray-800">
          <label className="form-label mb-2">
            <span className="text-xs font-semibold text-gray-300">Load Balancing Algorithm</span>
          </label>
          <select
            value={algorithm}
            onChange={(e) => onAlgorithmChange(e.target.value)}
            className="form-select w-full"
          >
            <option value={ALGORITHMS.ROUND_ROBIN}>Round Robin</option>
            <option value={ALGORITHMS.LEAST_CONNECTIONS}>Least Connections</option>
            <option value={ALGORITHMS.WEIGHTED_ROUND_ROBIN}>Weighted Round Robin</option>
          </select>
          <p className="text-[11px] text-gray-400 mt-2 font-mono">
            Selected: <span className="text-cyan-400 font-semibold">{ALGORITHM_NAMES[algorithm]}</span>
          </p>
        </div>

        {/* 4. Fault Injection & Recovery Controls */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-gray-800 space-y-3">
          <span className="text-xs font-semibold text-gray-300 block">Fault Tolerance Simulation</span>

          {/* Fail Server */}
          <form onSubmit={handleFailSubmit} className="flex gap-2">
            <select
              value={selectedFailTarget}
              onChange={(e) => setSelectedFailTarget(e.target.value)}
              className="form-select flex-1 text-xs py-1.5"
            >
              <option value="">Select Online Server...</option>
              {onlineServers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!selectedFailTarget}
              className="btn btn-danger btn-sm text-xs whitespace-nowrap disabled:opacity-50"
            >
              <ShieldAlertIcon size={14} />
              FAIL
            </button>
          </form>

          {/* Recover Server */}
          <form onSubmit={handleRecoverSubmit} className="flex gap-2">
            <select
              value={selectedRecoverTarget}
              onChange={(e) => setSelectedRecoverTarget(e.target.value)}
              className="form-select flex-1 text-xs py-1.5"
            >
              <option value="">Select Offline Server...</option>
              {offlineServers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!selectedRecoverTarget}
              className="btn btn-success btn-sm text-xs whitespace-nowrap disabled:opacity-50"
            >
              <CheckCircleIcon size={14} />
              RECOVER
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
