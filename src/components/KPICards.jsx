import React from 'react';
import { ActivityIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ZapIcon, CpuIcon } from './Icons';

export const KPICards = ({ metrics = {} }) => {
  const m = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 124,
    throughput: 85,
    serverUtilization: 68,
    ...metrics
  };

  const cards = [
    {
      id: 'total',
      title: 'Total Requests',
      value: (m.totalRequests || 0).toLocaleString(),
      unit: 'reqs',
      icon: ActivityIcon,
      color: 'from-blue-500 to-cyan-400',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'success',
      title: 'Successful Requests',
      value: (m.successfulRequests || 0).toLocaleString(),
      unit: 'passed',
      icon: CheckCircleIcon,
      color: 'from-emerald-500 to-teal-400',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'failed',
      title: 'Failed Requests',
      value: (m.failedRequests || 0).toLocaleString(),
      unit: 'dropped',
      icon: XCircleIcon,
      color: (m.failedRequests || 0) > 0 ? 'from-red-500 to-rose-400' : 'from-gray-500 to-slate-400',
      iconBg: (m.failedRequests || 0) > 0 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    },
    {
      id: 'response_time',
      title: 'Avg Response Time',
      value: `${m.avgResponseTime || 0}`,
      unit: 'ms',
      icon: ClockIcon,
      color: 'from-cyan-400 to-indigo-400',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'throughput',
      title: 'Throughput',
      value: `${m.throughput || 0}`,
      unit: 'req/sec',
      icon: ZapIcon,
      color: 'from-amber-400 to-yellow-500',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'utilization',
      title: 'Server Utilization',
      value: `${m.serverUtilization || 0}%`,
      unit: 'load',
      icon: CpuIcon,
      color: (m.serverUtilization || 0) > 80 ? 'from-orange-500 to-red-500' : 'from-purple-500 to-indigo-400',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 my-6">
      {cards.map(card => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="glass-card p-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.iconBg}`}>
                <IconComponent size={18} />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {card.value}
              </span>
              <span className="text-xs font-medium text-gray-400 font-mono">
                {card.unit}
              </span>
            </div>

            {/* Bottom mini glow progress bar */}
            <div className="w-full bg-gray-800/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${card.color} transition-all duration-500`}
                style={{
                  width: card.id === 'utilization'
                    ? card.value
                    : card.id === 'success' && metrics.totalRequests > 0
                    ? `${Math.round((metrics.successfulRequests / metrics.totalRequests) * 100)}%`
                    : '100%'
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
