import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const VALID_API_KEY = process.env.VALID_API_KEY!; // <- Define your valid API key securely in env

export async function GET(req: NextRequest) {
  const supabase = createClient(); // move inside to always get fresh cookies

  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: "Missing or invalid authorization header." }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  if (token !== VALID_API_KEY) {
    return NextResponse.json({ message: "Unauthorized access." }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const clientId = searchParams.get('id');

  if (!clientId) {
    return NextResponse.json({ message: "Missing client ID." }, { status: 400 });
  }

  const { data, error } = await (await supabase)
  .from('clients')
  .select('id, name, email, profile_picture, bio')
  .eq('id', clientId)
  .single();

  if (error || !data) {
    console.error(error);
    return NextResponse.json({ message: "Client not found." }, { status: 404 });
  }

  // Optional: Add basic caching headers
  const response = NextResponse.json(data, { status: 200 });
  response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  return response;
}
