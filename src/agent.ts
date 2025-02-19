import express from "express";
import { OpenAPIV3 } from "openapi-types";
import { z, ZodSchema } from "zod";

export interface AgentMethodOptions<Input, Output> {
  input: ZodSchema<Input>;
  output: ZodSchema<Output>;
  description?: string;
}

export interface AgentMethod<Input = any, Output = any> {
  name: string;
  options: AgentMethodOptions<Input, Output>;
  handler: (args: Input) => Promise<Output> | Output;
}

/**
 * Base Agent class with a fluent API for method registration.
 */
export class Agent {
  private methods: Record<string, AgentMethod> = {};

  /**
   * Registers a new method on the Agent.
   */
  method<Input, Output>(
    name: string,
    options: AgentMethodOptions<Input, Output>,
    handler: (args: Input) => Promise<Output> | Output
  ): this {
    if (this.methods[name]) {
      throw new Error(`Method "${name}" is already defined.`);
    }
    this.methods[name] = { name, options, handler };
    return this;
  }

  getMethods(): Record<string, AgentMethod> {
    return this.methods;
  }

  /**
   * Generate a basic OpenAPI spec from the metadata.
   */
  generateOpenAPISpec(): OpenAPIV3.Document {
    const paths: OpenAPIV3.PathsObject = {};
    for (const name in this.methods) {
      const meta = this.methods[name];
      const path = `/${name}`;
      paths[path] = {
        post: {
          summary: meta.options.description || "",
          operationId: name,
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      };
    }

    return {
      openapi: "3.0.0",
      info: {
        title: "Torus Agent API",
        version: "0.1.0",
      },
      paths,
    };
  }
}