import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const webhookUrl = "https://n8n.horizxon.tech/webhook/3be391c3-780d-440f-b69d-485fbb17b22f"

    console.log("[v0] Sending request to webhook:", webhookUrl)
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] Webhook response status:", response.status)
    console.log("[v0] Webhook response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Webhook error response body:", errorText)

      let errorMessage = "I'm having trouble connecting to my brain right now."
      if (response.status === 404) {
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.message && errorData.message.includes("not registered")) {
            errorMessage =
              "My n8n workflow isn't active. Please go to your n8n canvas and click 'Execute workflow' or activate the workflow to enable the webhook."
          } else {
            errorMessage = "My webhook endpoint seems to be missing. Please check if the n8n workflow is active."
          }
        } catch {
          errorMessage = "My webhook endpoint seems to be missing. Please check if the n8n workflow is active."
        }
      } else if (response.status === 500) {
        errorMessage = "There's an issue with my processing system. Please try again in a moment."
      }

      return NextResponse.json(
        {
          success: false,
          error: `Webhook error (${response.status})`,
          response: errorMessage,
        },
        { status: 200 },
      ) // Return 200 to frontend but indicate webhook failure
    }

    const responseData = await response.json()
    console.log("[v0] Webhook response data:", responseData)

    const outputValue = responseData?.output || "I received your message but couldn't generate a response."

    return NextResponse.json({
      success: true,
      response: outputValue,
    })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process webhook request",
        response: "Sorry, I'm experiencing technical difficulties. Please try again later.",
      },
      { status: 200 }, // Return 200 to frontend but indicate failure
    )
  }
}
