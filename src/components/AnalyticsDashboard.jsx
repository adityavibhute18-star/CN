import React from 'react';
import { ALGORITHMS, ALGORITHM_NAMES } from '../engine/simulationEngine';
import { BarChartIcon, ActivityIcon, ClockIcon, ZapIcon, CpuIcon, CheckCircleIcon } from './Icons';

export const AnalyticsDashboard = ({ servers, metricsHistory, algorithmStats, totalRequests, successfulRequests, failedRequests }) => {

  // Total requests processed per server for distribution breakdown
  const serverDistribution = servers.map(s => ({
    id: s.id,
    name: s.name,
    processed: s.requestsProcessed,
    percentage: totalRequests > 0 ? Math.round((s.requestsProcessed / totalRequests) * 100) : 0
  }));

  return (
    <div className="glass-card p-6 my-8 border-cyan-500/30">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <BarChartIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">PERFORMANCE ANALYTICS &amp; BENCHMARKING</h2>
            <p className="text-xs text-gray-400 font-sans font-normal">Real-time metrics charts, traffic distribution &amp; algorithm comparison</p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/50">
          Telemetry Data: Live Sampling
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 1. Request Distribution among servers */}
        <div className="lg:col-span-6 bg-slate-900/80 p-5 rounded-xl border border-gray-800">
          <h3 className="text-sm font-bold text-white font-heading mb-4 flex items-center justify-between">
            <span>REQUEST DISTRIBUTION PER SERVER</span>
            <span className="text-xs font-mono text-cyan-400">{totalRequests} Total</span>
          </h3>

          <div className="space-y-4">
            {serverDistribution.map((sd) => (
              <div key={sd.id} className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-gray-300">
                  <span className="font-bold text-white">{sd.name} ({sd.id})</span>
                  <span className="text-cyan-400">{sd.processed} reqs ({sd.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${sd.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Success vs Failure Breakout */}
        <div className="lg:col-span-6 bg-slate-900/80 p-5 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-heading mb-4 flex items-center justify-between">
              <span>SUCCESSFUL VS FAILED REQUESTS</span>
              <span className="text-xs font-mono text-emerald-400">
                {totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 100}% Success Rate
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-4 my-2 font-mono">
              <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/30 text-center">
                <div className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">SUCCESSFUL</div>
                <div className="text-2xl font-extrabold text-emerald-300 mt-1">{successfulRequests}</div>
                <div className="text-[10px] text-emerald-400/80 mt-1">Routed &amp; Processed</div>
              </div>

              <div className="bg-red-950/40 p-4 rounded-xl border border-red-500/30 text-center">
                <div className="text-xs text-red-400 uppercase tracking-wider font-semibold">FAILED</div>
                <div className="text-2xl font-extrabold text-red-300 mt-1">{failedRequests}</div>
                <div className="text-[10px] text-red-400/80 mt-1">Dropped / Outage</div>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-gray-800 flex mt-4">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100}%` }}
            ></div>
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* 3. Real-Time Timeline Sparkline / Chart */}
        <div className="lg:col-span-12 bg-slate-900/80 p-5 rounded-xl border border-gray-800">
          <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center justify-between">
            <span>RESPONSE TIME &amp; THROUGHPUT TIMELINE</span>
            <span className="text-xs font-mono text-gray-400">Last 25 Interval Sampling</span>
          </h3>

          <div className="h-36 flex items-end gap-1.5 pt-4 pb-2 px-2 bg-slate-950/90 rounded-lg border border-gray-800 overflow-x-auto">
            {metricsHistory.map((m, idx) => {
              const heightPercent = Math.min(100, Math.max(15, (m.avgResponseTime / 250) * 100));
              return (
                <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] p-2 rounded border border-gray-700 whitespace-nowrap z-30 shadow-xl font-mono">
                    <span className="text-cyan-400 font-bold">{m.timestamp}</span>
                    <span>Avg Latency: {m.avgResponseTime} ms</span>
                    <span>Throughput: {m.throughput} req/s</span>
                  </div>

                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-200"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  <span className="text-[8px] font-mono text-gray-500 mt-1 truncate max-w-full">
                    {idx % 5 === 0 ? m.timestamp.split(':')[2] + 's' : ''}
                  </span>
                </div>
              );
            })}

            {metricsHistory.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-xs font-mono text-gray-500">
                Start simulation to record metrics telemetry timeline...
              </div>
            )}
          </div>
        </div>

        {/* 4. Algorithm Comparison Table */}
        <div className="lg:col-span-12 bg-slate-900/80 p-5 rounded-xl border border-cyan-500/30">
          <h3 className="text-base font-extrabold text-white font-heading mb-4 flex items-center justify-between">
            <span>ALGORITHM PERFORMANCE COMPARISON BENCHMARK</span>
            <span className="text-xs font-mono text-cyan-300">Live Empirical Evaluation</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 bg-slate-950/60">
                  <th className="p-3">Algorithm</th>
                  <th className="p-3 text-right">Avg Response Time</th>
                  <th className="p-3 text-right">Throughput</th>
                  <th className="p-3 text-right">Server Utilization</th>
                  <th className="p-3 text-right">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {[
                  { id: ALGORITHMS.ROUND_ROBIN, name: 'Round Robin', stats: algorithmStats?.[ALGORITHMS.ROUND_ROBIN] },
                  { id: ALGORITHMS.LEAST_CONNECTIONS, name: 'Least Connections', stats: algorithmStats?.[ALGORITHMS.LEAST_CONNECTIONS] },
                  { id: ALGORITHMS.WEIGHTED_ROUND_ROBIN, name: 'Weighted Round Robin', stats: algorithmStats?.[ALGORITHMS.WEIGHTED_ROUND_ROBIN] }
                ].map((row) => {
                  const stats = row.stats || { total: 0, success: 0, avgTime: 120, throughput: 0, utilization: 0 };
                  const successRate = stats.total > 0
                    ? Math.round((stats.success / stats.total) * 100)
                    : 100;
                  return (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white font-heading flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        {row.name}
                      </td>
                      <td className="p-3 text-right text-cyan-300 font-bold">{stats.avgTime || 0} ms</td>
                      <td className="p-3 text-right text-amber-300 font-bold">{stats.throughput || 0} req/s</td>
                      <td className="p-3 text-right text-purple-300 font-bold">{stats.utilization || 0}%</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">{successRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
