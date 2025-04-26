import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const supabase = createClient();

// Define a validation schema
const EnrollmentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(), // dates come as stringified JSON from client
  gender: z.enum(["male", "female", "other"]),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  referralSource: z.string().optional(),
  notes: z.string().optional(),
  consentGiven: z.boolean(),
  enrollmentDate: z.tuple([z.string(), z.string()]), // tuple of [startDate, endDate]
  programs: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  try {
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

    const { error } = await (await supabase).from('client_enrollments').insert({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender: gender,
      contact_number: contactNumber || null,
      address: address || null,
      referral_source: referralSource || null,
      notes: notes || null,
      consent_given: consentGiven,
      enrollment_start_date: enrollmentDate[0],
      enrollment_end_date: enrollmentDate[1],
      programs: programs,
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
