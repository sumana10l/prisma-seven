import express, { Request, Response } from 'express'
import { prisma } from './lib/prisma'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

app.use(express.json())

function toId(param: string | string[] | undefined): number | null {
  const value = Array.isArray(param) ? param[0] : param
  if (value === undefined) return null
  const id = Number(value)
  return Number.isInteger(id) ? id : null
}

app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { travelPlans: true },
  })
  res.json(users)
})

app.get('/users/:id', async (req, res) => {
  const id = toId(req.params.id)
  if (id === null) {
    res.status(400).json({ error: 'Invalid user id' })
    return
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { travelPlans: true },
  })

  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json(user)
})

app.post('/users', async (req, res) => {
  const { name, email, travelPlans } = req.body

  if (!email) {
    res.status(400).json({ error: 'email is required' })
    return
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      ...(travelPlans ? { travelPlans: { create: travelPlans } } : {}),
    },
    include: { travelPlans: true },
  })

  res.status(201).json(user)
})

app.put('/users/:id', async (req, res) => {
  const id = toId(req.params.id)
  if (id === null) {
    res.status(400).json({ error: 'Invalid user id' })
    return
  }

  const { name, email } = req.body

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
      include: { travelPlans: true },
    })
    res.json(user)
  } catch {
    res.status(404).json({ error: 'User not found' })
  }
})

app.delete('/users/:id', async (req, res) => {
  const id = toId(req.params.id)
  if (id === null) {
    res.status(400).json({ error: 'Invalid user id' })
    return
  }

  try {
    await prisma.user.delete({ where: { id } })
    res.status(204).send()
  } catch {
    res.status(404).json({ error: 'User not found' })
  }
})


app.get('/travel-plans', async (_req, res) => {
  const travelPlans = await prisma.travelPlan.findMany({
    include: { user: true },
  })
  res.json(travelPlans)
})

app.get('/users/:userId/travel-plans', async (req, res) => {
  const userId = toId(req.params.userId)
  if (userId === null) {
    res.status(400).json({ error: 'Invalid user id' })
    return
  }

  const travelPlans = await prisma.travelPlan.findMany({
    where: { userId },
  })
  res.json(travelPlans)
})

app.get('/travel-plans/:id', async (req, res) => {
  const id = toId(req.params.id)
  if (id === null) {
    res.status(400).json({ error: 'Invalid travel plan id' })
    return
  }

  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!travelPlan) {
    res.status(404).json({ error: 'Travel plan not found' })
    return
  }

  res.json(travelPlan)
})

app.post('/travel-plans', async (req, res) => {
  const {
    userId,
    title,
    destinationCity,
    destinationCountry,
    startDate,
    endDate,
    budget,
  } = req.body

  if (
    !userId ||
    !title ||
    !destinationCity ||
    !destinationCountry ||
    !startDate ||
    !endDate
  ) {
    res.status(400).json({
      error:
        'userId, title, destinationCity, destinationCountry, startDate, and endDate are required',
    })
    return
  }

  try {
    const travelPlan = await prisma.travelPlan.create({
      data: {
        title,
        destinationCity,
        destinationCountry,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget,
        user: { connect: { id: Number(userId) } },
      },
    })
    res.status(201).json(travelPlan)
  } catch {
    res.status(400).json({ error: 'Could not create travel plan (check userId)' })
  }
})

app.put('/travel-plans/:id', async (req, res) => {
  const id = toId(req.params.id)
  if (id === null) {
    res.status(400).json({ error: 'Invalid travel plan id' })
    return
  }

  const {
    title,
    destinationCity,
    destinationCountry,
    startDate,
    endDate,
    budget,
  } = req.body

  try {
    const travelPlan = await prisma.travelPlan.update({
      where: { id },
      data: {
        title,
        destinationCity,
        destinationCountry,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget,
      },
    })
    res.json(travelPlan)
  } catch {
    res.status(404).json({ error: 'Travel plan not found' })
  }
})

app.delete('/travel-plans/:id', async (req, res) => {
  const id = toId(req.params.id)
  if (id === null) {
    res.status(400).json({ error: 'Invalid travel plan id' })
    return
  }

  try {
    await prisma.travelPlan.delete({ where: { id } })
    res.status(204).send()
  } catch {
    res.status(404).json({ error: 'Travel plan not found' })
  }
})

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
})