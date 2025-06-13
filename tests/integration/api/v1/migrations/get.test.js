import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations (dryrun)", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});

describe("PATCH, PUT, DELETE /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Methods not allowed", async () => {
      const patchTest = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "PATCH",
      });
      expect(patchTest.status).toBe(405);
      const putTest = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "PUT",
      });
      expect(putTest.status).toBe(405);
      const deleteTest = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "DELETE",
        },
      );
      expect(deleteTest.status).toBe(405);
    });
  });
});
