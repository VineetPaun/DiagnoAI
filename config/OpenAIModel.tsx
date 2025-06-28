import { AIDoctorAgents } from "@/shared/list"
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_API_KEY,
})