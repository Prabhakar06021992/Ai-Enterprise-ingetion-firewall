
export async function POST(request) {
  try {
    const body = await request.json();

    if (
      typeof body.message !== "string" ||
      !body.message.trim()
    ) {
      return Response.json(
        { error: "Please enter a valid message." },
        { status: 400 }
      );
    }

    const backendUrl = process.env.FASTAPI_URL;

    if (!backendUrl) {
      return Response.json(
        { error: "Backend URL is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${backendUrl}/api/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: body.message.trim(),
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
    });
  } catch (error) {
    return Response.json(
      { error: "Could not connect to the backend." },
      { status: 502 }
    );
  }
}
