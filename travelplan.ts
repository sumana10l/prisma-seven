import { prisma } from './lib/prisma'

// Default values
const DEFAULT_TITLE = "New Trip"
const DEFAULT_CITY = "Unknown City"
const DEFAULT_COUNTRY = "Unknown Country"
const DEFAULT_BUDGET = 0

export async function createTravelPlan(
  userId: number,
  title: string = DEFAULT_TITLE,
  destinationCity: string = DEFAULT_CITY,
  destinationCountry: string = DEFAULT_COUNTRY,
  startDate: string,
  endDate: string,
  budget: number = DEFAULT_BUDGET
) {
  const travelPlan = await prisma.travelPlan.create({
    data: {
      userId,
      title,
      destinationCity,
      destinationCountry,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget,
    },
  })
  return travelPlan
}

export async function updateTravelPlan(
  planId: number,
  title?: string,
  budget?: number
) {
  const updatedTravelPlan = await prisma.travelPlan.update({
    where: {
      id: planId,
    },
    data: {
      ...(title && { title }),
      ...(budget !== undefined && { budget }),
    },
  })
  return updatedTravelPlan
}

export async function getTravelPlans(userId: number) {
  const travelPlans = await prisma.travelPlan.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      destinationCity: true,
      destinationCountry: true,
      startDate: true,
      endDate: true,
      budget: true,
    },
  })
  return travelPlans
}
