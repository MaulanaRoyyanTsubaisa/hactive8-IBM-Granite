export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json()

    // Simulate API call with a more realistic response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let response
    if (type === "code") {
      response = `// Generated code for: ${prompt}
function example() {
  console.log("This is generated code based on your prompt:");
  console.log("${prompt}");
  
  // Add your implementation here
  return "Generated code result";
}

// Usage example
example();`
    } else {
      response = `Based on your prompt "${prompt}", here's a comprehensive response:

This is an AI-generated response that would typically come from IBM watsonx Granite API. The response is tailored to your specific request and provides relevant information or assistance.

Key points:
• Addresses your specific query
• Provides actionable insights
• Maintains context from the conversation
• Offers helpful suggestions when appropriate

Would you like me to elaborate on any particular aspect of this response?`
    }

    return Response.json({
      success: true,
      result: response,
    })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ success: false, error: "Failed to generate response" }, { status: 500 })
  }
}
