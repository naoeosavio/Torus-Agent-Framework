import { describe, it, expect } from "vitest";
import { pingAgent } from "../example/pingAgent";

describe("Ping Agent", () => {
  it("should return ping", async () => {
    const method = pingAgent.getMethods()["ping"];
    if (!method) throw new Error("Method ping not found");
    const result = await method.handler({});
    expect(result).toHaveProperty("response");
  });
  it("should return status", async () => {
    const method = pingAgent.getMethods()["status"];
    if (!method) throw new Error("Method status not found");
    const result = await method.handler({});
    expect(result).toHaveProperty("uptime");
    expect(result).toHaveProperty("timestamp");
    expect(result).toHaveProperty("version");
  });
});

