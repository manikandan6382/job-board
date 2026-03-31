import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })
    return NextResponse.json(job)
  } catch {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })
    if (job.userId !== (session.user as any).id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const updated = await prisma.job.update({ where: { id }, data: body })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })
    if (job.userId !== (session.user as any).id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    await prisma.job.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
