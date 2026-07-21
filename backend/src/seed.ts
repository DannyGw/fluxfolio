import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Profile (only if none exists)
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: "Your Name",
        title: "Full Stack Developer",
        bio: `Hi! I'm a passionate full-stack developer who loves building clean, modern web applications.

I specialize in **React, Node.js, and TypeScript**, and I'm always exploring new technologies to solve interesting problems.

When I'm not coding, you'll find me [insert hobby here] or [insert another hobby here].`,
        email: "hello@yourname.dev",
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        twitter: "https://twitter.com/yourusername",
        website: "https://yourname.dev",
        skills: [
          "TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "Express",
          "PostgreSQL",
          "Prisma",
          "Tailwind CSS",
          "Docker",
          "Git",
        ],
      },
    });
  } else {
    console.log("  - Profile already exists, skipping");
  }

  // Seed Projects
  const projects = [
    {
      title: "FluxFolio",
      slug: "fluxfolio",
      description:
        "A modern, minimal portfolio builder with a bento-grid layout. Built to showcase projects with style.",
      content: `## About FluxFolio

FluxFolio is a personal portfolio site built from scratch to demonstrate full-stack development skills.

### Features
- Bento-grid layout for project showcase
- Markdown-powered project pages
- Dynamic content via REST API
- Responsive design with Tailwind CSS
- PostgreSQL database with Prisma ORM

### What I Learned
This project taught me the full workflow of building a modern web app — from database design to deployment.`,
      techStack: ["Next.js", "Express", "PostgreSQL", "Prisma", "Tailwind CSS"],
      imageUrl: "https://placehold.co/800x600/1a1a2e/eaeaea?text=FluxFolio",
      liveUrl: "https://fluxfolio.vercel.app",
      repoUrl: "https://github.com/yourusername/fluxfolio",
      featured: true,
      order: 1,
    },
    {
      title: "Task Manager",
      slug: "task-manager",
      description:
        "A Kanban-style task management app with drag-and-drop, real-time updates, and team collaboration.",
      content: `## Task Manager

A full-featured project management tool inspired by Trello and Notion.

### Features
- Drag-and-drop Kanban board
- Task assignment and comments
- Real-time updates
- Team workspaces`,
      techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Tailwind CSS"],
      imageUrl: "https://placehold.co/800x600/16213e/eaeaea?text=Task+Manager",
      liveUrl: null,
      repoUrl: "https://github.com/yourusername/task-manager",
      featured: true,
      order: 2,
    },
    {
      title: "Weather Dashboard",
      slug: "weather-dashboard",
      description:
        "Beautiful weather dashboard with 7-day forecasts, interactive charts, and location-based data.",
      content: `## Weather Dashboard

A clean weather dashboard that pulls data from OpenWeatherMap API.

### Features
- 7-day forecast
- Interactive charts
- Geolocation support
- Multiple city saving`,
      techStack: ["React", "TypeScript", "Chart.js", "OpenWeatherMap API"],
      imageUrl: "https://placehold.co/800x600/0f3460/eaeaea?text=Weather+App",
      liveUrl: "https://weather-dashboard.vercel.app",
      repoUrl: "https://github.com/yourusername/weather-dashboard",
      featured: false,
      order: 3,
    },
    {
      title: "E-Commerce API",
      slug: "ecommerce-api",
      description:
        "RESTful API for an e-commerce platform with authentication, products, orders, and payments.",
      content: `## E-Commerce API

A robust backend API built for e-commerce applications.

### Features
- JWT authentication
- Product CRUD with categories
- Order management
- Stripe payment integration
- Rate limiting & security`,
      techStack: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "Stripe"],
      imageUrl: "https://placehold.co/800x600/533483/eaeaea?text=E-Commerce+API",
      liveUrl: null,
      repoUrl: "https://github.com/yourusername/ecommerce-api",
      featured: false,
      order: 4,
    },
  ];

  for (const project of projects) {
    const { slug, ...projectData } = project;
    await prisma.project.upsert({
      where: { slug },
      update: projectData,
      create: project,
    });
  }
  console.log(`  - ${projects.length} projects synced`);

  // Seed Admin User (upsert by email)
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@fluxfolio.dev" },
    update: { name: "Admin" }, // Don't reset password on re-deploy
    create: {
      email: "admin@fluxfolio.dev",
      password: hashedPassword,
      name: "Admin",
    },
  });
  console.log("  - Admin user synced (admin@fluxfolio.dev / admin123)");

  // Seed Blog Posts
  const blogPosts = [
    {
      title: "Building FluxFolio: A Full-Stack Journey",
      slug: "building-fluxfolio",
      excerpt:
        "A deep dive into how I built this portfolio site from scratch using Next.js, Express, and PostgreSQL.",
      content: `## The Beginning

I wanted a portfolio that was more than just a template. I wanted something **mine** — built from the ground up.

### Tech Stack
- **Frontend**: Next.js 16 with App Router and Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker Compose for local dev

### Key Learnings
1. The App Router in Next.js makes file-based routing incredibly intuitive
2. Prisma migrations are a game-changer for schema management
3. Tailwind's utility-first approach speeds up UI iteration significantly

### What's Next
I'm planning to add more features like a blog, dark mode (already done!), and authentication.`,
      tags: ["Next.js", "Express", "TypeScript", "Full Stack"],
      published: true,
    },
    {
      title: "Why I Love TypeScript for Backend Development",
      slug: "why-typescript-backend",
      excerpt:
        "Type safety, better tooling, and fewer runtime errors. Here's why TypeScript is my go-to for backend projects.",
      content: `## Type Safety Matters

After years of writing JavaScript, switching to TypeScript felt like putting on glasses for the first time.

### The Benefits
1. **Catch errors at compile time** — No more "cannot read property of undefined"
2. **Better IDE support** — Autocomplete, refactoring, and inline docs
3. **Self-documenting code** — Types serve as living documentation`,
      tags: ["TypeScript", "Node.js", "Backend"],
      published: true,
    },
    {
      title: "Getting Started with Docker for Development",
      slug: "docker-dev-setup",
      excerpt:
        "How I use Docker to simplify my development environment and avoid 'it works on my machine' problems.",
      content: `## Why Docker?

Docker eliminates environment inconsistencies. With Docker Compose, I can spin up my entire stack with one command.

### My Setup
- PostgreSQL database container
- pgAdmin for database management
- Easy to tear down and reset`,
      tags: ["Docker", "DevOps", "PostgreSQL"],
      published: true,
    },
  ];

  for (const post of blogPosts) {
    const { slug, ...postData } = post;
    await prisma.blogPost.upsert({
      where: { slug },
      update: postData,
      create: post,
    });
  }
  console.log(`  - ${blogPosts.length} blog posts synced`);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
