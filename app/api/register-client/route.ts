import { createClient } from "@/utils/supabase/server"

const supabase = createClient()
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await (await supabase).from("clients").insert([
    {
      first_name: body.firstName,
      last_name: body.lastName,
      date_of_birth: body.dateOfBirth,
      gender: body.gender,
      id_number: body.idNumber,
      contact_number: body.contactNumber,
      alternative_contact: body.alternativeContact,
      email: body.email,
      address: body.address,
      occupation: body.occupation,
      marital_status: body.maritalStatus,
      emergency_contact_name: body.emergencyContactName,
      emergency_contact_number: body.emergencyContactNumber,
      emergency_contact_relation: body.emergencyContactRelation,
      allergies: body.allergies,
      chronic_conditions: body.chronicConditions,
      current_medications: body.currentMedications,
      consent_to_contact: body.consentToContact,
      consent_to_share_data: body.consentToShareData,
    },
  ]);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Client registered successfully" });
}
