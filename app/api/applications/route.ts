import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { jobId } = await req.json()
    const userId = (session.user as any).id

    // prevent duplicate application
    const existing = await prisma.application.findFirst({
      where: { jobId, userId },
    })
    if (existing) return NextResponse.json({ error: "Already applied" }, { status: 400 })

    const application = await prisma.application.create({
      data: { jobId, userId },
    })

    return NextResponse.json(application, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const applications = await prisma.application.findMany({
      where: { userId: (session.user as any).id },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
