import React, { useState } from 'react';
import { TerminalIcon, SearchIcon, DownloadIcon, RotateCcwIcon, CheckCircleIcon, XCircleIcon } from './Icons';

export const RequestLogsTable = ({ requestLogs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = requestLogs.filter(log => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.serverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.algorithm.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus =
      statusFilter === 'ALL' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Request ID', 'Client ID', 'Algorithm', 'Server ID', 'Response Time (ms)', 'Status', 'Timestamp'];
    const rows = filteredLogs.map(l => [l.id, l.clientId, l.algorithm, l.serverId, l.responseTime, l.status, l.timestamp]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `load_balancer_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card p-6 my-8 border-blue-900/40">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <TerminalIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">REAL-TIME REQUEST TELEMETRY LOGS</h2>
            <p className="text-xs text-gray-400 font-sans">Live HTTP request routing audit log stream</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="btn btn-secondary text-xs py-1.5 px-3"
          >
            <DownloadIcon size={14} /> EXPORT CSV
          </button>
          <button
            onClick={onClearLogs}
            className="btn btn-secondary text-xs py-1.5 px-3 text-red-400 border-red-500/30 hover:bg-red-950/40"
          >
            <RotateCcwIcon size={14} /> CLEAR LOGS
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search Request, Client, Server..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-xs w-full py-2"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-gray-800 text-xs font-mono">
          {['ALL', 'SUCCESS', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Table Area */}
      <div className="overflow-x-auto rounded-xl border border-gray-800 max-h-[400px]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead className="bg-slate-950 sticky top-0 z-10 border-b border-gray-800 text-gray-400">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">Client</th>
              <th className="p-3">Algorithm</th>
              <th className="p-3">Target Server</th>
              <th className="p-3 text-right">Response Time</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 bg-slate-900/40">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-3 font-bold text-white">{log.id}</td>
                <td className="p-3 text-cyan-300 font-semibold">{log.clientId}</td>
                <td className="p-3 text-gray-300">{log.algorithm}</td>
                <td className="p-3 font-bold text-emerald-300">{log.serverId}</td>
                <td className="p-3 text-right font-bold text-cyan-400">{log.responseTime} ms</td>
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-red-950 text-red-400 border border-red-800/50'
                  }`}>
                    {log.status === 'SUCCESS' ? <CheckCircleIcon size={12} /> : <XCircleIcon size={12} />}
                    {log.status}
                  </span>
                </td>
                <td className="p-3 text-right text-gray-400 text-[11px]">{log.timestamp}</td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 font-mono">
                  No matching request logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
