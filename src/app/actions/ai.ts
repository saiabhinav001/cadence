"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generatePerformanceReview(entries: any[], timeframe: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set")
    }

    // Debug logging
    console.log("AI Action: Key verified. Length:", process.env.GEMINI_API_KEY?.length);

    // Instantiate inside the function to ensure env vars are ready
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    // User requested specific model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

    // ... rest of logic

    // Format entries for the prompt
    const entriesText = entries.map(e =>
        `- [${e.date.split('T')[0]}] ${e.title} (Impact: ${e.impact}, Mood: ${e.mood}): ${e.description || "No detail"}`
    ).join("\n")

    const prompt = `
        Act as a Senior Engineering Manager writing a performance review.
        Analyze the following user achievements from the last ${timeframe}:

        ${entriesText}

        Generate a professional "Brag Document" / Performance Review in Markdown format.
        Use the following structure:
        
        # Performance Review - ${timeframe.toUpperCase()}

        ## 🏆 Key Achievements
        (Highlight the top 3-5 most impactful wins. Use bolding for emphasis.)

        ## 🚀 Impact Analysis
        (Analyze the "Impact" levels and "Mood" patterns. Did they maintain "Flow"? Did they tackle "High" impact work?)

        ## 📈 Growth & Skills
        (Infer skills demonstrated based on the entries. e.g., "React", "Leadership", "System Design".)

        Keep the tone professional, empowering, and high-signal. Avoid fluff.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error: any) {
        console.error("AI Generation Error:", error)
        if (error.message?.includes("API key")) {
            throw new Error("Invalid API Key. Please check .env.local")
        }
        throw new Error(error.message || "Failed to generate review.")
    }
}
