const http = require("http");

const BASE = "http://localhost:4000";

function fetch(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const opts = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { "Content-Type": "application/json" },
    };
    const req = http.request(opts, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data || "null") });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

async function run() {
  console.log("\n🧪 FluxFolio API Tests\n");

  // Health
  await test("GET /api/health returns ok", async () => {
    const r = await fetch("GET", "/api/health");
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
    if (r.body.status !== "ok") throw new Error("Status not ok");
  });

  // Projects
  await test("GET /api/projects returns array", async () => {
    const r = await fetch("GET", "/api/projects");
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
    if (!Array.isArray(r.body)) throw new Error("Not an array");
  });

  await test("GET /api/projects/featured returns featured", async () => {
    const r = await fetch("GET", "/api/projects/featured");
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
    if (!Array.isArray(r.body)) throw new Error("Not an array");
  });

  await test("GET /api/projects/fluxfolio returns project", async () => {
    const r = await fetch("GET", "/api/projects/fluxfolio");
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
    if (r.body.title !== "FluxFolio") throw new Error("Wrong title");
  });

  // Profile
  await test("GET /api/profile returns profile", async () => {
    const r = await fetch("GET", "/api/profile");
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
    if (!r.body.name) throw new Error("No name");
  });

  // Blog
  await test("GET /api/blog returns posts", async () => {
    const r = await fetch("GET", "/api/blog");
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
    if (!Array.isArray(r.body)) throw new Error("Not an array");
  });

  // Auth
  await test("POST /api/auth/login with valid credentials", async () => {
    const r = await fetch("POST", "/api/auth/login", {
      email: "admin@fluxfolio.dev",
      password: "admin123",
    });
    if (r.status !== 200) throw new Error(`Expected 200, got ${r.status}`);
    if (!r.body.token) throw new Error("No token");
  });

  await test("POST /api/auth/login with invalid credentials", async () => {
    const r = await fetch("POST", "/api/auth/login", {
      email: "admin@fluxfolio.dev",
      password: "wrong",
    });
    if (r.status !== 401) throw new Error(`Expected 401, got ${r.status}`);
  });

  // Contact
  await test("POST /api/contact submits message", async () => {
    const r = await fetch("POST", "/api/contact", {
      name: "Test",
      email: "test@test.com",
      message: "Test message",
    });
    if (r.status !== 201) throw new Error(`Expected 201, got ${r.status}`);
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error("❌ Tests failed to run:", e.message);
  process.exit(1);
});
