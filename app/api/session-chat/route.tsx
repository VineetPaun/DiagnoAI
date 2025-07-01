import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { notes, selectedDoctor } = await req.json()
    const user = await currentUser()
    try {
        const sessionId = uuidv4()
        const result = await db.insert(SessionChatTable).values({
            sessionId: sessionId,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            notes: notes,
            selectedDoctor: selectedDoctor,
            createdOn: (new Date()).toString()
            //@ts-ignore
        }).returning({ SessionChatTable })

        return NextResponse.json(result[0]?.SessionChatTable)
    }
    catch (e) {
        NextResponse.json(e)
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const sessionId = searchParams.get('sessionId')

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
        }

        console.log('Fetching session with ID:', sessionId);
        const result = await db.select().from(SessionChatTable).where(eq(SessionChatTable.sessionId, sessionId))

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('Error in GET /api/session-chat:', error);
        return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
    }
}