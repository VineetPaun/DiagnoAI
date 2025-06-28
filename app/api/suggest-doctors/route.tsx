import { AIDoctorAgents } from "@/shared/list"
import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/config/OpenAIModel"

export async function POST(req: NextRequest) {
    const {notes} = await req.json()
    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-preview-05-20",
            messages: [
                {role: 'system', content: JSON.stringify(AIDoctorAgents)},
                { role: "user", content: "User Notes/Symptoms:" + notes + "Depends on user notes and symptoms, Please suggest list of doctors, Return objects in JSON only"}
            ],
        })
        const rawResp = completion.choices[0].message
        //@ts-ignore
        const resp = rawResp.content.trim().replace('```json','').replace('```','')
        return NextResponse.json(JSON.parse(resp))
    } catch (error) {
        return NextResponse.json(error)
    }
}