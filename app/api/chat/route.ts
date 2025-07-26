import { type NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: NextRequest) {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_API_TOKEN) {
    console.error("❌ Missing REPLICATE_API_TOKEN in environment variables.");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }
  try {
    const { messages } = await req.json();

    // Format conversation for Granite model
    const conversation = messages
      .map(
        (msg: any) =>
          `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `${conversation}\nAssistant:`;

    console.log(
      "🚀 Calling IBM Granite 3.3 8B Instruct model with prompt:",
      prompt.substring(0, 100) + "..."
    );

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "ibm-granite/granite-3.3-8b-instruct", // Updated to new IBM Granite model
        input: {
          prompt: prompt,
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.1,
          stop_sequences: "Human:", // Changed from array to single string
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Replicate API error: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const prediction = await response.json();
    console.log("✅ Prediction created:", prediction.id);

    // Poll for completion
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60;

    while (
      result.status !== "succeeded" &&
      result.status !== "failed" &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;

      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (pollResponse.ok) {
        result = await pollResponse.json();
        console.log(`🔄 Polling attempt ${attempts}, status: ${result.status}`);
      } else {
        console.error("❌ Polling error:", pollResponse.status);
        break;
      }
    }

    if (result.status === "succeeded" && result.output) {
      let content = Array.isArray(result.output)
        ? result.output.join("")
        : result.output;
      content = content.replace(/^Assistant:\s*/i, "").trim();

      console.log(
        "✅ IBM Granite response received:",
        content.substring(0, 100) + "..."
      );

      if (content) {
        return NextResponse.json({
          content,
          source: "IBM Granite 3.3 8B Instruct",
          model: "Real AI Model",
        });
      }
    }

    if (result.status === "failed") {
      console.error("❌ Model prediction failed:", result.error);
      throw new Error("Model prediction failed");
    }

    throw new Error("Request timeout or no output");
  } catch (error) {
    console.error("❌ Chat API error:", error);

    // Fallback response indicating the error
    return NextResponse.json({
      content: `⚠️ **IBM Granite AI Temporarily Unavailable**

I apologize, but I'm currently unable to connect to the IBM Granite model. This could be due to:

• API rate limits or temporary service issues
• Model initialization time
• Network connectivity problems

**What I can still help with:**
• Use the Code Generator tab for code examples
• Ask me to retry your question in a moment
• Check the browser console for technical details

Please try again in a few moments, or let me know if you'd like me to attempt a different approach to access the IBM Granite model.`,
      source: "Fallback Response",
      model: "Error Handler",
    });
  }
}
