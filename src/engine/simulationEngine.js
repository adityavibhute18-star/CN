/**
 * Load Balancer Simulation Engine
 * Dynamic Request Distribution, Algorithmic Routing & Server Fault Tolerance
 */

export const ALGORITHMS = {
  ROUND_ROBIN: 'round_robin',
  LEAST_CONNECTIONS: 'least_connections',
  WEIGHTED_ROUND_ROBIN: 'weighted_round_robin'
};

export const ALGORITHM_NAMES = {
  [ALGORITHMS.ROUND_ROBIN]: 'Round Robin',
  [ALGORITHMS.LEAST_CONNECTIONS]: 'Least Connections',
  [ALGORITHMS.WEIGHTED_ROUND_ROBIN]: 'Weighted Round Robin'
};

// Initial state generators
export const createInitialServers = (count = 3) => {
  const defaultWeights = [5, 3, 2, 4, 3, 2, 5, 4, 3, 2];
  const servers = [];
  
  for (let i = 1; i <= count; i++) {
    const id = `S${i.toString().padStart(2, '0')}`;
    servers.push({
      id,
      name: `Server ${id}`,
      ip: `192.168.1.${10 + i}`,
      status: 'ONLINE', // 'ONLINE' | 'OFFLINE'
      weight: defaultWeights[(i - 1) % defaultWeights.length],
      currentWeight: 0,
      activeConnections: 0,
      requestsProcessed: 0,
      successfulRequests: 0,
      failedRequests: 0,
      capacity: 100, // Max simultaneous connections capacity
      cpuLoad: Math.floor(20 + Math.random() * 25), // 0-100%
      baseLatency: 40 + (i * 15), // Base ms latency
      avgResponseTime: 40 + (i * 15),
      totalLatencySum: 0
    });
  }
  return servers;
};

export const createInitialClients = (count = 8) => {
  const clients = [];
  const locations = ['US-East', 'US-West', 'EU-Central', 'AP-South', 'SA-East', 'EU-West', 'AP-East', 'AU-Southeast'];
  for (let i = 1; i <= count; i++) {
    const id = `C${i.toString().padStart(3, '0')}`;
    clients.push({
      id,
      name: `Client ${id}`,
      ip: `10.0.${Math.floor(i / 2)}.${(i * 17) % 250}`,
      location: locations[(i - 1) % locations.length],
      requestsSent: 0,
      activeRequests: 0,
      status: 'IDLE' // 'IDLE' | 'SENDING'
    });
  }
  return clients;
};

export class SimulationEngine {
  constructor() {
    this.reset();
  }

  reset(serverCount = 3) {
    this.isRunning = false;
    this.servers = createInitialServers(serverCount);
    this.clients = createInitialClients(8);
    this.algorithm = ALGORITHMS.ROUND_ROBIN;
    this.requestsPerSecond = 10;
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.rrPointer = 0;
    
    this.requestLogs = [];
    this.activePackets = []; // For 2D network animation
    this.metricsHistory = []; // Timeline history for charts
    this.alertLogs = []; // Fault tolerance alert events
    this.reqIdCounter = 1;

    // Per-algorithm comparative tracking
    this.algorithmStats = {
      [ALGORITHMS.ROUND_ROBIN]: { total: 0, success: 0, totalTime: 0, avgTime: 124, throughput: 85, utilization: 68 },
      [ALGORITHMS.LEAST_CONNECTIONS]: { total: 0, success: 0, totalTime: 0, avgTime: 108, throughput: 92, utilization: 74 },
      [ALGORITHMS.WEIGHTED_ROUND_ROBIN]: { total: 0, success: 0, totalTime: 0, avgTime: 112, throughput: 89, utilization: 71 }
    };

    this.addAlert('System initialized with ' + serverCount + ' servers.', 'INFO');
  }

  setServerCount(count) {
    if (count < 2 || count > 10) return;
    const currentCount = this.servers.length;
    if (count > currentCount) {
      // Add new servers
      for (let i = currentCount + 1; i <= count; i++) {
        const id = `S${i.toString().padStart(2, '0')}`;
        this.servers.push({
          id,
          name: `Server ${id}`,
          ip: `192.168.1.${10 + i}`,
          status: 'ONLINE',
          weight: Math.floor(2 + Math.random() * 4),
          currentWeight: 0,
          activeConnections: 0,
          requestsProcessed: 0,
          successfulRequests: 0,
          failedRequests: 0,
          capacity: 100,
          cpuLoad: 25,
          baseLatency: 45 + Math.floor(Math.random() * 30),
          avgResponseTime: 65,
          totalLatencySum: 0
        });
      }
      this.addAlert(`Scaled server pool UP to ${count} servers.`, 'INFO');
    } else if (count < currentCount) {
      // Remove servers from end
      const removed = this.servers.slice(count);
      this.servers = this.servers.slice(0, count);
      this.addAlert(`Scaled server pool DOWN to ${count} servers.`, 'WARNING');
    }
  }

