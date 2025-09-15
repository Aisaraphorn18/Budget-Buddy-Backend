/**
 * Simple Test to verify Bun test setup
 */

import { describe, it, expect } from "bun:test";

describe("Budget Buddy Backend Test Setup", () => {
  it("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle async operations", async () => {
    const result = await Promise.resolve("test");
    expect(result).toBe("test");
  });

  it("should verify test environment", () => {
    expect(typeof describe).toBe("function");
    expect(typeof it).toBe("function");  
    expect(typeof expect).toBe("function");
  });
});