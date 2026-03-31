import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const where: any = {}
    if (type) where.type = type
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { title, company, location, type, salary, category, description, requirements } = body

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        category,
        description,
        requirements,
        userId: (session.user as any).id,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
