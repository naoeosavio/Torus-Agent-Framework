import { Agent } from './agent';

/**
 * Type-safe client to call methods on an Agent.
 */
export class AgentClient<T extends Agent> {
  private agentInstance: T;

  constructor(agentInstance: T) {
    this.agentInstance = agentInstance;
  }

  /**
   * Call an agent method by name.
   */
  async call<K extends keyof T>(method: K, ...args: any[]): Promise<any> {
    if (typeof this.agentInstance[method] === 'function') {
      return await (this.agentInstance[method] as any)(...args);
    }
    throw new Error(`Method ${String(method)} not found on agent`);
  }
}
