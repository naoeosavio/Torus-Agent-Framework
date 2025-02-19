# Torus Agent Framework

This repository provides a framework for building Torus Agents with self-describing APIs, substrate wallet authentication, rate limiting, and payment functionalities.

## Features

- **Base Agent Class:** Define API methods with decorators.
- **OpenAPI Spec Generation:** Automatically generate a basic OpenAPI specification.
- **API Documentation Serving:** An Express server serves the OpenAPI docs.
- **Substrate Authentication:** Stub for substrate wallet–based authentication.
- **Type-safe Client:** Client implementation for invoking agent methods.
- **Payments:** Stubbed payment processing functionality.
- **Newtype/Branded Types:** For token amounts, file hashes, and transaction IDs.
- **Unit Tests:** In-source tests using Vitest.
- **Linting/Formatting:** Configured with Biome.

## Getting Started

1. **Install dependencies:**
    ```bash
    npm install
    ```

2. **Build the project:**
    ```bash
    npm run build
    ```

3. **Run tests:**
    ```bash
    npm run test
    ```

4. **Start the server (example usage):**
    ```bash
    node dist/server.js
    ```

## Example Client Usage

See the file [example/client-example.ts](example/client-example.ts) for an example of how to call an Agent API from a client.
