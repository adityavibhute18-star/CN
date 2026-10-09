import React, { useState, useEffect, useRef } from 'react';
import { SimulationEngine, ALGORITHMS } from './engine/simulationEngine';
import { SimulatedApi } from './api/simulatedApi';

import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { KPICards } from './components/KPICards';
import { ControlPanel } from './components/ControlPanel';
import { NetworkVisualizer } from './components/NetworkVisualizer';
import { ClientSimulator } from './components/ClientSimulator';
import { LoadBalancerCard } from './components/LoadBalancerCard';
import { AlgorithmShowcase } from './components/AlgorithmShowcase';
import { ServerMonitoring } from './components/ServerMonitoring';
import { FaultToleranceSection } from './components/FaultToleranceSection';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { RequestLogsTable } from './components/RequestLogsTable';
import { ArchitecturePage } from './components/ArchitecturePage';
import { TechStackGrid } from './components/TechStackGrid';
import { FeaturesGrid } from './components/FeaturesGrid';
import { DemoModeModal } from './components/DemoModeModal';

export default function App() {
  const engineRef = useRef(new SimulationEngine());
  const apiRef = useRef(new SimulatedApi(engineRef.current));

  const [activeTab, setActiveTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(false);
  const [serverCount, setServerCount] = useState(3);
  const [rps, setRps] = useState(10);
  const [algorithm, setAlgorithm] = useState(ALGORITHMS.ROUND_ROBIN);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // State slices synced with Engine
  const [servers, setServers] = useState([]);
  const [clients, setClients] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 124,
    throughput: 85,
    serverUtilization: 68
  });
  const [requestLogs, setRequestLogs] = useState([]);
  const [activePackets, setActivePackets] = useState([]);
  const [alertLogs, setAlertLogs] = useState([]);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [algorithmStats, setAlgorithmStats] = useState({});

  // Sync state from engine
  const syncState = () => {
    const engine = engineRef.current;
    setServers([...engine.servers]);
    setClients([...engine.clients]);
    setMetrics(engine.getDashboardMetrics());
    setRequestLogs([...engine.requestLogs]);
    setActivePackets([...engine.activePackets]);
    setAlertLogs([...engine.alertLogs]);
    setMetricsHistory([...engine.metricsHistory]);
    setAlgorithmStats({ ...engine.algorithmStats });
    setIsRunning(engine.isRunning);
    setAlgorithm(engine.algorithm);
    setServerCount(engine.servers.length);
  };

  // Initial Sync
  useEffect(() => {
    syncState();
  }, []);

  // Main tick timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      const engine = engineRef.current;
      if (engine.isRunning) {
        // Generate requests based on RPS
        const requestsToMake = Math.max(1, Math.floor(engine.requestsPerSecond / 10));
        for (let i = 0; i < requestsToMake; i++) {
          engine.generateRequest();
        }
        engine.tick();
      }
      syncState();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Control handlers calling simulated REST API
  const handleToggleRun = async () => {
    if (isRunning) {
      await apiRef.current.stopSimulation();
    } else {
      await apiRef.current.startSimulation();
    }
    syncState();
  };

  const handleReset = async () => {
    await apiRef.current.resetSimulation(serverCount);
    syncState();
  };

  const handleServerCountChange = (newCount) => {
    setServerCount(newCount);
    engineRef.current.setServerCount(newCount);
    syncState();
  };

  const handleRpsChange = (newRps) => {
    setRps(newRps);
    engineRef.current.setRequestsPerSecond(newRps);
    syncState();
  };

  const handleAlgorithmChange = async (newAlgo) => {
    await apiRef.current.setAlgorithm(newAlgo);
    syncState();
  };

  const handleFailServer = async (serverId) => {
    await apiRef.current.failServer(serverId);
    syncState();
  };

  const handleRecoverServer = async (serverId) => {
    await apiRef.current.recoverServer(serverId);
    syncState();
  };

  const handleUpdateWeight = (serverId, weight) => {
    engineRef.current.updateServerWeight(serverId, weight);
    syncState();
  };

  const handleClearLogs = () => {
    engineRef.current.requestLogs = [];
    syncState();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-white selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRunning={isRunning}
        onToggleRun={handleToggleRun}
        onStartDemo={() => setIsDemoOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Tab 1: Overview Landing & Live Dashboard */}
        {activeTab === 'overview' && (
          <div>
            <HeroLanding
              onStartSimulation={() => {
                setActiveTab('simulation');
                if (!isRunning) handleToggleRun();
              }}
              onViewArchitecture={() => setActiveTab('architecture')}
              onStartDemo={() => setIsDemoOpen(true)}
            />
            
            <KPICards metrics={metrics} />

            <NetworkVisualizer
              servers={servers}
              clients={clients}
              algorithm={algorithm}
              activePackets={activePackets}
              onFailServer={handleFailServer}
              onRecoverServer={handleRecoverServer}
            />

            <LoadBalancerCard
              algorithm={algorithm}
              activeConnections={servers.reduce((acc, s) => acc + s.activeConnections, 0)}
              totalRequests={metrics.totalRequests}
              servers={servers}
              recentLogs={requestLogs}
            />

            <FeaturesGrid />
          </div>
        )}

        {/* Tab 2: Simulation Core Control & Visualization */}
        {activeTab === 'simulation' && (
          <div>
            <ControlPanel
              isRunning={isRunning}
              onToggleRun={handleToggleRun}
              onReset={handleReset}
              serverCount={serverCount}
              onServerCountChange={handleServerCountChange}
              rps={rps}
              onRpsChange={handleRpsChange}
              algorithm={algorithm}
              onAlgorithmChange={handleAlgorithmChange}
              servers={servers}
              onFailServer={handleFailServer}
              onRecoverServer={handleRecoverServer}
              onStartDemo={() => setIsDemoOpen(true)}
            />

            <KPICards metrics={metrics} />

            <NetworkVisualizer
              servers={servers}
              clients={clients}
              algorithm={algorithm}
              activePackets={activePackets}
              onFailServer={handleFailServer}
              onRecoverServer={handleRecoverServer}
            />

            <ClientSimulator
              clients={clients}
              recentLogs={requestLogs}
            />

            <FaultToleranceSection
              servers={servers}
              alertLogs={alertLogs}
              onFailServer={handleFailServer}
              onRecoverServer={handleRecoverServer}
            />
          </div>
        )}

        {/* Tab 3: Server Monitoring Pool */}
        {activeTab === 'servers' && (
          <div>
            <KPICards metrics={metrics} />
            <ServerMonitoring
              servers={servers}
              onFailServer={handleFailServer}
              onRecoverServer={handleRecoverServer}
              onUpdateWeight={handleUpdateWeight}
            />
          </div>
        )}

        {/* Tab 4: Algorithms Breakdown */}
        {activeTab === 'algorithms' && (
          <div>
            <AlgorithmShowcase
              currentAlgorithm={algorithm}
              onSelectAlgorithm={handleAlgorithmChange}
              servers={servers}
            />

            <AnalyticsDashboard
              servers={servers}
              metricsHistory={metricsHistory}
              algorithmStats={algorithmStats}
              totalRequests={metrics.totalRequests}
              successfulRequests={metrics.successfulRequests}
              failedRequests={metrics.failedRequests}
            />
          </div>
        )}

        {/* Tab 5: Performance Analytics */}
        {activeTab === 'analytics' && (
          <div>
            <KPICards metrics={metrics} />
            <AnalyticsDashboard
              servers={servers}
              metricsHistory={metricsHistory}
              algorithmStats={algorithmStats}
              totalRequests={metrics.totalRequests}
              successfulRequests={metrics.successfulRequests}
              failedRequests={metrics.failedRequests}
            />
          </div>
        )}

        {/* Tab 6: Request Logs Table */}
        {activeTab === 'logs' && (
          <div>
            <RequestLogsTable
              requestLogs={requestLogs}
              onClearLogs={handleClearLogs}
            />
          </div>
        )}

        {/* Tab 7: Architecture & Tech Stack */}
        {activeTab === 'architecture' && (
          <div>
            <ArchitecturePage />
            <TechStackGrid />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            LOAD BALANCER SIMULATOR • Computer Networks Mini-Project
          </div>
          <div>
            Built with React.js, Express API Architecture &amp; HTML5 Canvas
          </div>
        </div>
      </footer>

      {/* Guided Demo Mode Modal */}
      <DemoModeModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        engine={engineRef.current}
        onSyncState={syncState}
      />

    </div>
  );
}
