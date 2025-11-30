import { prisma } from './lib/prisma'

// Default values
const DEFAULT_USERNAME = "guest_user"
const DEFAULT_PASSWORD = "changeme123"
const DEFAULT_NAME = "Guest"

export async function createUser(
  username: string = DEFAULT_USERNAME,
  password: string = DEFAULT_PASSWORD,
  name: string = DEFAULT_NAME
) {
  const user = await prisma.user.create({
    data: {
      username,
      password,
      name,
    },
  })
  return user
}

export async function getUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user
}
