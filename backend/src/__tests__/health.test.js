const request = require("supertest");

const API = "http://localhost:4000";

describe("Health Check", () => {
  it("GET /api/health returns ok", async () => {
    const res = await request(API).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.timestamp).toBeDefined();
  });
});

describe("Projects API", () => {
  it("GET /api/projects returns array", async () => {
    const res = await request(API).get("/api/projects");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/projects/featured returns featured projects", async () => {
    const res = await request(API).get("/api/projects/featured");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/projects/:slug returns single project", async () => {
    const res = await request(API).get("/api/projects/fluxfolio");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("FluxFolio");
  });
});

describe("Profile API", () => {
  it("GET /api/profile returns profile", async () => {
    const res = await request(API).get("/api/profile");
    expect(res.status).toBe(200);
    expect(res.body.name).toBeDefined();
    expect(res.body.title).toBeDefined();
  });
});

describe("Blog API", () => {
  it("GET /api/blog returns published posts", async () => {
    const res = await request(API).get("/api/blog");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("Auth API", () => {
  it("POST /api/auth/login with valid credentials returns token", async () => {
    const res = await request(API)
      .post("/api/auth/login")
      .send({ email: "admin@fluxfolio.dev", password: "admin123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("admin@fluxfolio.dev");
  });

  it("POST /api/auth/login with invalid credentials returns 401", async () => {
    const res = await request(API)
      .post("/api/auth/login")
      .send({ email: "admin@fluxfolio.dev", password: "wrong" });
    expect(res.status).toBe(401);
  });
});
