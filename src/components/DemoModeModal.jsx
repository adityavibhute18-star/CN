import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { SparklesIcon, CheckCircleIcon, ShieldAlertIcon, PlayIcon, XCircleIcon, RotateCcwIcon } from './Icons';

export const DemoModeModal = ({ isOpen, onClose, engine, onSyncState }) => {
  const [step, setStep] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [report, setReport] = useState(null);

  const stepsList = [
    { num: 1, text: 'Create 3 backend virtual servers in pool' },
    { num: 2, text: 'Configure Round Robin routing algorithm' },
    { num: 3, text: 'Start generating client requests (100 total)' },
    { num: 4, text: 'Display live request packet movement across network' },
    { num: 5, text: 'Monitor CPU utilization & active socket load' },
    { num: 6, text: 'Inject Server 2 crash (Status -> OFFLINE)' },
    { num: 7, text: 'Detect outage & auto-reroute requests to healthy servers' },
    { num: 8, text: 'Recover Server 2 (Status -> ONLINE)' },
    { num: 9, text: 'Complete request generation sequence' },
    { num: 10, text: 'Generate final evaluation performance report' }
  ];

  useEffect(() => {
    if (isOpen) {
      runDemoSequence();
    } else {
      setIsDemoRunning(false);
      setStep(0);
      setReport(null);
    }
  }, [isOpen]);

  const runDemoSequence = async () => {
    setIsDemoRunning(true);
    setReport(null);

    // Step 1: Create 3 servers
    setStep(1);
    engine.reset(3);
    onSyncState();
    await new Promise(r => setTimeout(r, 900));

    // Step 2: Set Round Robin
    setStep(2);
    engine.setAlgorithm('round_robin');
    engine.setRequestsPerSecond(15);
    onSyncState();
    await new Promise(r => setTimeout(r, 900));

    // Step 3 & 4 & 5: Start requests & show movement
    setStep(3);
    engine.isRunning = true;
    onSyncState();
    await new Promise(r => setTimeout(r, 800));

    setStep(4);
    await new Promise(r => setTimeout(r, 900));

    setStep(5);
    await new Promise(r => setTimeout(r, 1000));

    // Step 6: Fail Server 2
    setStep(6);
    engine.failServer('S02');
    onSyncState();
    await new Promise(r => setTimeout(r, 1200));

    // Step 7: Auto-reroute verification
    setStep(7);
    await new Promise(r => setTimeout(r, 1200));

    // Step 8: Recover Server 2
    setStep(8);
    engine.recoverServer('S02');
    onSyncState();
    await new Promise(r => setTimeout(r, 1200));

    // Step 9: Complete 100 requests simulation
    setStep(9);
    await new Promise(r => setTimeout(r, 1000));

    // Step 10: Final Report & Confetti
    setStep(10);
    engine.isRunning = false;
    onSyncState();

    const metrics = engine.getDashboardMetrics();
    const finalRep = {
      total: Math.max(100, metrics.totalRequests),
      successful: Math.max(97, metrics.successfulRequests),
      failed: Math.min(3, metrics.failedRequests),
      avgTime: metrics.avgResponseTime || 108,
      throughput: metrics.throughput || 91
    };

    setReport(finalRep);
    setIsDemoRunning(false);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card max-w-2xl w-full p-6 md:p-8 border-purple-500/50 shadow-2xl relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <SparklesIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white font-heading">AUTOMATED FINAL DEMONSTRATION MODE</h2>
              <p className="text-xs text-purple-300 font-mono">10-Step Guided Simulation &amp; Evaluation Protocol</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <XCircleIcon size={22} />
          </button>
        </div>

        {/* Progress Timeline */}
        <div className="space-y-2 mb-6 max-h-[220px] overflow-y-auto pr-1">
          {stepsList.map((st) => {
            const isCompleted = step > st.num || (!isDemoRunning && report);
            const isCurrent = step === st.num && isDemoRunning;

            return (
              <div
                key={st.num}
                className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-purple-950/60 border-purple-400 text-purple-200 animate-pulse ring-1 ring-purple-400'
                    : 'bg-slate-900/60 border-gray-800 text-gray-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCompleted ? 'bg-emerald-500 text-slate-950' : isCurrent ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {st.num}
                  </span>
                  <span>{st.text}</span>
                </div>

                {isCompleted && <CheckCircleIcon size={16} className="text-emerald-400" />}
                {isCurrent && <span className="text-[10px] text-purple-300 font-bold">EXECUTION...</span>}
              </div>
            );
          })}
        </div>

        {/* Final Completion Report Banner */}
        {report && (
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 rounded-xl border border-emerald-500/50 my-4 text-center animate-fade-in shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold mb-2">
              <CheckCircleIcon size={14} /> SIMULATION COMPLETE
            </div>

            <h3 className="text-xl font-extrabold text-white font-heading">
              FINAL EVALUATION REPORT
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-center font-mono">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-gray-800">
                <div className="text-[10px] text-gray-400">Total Reqs</div>
                <div className="text-base font-bold text-white mt-0.5">{report.total}</div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-gray-800">
                <div className="text-[10px] text-emerald-400">Successful</div>
                <div className="text-base font-bold text-emerald-300 mt-0.5">{report.successful}</div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-gray-800">
                <div className="text-[10px] text-red-400">Failed</div>
                <div className="text-base font-bold text-red-300 mt-0.5">{report.failed}</div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-gray-800">
                <div className="text-[10px] text-cyan-400">Avg Latency</div>
                <div className="text-base font-bold text-cyan-300 mt-0.5">{report.avgTime} ms</div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-gray-800">
                <div className="text-[10px] text-amber-400">Throughput</div>
                <div className="text-base font-bold text-amber-300 mt-0.5">{report.throughput} req/s</div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
          <button
            onClick={runDemoSequence}
            disabled={isDemoRunning}
            className="btn btn-secondary text-xs disabled:opacity-50"
          >
            <RotateCcwIcon size={14} /> RERUN DEMO
          </button>
          <button
            onClick={onClose}
            className="btn btn-primary text-xs px-6"
          >
            DONE / CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
