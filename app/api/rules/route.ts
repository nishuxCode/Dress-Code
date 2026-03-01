import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DressRule from "@/models/DressRule";

/* =====================================================
   GET ALL RULES
===================================================== */
export async function GET() {
  try {
    await connectDB();

    const rules = await DressRule.find().sort({ year: 1 });

    return NextResponse.json(rules, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch rules", error: error.message },
      { status: 500 }
    );
  }
}

/* =====================================================
   CREATE NEW RULE
===================================================== */
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const newRule = await DressRule.create(body);

    return NextResponse.json(newRule, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create rule", error: error.message },
      { status: 500 }
    );
  }
}