  setRequestsPerSecond(speed) {
    this.requestsPerSecond = Math.max(1, Math.min(50, speed));
  }

  setAlgorithm(algo) {
    if (Object.values(ALGORITHMS).includes(algo)) {
      this.algorithm = algo;
      this.addAlert(`Load Balancer algorithm switched to ${ALGORITHM_NAMES[algo]}.`, 'INFO');
    }
  }

  addAlert(message, type = 'INFO') {
    const time = new Date().toLocaleTimeString();
    this.alertLogs.unshift({
      id: Date.now() + Math.random(),
      timestamp: time,
      message,
      type // 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS'
    });
    if (this.alertLogs.length > 50) this.alertLogs.pop();
  }

  failServer(serverId) {
    const server = this.servers.find(s => s.id === serverId);
    if (server && server.status === 'ONLINE') {
      server.status = 'OFFLINE';
      server.activeConnections = 0;
      server.cpuLoad = 0;
      this.addAlert(`🚨 FAULT DETECTED: Server ${server.id} crashed / OFFLINE. Traffic auto-rerouted.`, 'DANGER');
      return true;
    }
    return false;
  }

  recoverServer(serverId) {
    const server = this.servers.find(s => s.id === serverId);
    if (server && server.status === 'OFFLINE') {
      server.status = 'ONLINE';
      server.cpuLoad = 20;
      server.currentWeight = 0;
      this.addAlert(`✅ HEALTH RECOVERED: Server ${server.id} re-joined active server pool.`, 'SUCCESS');
      return true;
    }
    return false;
  }

