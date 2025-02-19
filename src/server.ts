import express from "express";
import { z } from "zod";
import { Agent } from "./agent";

/**
 * AgentServer exposes an Agent's methods over HTTP using Express.
 */
export class AgentServer {
  private agent: Agent;
  private port: number;
  private app = express();

  constructor(agent: Agent, options: { port: number }) {
    this.agent = agent;
    this.port = options.port;
    this.app.use(express.json());
    this.registerRoutes();
  }

  private registerRoutes() {
    const methods = this.agent.getMethods();
    for (const [name, method] of Object.entries(methods)) {
      this.app.post(`/${name}`, async (req, res) => {
        try {
          // Validate input using Zod
          const parsedInput = method.options.input.parse(req.body);
          const result = await method.handler(parsedInput);
          // Validate output using Zod
          const parsedOutput = method.options.output.parse(result);
          res.json(parsedOutput);
        } catch (err) {
          res
            .status(400)
            .json({
              error: err instanceof Error ? err.message : "Unknown error",
            });
        }
      });
    }

    // Serve the OpenAPI spec at /openapi.json
    this.app.get("/openapi.json", (req, res) => {
      res.json(this.agent.generateOpenAPISpec());
    });
    
    // Add a default route for GET /
    this.app.get("/", (req, res) => {
      res.send(
        "Welcome to the Torus Agent API. Access /openapi.json for the OpenAPI spec."
      );
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.app
        .listen(this.port, () => {
          console.log(`Agent server started on port ${this.port}`);
          resolve();
        })
        .on("error", reject);
    });
  }
}
export { z };
