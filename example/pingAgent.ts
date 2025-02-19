import { Agent, AgentServer, z } from "../src";


// Define the output schema for the 'ping' method.
const PingResponse = z.object({
  response: z.literal("pong"),
});

// Define the output schema for the 'status' method.
const StatusOutput = z.object({
  uptime: z.number(),      // Process uptime in seconds
  timestamp: z.date(),     // Current server timestamp
  version: z.string(),     // Agent version
});

// Create a new Agent instance and register the methods.
export const pingAgent = new Agent()
  .method(
    'ping',
    {
      input: z.object({}), // No input required.
      output: PingResponse,
      description: 'Ping the agent to check connectivity',
    },
    async () => {
      return { response: 'pong' };
    }
  )
  .method(
    'status',
    {
      input: z.object({}), // No input required.
      output: StatusOutput,
      description: 'Get the current status of the agent',
    },
    async () => {
      return {
        uptime: process.uptime(),
        timestamp: new Date(),
        version: '1.0.0',
      };
    }
  );

// If this module is executed directly, start an HTTP server exposing the agent.
if (require.main === module) {
  const server = new AgentServer(pingAgent, { port: 4000 });
  server.start().then(() => {
    console.log('Ping Agent server started on port 4000');
  });
}
