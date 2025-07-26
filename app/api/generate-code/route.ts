import { type NextRequest, NextResponse } from "next/server";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Enhanced prompt for code generation with IBM Granite
    const codePrompt = `You are IBM Granite, an expert code generation AI. Generate clean, functional, and well-documented code based on this request:

${prompt}

Please provide only the code with minimal but helpful comments. Make sure the code is production-ready and follows best practices.

Code:`;

    console.log(
      "🚀 Calling IBM Granite 3.3 8B Instruct for code generation:",
      prompt.substring(0, 50) + "..."
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
          prompt: codePrompt,
          max_new_tokens: 2048,
          temperature: 0.2, // Lower temperature for more consistent code
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
    console.log("✅ Code generation prediction created:", prediction.id);

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
        console.log(
          `🔄 Code generation polling attempt ${attempts}, status: ${result.status}`
        );
      } else {
        console.error("❌ Polling error:", pollResponse.status);
        break;
      }
    }

    if (result.status === "succeeded" && result.output) {
      let code = Array.isArray(result.output)
        ? result.output.join("")
        : result.output;
      code = code.replace(/^Code:\s*/i, "").trim();

      console.log(
        "✅ IBM Granite code generated:",
        code.substring(0, 100) + "..."
      );

      if (code) {
        return NextResponse.json({
          code,
          source: "IBM Granite 3.3 8B Instruct",
          model: "Real AI Model",
        });
      }
    }

    if (result.status === "failed") {
      console.error("❌ Code generation failed:", result.error);
      throw new Error("Code generation failed");
    }

    throw new Error("Request timeout or no output");
  } catch (error) {
    console.error("❌ Code generation API error:", error);

    // Fallback code with error message
    return NextResponse.json({
      code: `// ⚠️ IBM Granite AI Code Generation Temporarily Unavailable
// Request: ${prompt}

/*
 * I apologize, but I'm currently unable to connect to the IBM Granite model
 * for code generation. This could be due to:
 * 
 * • API rate limits or temporary service issues
 * • Model initialization time  
 * • Network connectivity problems
 *
 * Please try again in a few moments.
 */

console.log('IBM Granite code generation will be available shortly');
console.log('Request was: ${prompt}');

// Placeholder function - replace with actual generated code
function placeholderSolution() {
    return {
        status: 'pending',
        message: 'IBM Granite AI will generate your code shortly',
        request: '${prompt}'
    };
}

// Export for use
module.exports = placeholderSolution;`,
      source: "Fallback Response",
      model: "Error Handler",
    });
  }
}
