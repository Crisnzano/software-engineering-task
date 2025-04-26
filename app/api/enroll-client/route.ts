import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema
const EnrollmentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  referralSource: z.string().optional(),
  notes: z.string().optional(),
  consentGiven: z.boolean(),
  enrollmentDate: z.tuple([z.string(), z.string()]),
  programs: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(); // 🛠️ Move inside POST!

    const body = await req.json();

    // Validate request body
    const parsed = EnrollmentSchema.safeParse(body);
    if (!parsed.success) {
      console.error(parsed.error);
      return NextResponse.json({ message: "Invalid data", errors: parsed.error.flatten() }, { status: 400 });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      contactNumber,
      address,
      referralSource,
      notes,
      consentGiven,
      enrollmentDate,
      programs,
    } = parsed.data;

    const { error } = await supabase.from('client_enrollments').insert({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender,
      contact_number: contactNumber || null,
      address: address || null,
      referral_source: referralSource || null,
      notes: notes || null,
      consent_given: consentGiven,
      enrollment_start_date: enrollmentDate[0],
      enrollment_end_date: enrollmentDate[1],
      programs,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "Failed to enroll client." }, { status: 500 });
    }

    return NextResponse.json({ message: "Client enrolled successfully!" }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
