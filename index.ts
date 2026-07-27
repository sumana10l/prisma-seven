import { prisma } from "./db";

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    if (pathname === "/") {
      // Insert sample user
      const newUser = await prisma.user.create({
        data: {
          name: "John Doe",
          email: `john${Date.now()}@example.com`,
        },
      });

      // Fetch all users
      const users = await prisma.user.findMany();

      return Response.json({
        message: "User inserted successfully!",
        insertedUser: newUser,
        totalUsers: users.length,
        users,
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}`);