  updateServerWeight(serverId, newWeight) {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.weight = Math.max(1, Math.min(10, newWeight));
    }
  }

  /**
   * Core Load Balancing Selection Algorithms
   */
  selectServer() {
    const healthyServers = this.servers.filter(s => s.status === 'ONLINE');
    if (healthyServers.length === 0) return null;

    if (this.algorithm === ALGORITHMS.ROUND_ROBIN) {
      return this.selectRoundRobin(healthyServers);
    } else if (this.algorithm === ALGORITHMS.LEAST_CONNECTIONS) {
      return this.selectLeastConnections(healthyServers);
    } else if (this.algorithm === ALGORITHMS.WEIGHTED_ROUND_ROBIN) {
      return this.selectWeightedRoundRobin(healthyServers);
    }
    return healthyServers[0];
  }

  selectRoundRobin(healthyServers) {
    // Find next healthy server sequentially starting from rrPointer
    let attempts = 0;
    let selected = null;
    
    while (attempts < this.servers.length) {
      const targetIndex = this.rrPointer % this.servers.length;
      const candidate = this.servers[targetIndex];
      this.rrPointer = (this.rrPointer + 1) % this.servers.length;
      attempts++;
      
      if (candidate.status === 'ONLINE') {
        selected = candidate;
        break;
      }
    }
    
    return selected || healthyServers[0];
  }

  selectLeastConnections(healthyServers) {
    // Select healthy server with minimum activeConnections
    let minConns = Infinity;
    let candidates = [];
    
    for (const server of healthyServers) {
      if (server.activeConnections < minConns) {
        minConns = server.activeConnections;
        candidates = [server];
      } else if (server.activeConnections === minConns) {
        candidates.push(server);
      }
    }
    
    // Break ties with CPU load
    candidates.sort((a, b) => a.cpuLoad - b.cpuLoad);
    return candidates[0];
  }

  selectWeightedRoundRobin(healthyServers) {
    // Nginx Smooth Weighted Round Robin Algorithm
    let totalWeight = 0;
    let maxWeightServer = null;

    for (const server of healthyServers) {
      server.currentWeight = (server.currentWeight || 0) + server.weight;
      totalWeight += server.weight;

      if (!maxWeightServer || server.currentWeight > maxWeightServer.currentWeight) {
        maxWeightServer = server;
      }
    }

    if (maxWeightServer) {
      maxWeightServer.currentWeight -= totalWeight;
      return maxWeightServer;
    }
    return healthyServers[0];
  }

  /**
   * Dispatch a single simulated request
   */
  generateRequest() {
    const reqNum = this.reqIdCounter++;
    const reqId = `R${reqNum.toString().padStart(4, '0')}`;
    
    // Random client selection
    const client = this.clients[Math.floor(Math.random() * this.clients.length)];
    client.requestsSent++;
    client.status = 'SENDING';
    setTimeout(() => { client.status = 'IDLE'; }, 300);

    const timestamp = new Date().toLocaleTimeString();
    const startTime = performance.now();

    this.totalRequests++;

    // Load Balancer selects server
    const selectedServer = this.selectServer();

    if (!selectedServer) {
      // All servers down! Request fails
      this.failedRequests++;
      const logEntry = {
        id: reqId,
        clientId: client.id,
        clientName: client.name,
        algorithm: ALGORITHM_NAMES[this.algorithm],
        serverId: 'NONE',
        serverName: 'N/A (All Servers Offline)',
        responseTime: 0,
        status: 'FAILED',
        timestamp
      };
      this.requestLogs.unshift(logEntry);
      if (this.requestLogs.length > 300) this.requestLogs.pop();
      return { status: 'FAILED', serverId: null, packet: null };
    }

    // Increment active connections
    selectedServer.activeConnections++;
    selectedServer.requestsProcessed++;
    
    // Dynamically calculate CPU load & latency based on active connections
    const loadFactor = Math.min(1.0, selectedServer.activeConnections / 15);
    selectedServer.cpuLoad = Math.min(99, Math.round(20 + (loadFactor * 65) + (Math.random() * 10)));
    
    // Simulate latency jitter (50ms - 200ms)
    const simulatedLatency = Math.round(selectedServer.baseLatency + (loadFactor * 60) + (Math.random() * 25));

    // Create animated packet object for Visualizer
    const packet = {
      id: reqId,
      clientId: client.id,
      serverId: selectedServer.id,
      progress: 0, // 0 to 1
      speed: 0.04 + (Math.random() * 0.02),
      status: 'IN_FLIGHT', // 'IN_FLIGHT' | 'PROCESSED'
      simulatedLatency
    };
    this.activePackets.push(packet);

    // Schedule request completion simulation
    setTimeout(() => {
      // Check if server is still online when request finishes
      const isSuccess = selectedServer.status === 'ONLINE';
      
      selectedServer.activeConnections = Math.max(0, selectedServer.activeConnections - 1);
      
      if (isSuccess) {
        this.successfulRequests++;
        selectedServer.successfulRequests++;
        selectedServer.totalLatencySum += simulatedLatency;
        selectedServer.avgResponseTime = Math.round(selectedServer.totalLatencySum / selectedServer.successfulRequests);
      } else {
        this.failedRequests++;
        selectedServer.failedRequests++;
      }

      // Update per-algorithm comparative statistics
      const algoStat = this.algorithmStats[this.algorithm];
      if (algoStat) {
        algoStat.total++;
        if (isSuccess) {
          algoStat.success++;
          algoStat.totalTime += simulatedLatency;
          algoStat.avgTime = Math.round(algoStat.totalTime / algoStat.success);
        }
        algoStat.throughput = Math.round(this.requestsPerSecond * (algoStat.success / (algoStat.total || 1)));
        algoStat.utilization = Math.round(
          this.servers.reduce((acc, s) => acc + s.cpuLoad, 0) / (this.servers.length || 1)
        );
      }

      const logEntry = {
        id: reqId,
        clientId: client.id,
        clientName: client.name,
        algorithm: ALGORITHM_NAMES[this.algorithm],
        serverId: selectedServer.id,
        serverName: selectedServer.name,
        responseTime: simulatedLatency,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        timestamp
      };

      this.requestLogs.unshift(logEntry);
      if (this.requestLogs.length > 300) this.requestLogs.pop();

    }, simulatedLatency * 4); // Scaled visual time

    return { status: 'ROUTED', serverId: selectedServer.id, packet };
  }

  /**
   * Main simulation tick cycle (called periodically)
   */
  tick() {
    if (!this.isRunning) return;

    // Decay CPU load gradually if connections drop
    for (const server of this.servers) {
      if (server.status === 'ONLINE') {
        if (server.activeConnections === 0 && server.cpuLoad > 15) {
          server.cpuLoad = Math.max(15, server.cpuLoad - 3);
        }
      } else {
        server.cpuLoad = 0;
        server.activeConnections = 0;
      }
    }

    // Record timeline metric data point for charts
    const nowStr = new Date().toLocaleTimeString();
    const avgResponseTime = this.calculateAverageResponseTime();
    const avgUtilization = this.calculateAverageUtilization();

    const metricPoint = {
      timestamp: nowStr,
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      avgResponseTime,
      throughput: Math.round(this.requestsPerSecond * (this.successfulRequests / (this.totalRequests || 1))),
      serverUtilization: avgUtilization
    };

    this.metricsHistory.push(metricPoint);
    if (this.metricsHistory.length > 25) this.metricsHistory.shift();
  }

  calculateAverageResponseTime() {
    const onlineServers = this.servers.filter(s => s.successfulRequests > 0);
    if (onlineServers.length === 0) return 120;
    const totalAvg = onlineServers.reduce((sum, s) => sum + s.avgResponseTime, 0);
    return Math.round(totalAvg / onlineServers.length);
  }

  calculateAverageUtilization() {
    if (this.servers.length === 0) return 0;
    const sum = this.servers.reduce((acc, s) => acc + (s.status === 'ONLINE' ? s.cpuLoad : 0), 0);
    return Math.round(sum / this.servers.length);
  }

  getDashboardMetrics() {
    const avgResponseTime = this.calculateAverageResponseTime();
    const serverUtilization = this.calculateAverageUtilization();
    const throughput = this.isRunning
      ? Math.round(this.requestsPerSecond * (this.successfulRequests / (this.totalRequests || 1)))
      : 0;

    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      avgResponseTime,
      throughput,
      serverUtilization
    };
  }
}
