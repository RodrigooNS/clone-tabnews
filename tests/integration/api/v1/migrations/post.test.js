import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("First try", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          { method: "POST" },
        );
        expect(response.status).toBe(201);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });

      test("Second try", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          { method: "POST" },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.length).toBe(0);
      });
    });
  });
});
