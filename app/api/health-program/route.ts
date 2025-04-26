import { createClient } from "@/utils/supabase/server"

const supabase = createClient()
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, diseaseType, description, goal, targetAudience, activities, partners } = body;

    const { error } = await (await supabase).from('health_programs').insert({
      title,
      disease_type: diseaseType,
      description,
      goal,
      target_audience: targetAudience,
      activities,
      partners: partners || null,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "Failed to create program." }, { status: 500 });
    }

    return NextResponse.json({ message: "Health program created successfully!" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
