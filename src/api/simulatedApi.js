/**
 * Simulated Express.js / REST API Backend Layer
 * Implements standard network endpoints for mini-project presentation & evaluation
 */

export class SimulatedApi {
  constructor(engine) {
    this.engine = engine;
  }

  // Helper to simulate asynchronous HTTP response delay
  async _response(data, status = 200, delay = 15) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status,
          ok: status >= 200 && status < 300,
          data
        });
      }, delay);
    });
  }

  // POST /simulation/start
  async startSimulation() {
    this.engine.isRunning = true;
    this.engine.addAlert('API: Received POST /simulation/start -> Engine STARTED.', 'INFO');
    return this._response({ message: 'Simulation started successfully', isRunning: true });
  }

  // POST /simulation/stop
  async stopSimulation() {
    this.engine.isRunning = false;
    this.engine.addAlert('API: Received POST /simulation/stop -> Engine PAUSED.', 'WARNING');
    return this._response({ message: 'Simulation paused', isRunning: false });
  }

  // POST /simulation/reset
  async resetSimulation(serverCount = 3) {
    this.engine.reset(serverCount);
    this.engine.addAlert('API: Received POST /simulation/reset -> System state reset.', 'INFO');
    return this._response({ message: 'Simulation reset complete', serverCount });
  }

  // POST /server/fail
  async failServer(serverId) {
    const success = this.engine.failServer(serverId);
    if (success) {
      return this._response({ message: `Server ${serverId} failed`, serverId, status: 'OFFLINE' });
    }
    return this._response({ error: `Server ${serverId} not found or already offline` }, 400);
  }

  // POST /server/recover
  async recoverServer(serverId) {
    const success = this.engine.recoverServer(serverId);
    if (success) {
      return this._response({ message: `Server ${serverId} recovered`, serverId, status: 'ONLINE' });
    }
    return this._response({ error: `Server ${serverId} not found or already online` }, 400);
  }

  // GET /servers
  async getServers() {
    return this._response({
      count: this.engine.servers.length,
      servers: this.engine.servers
    });
  }

  // GET /metrics
  async getMetrics() {
    return this._response({
      dashboard: this.engine.getDashboardMetrics(),
      algorithm: this.engine.algorithm,
      algorithmStats: this.engine.algorithmStats,
      history: this.engine.metricsHistory
    });
  }

  // GET /requests
  async getRequests(limit = 50) {
    return this._response({
      total: this.engine.requestLogs.length,
      requests: this.engine.requestLogs.slice(0, limit)
    });
  }

  // POST /algorithm
  async setAlgorithm(algorithm) {
    this.engine.setAlgorithm(algorithm);
    return this._response({
      message: 'Algorithm updated',
      algorithm: this.engine.algorithm
    });
  }
}
