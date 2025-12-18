
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("No API KEY found in .env.local")
        return
    }

    // Debug logging
    console.log("Using Key Length:", process.env.GEMINI_API_KEY.length);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    try {
        // There isn't a direct listModels method on the client instance in some versions, 
        // but let's try to infer if we can get it or just test a few known ones.
        // Actually the SDK doesn't expose listModels in the high level helper often.
        // We might have to just try catch specific models.

        const modelsToTest = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash-8b"
        ];

        console.log("Testing models...");

        for (const modelName of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                // Try a minimal generation to verify validity
                await model.generateContent("Hello");
                console.log(`✅ ${modelName} is AVAILABLE`);
            } catch (e: any) {
                if (e.message.includes("404")) {
                    console.log(`❌ ${modelName} NOT FOUND`);
                } else {
                    console.log(`⚠️ ${modelName} Error: ${e.message}`);
                }
            }
        }

    } catch (error) {
        console.error("Error listing/testing models:", error)
    }
}

listModels()
