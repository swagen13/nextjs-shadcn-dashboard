// app/api/jobPosts/edit/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.json();

  // Destructure the form data
  const { description, ...otherData } = formData;

  // Log or process the data
  console.log("Received description:", description);
  console.log("Other form data:", otherData);

  // Respond with success and send back received data
  return NextResponse.json({
    message: "Data received successfully",
    data: { description, ...otherData },
  });
}

export async function GET(request: Request) {
  return NextResponse.json(
    { message: "Only POST method is allowed" },
    { status: 405 }
  );
}
