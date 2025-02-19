import { AgentMethodOptions } from './agent';

/**
 * A type-safe client to call Agent methods over HTTP.
 *
 * This client validates the request payload using the provided input schema,
 * performs an HTTP POST to the Agent endpoint, and then validates the response
 * using the output schema.
 */
export class AgentClient {
  constructor(private baseUrl: string) {}

  /**
   * Calls an Agent method and returns the parsed output.
   *
   * @param methodName - The name of the Agent method (also the URL endpoint).
   * @param args - The input parameters for the method.
   * @param options - The Zod schemas for input and output validation.
   * @returns The validated response output.
   */
  async call<Input, Output>(
    methodName: string,
    args: Input,
    options: AgentMethodOptions<Input, Output>
  ): Promise<Output> {
    // Validate the input using the provided schema.
    const validatedInput = options.input.parse(args);

    const response = await fetch(`${this.baseUrl}/${methodName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedInput)
    });

    if (!response.ok) {
      throw new Error(
        `Request to ${methodName} failed: ${response.status} ${response.statusText}`
      );
    }

    const jsonResponse = await response.json();

    // Validate the output using the provided schema.
    return options.output.parse(jsonResponse);
  }
}
