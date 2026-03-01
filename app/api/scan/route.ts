import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import DressRule from "@/models/DressRule";
import nodemailer from "nodemailer";

/* =====================================================
   📧 SEND EMAIL FUNCTION (Student + Admin)
===================================================== */
async function sendViolationEmail(
  student: any,
  violations: string[]
) {
  const transporterOptions: any = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  // In development, disable SSL verification to avoid self-signed cert errors
  if (process.env.NODE_ENV === "development") {
    transporterOptions.tls = {
      rejectUnauthorized: false,
    };
  }
  const transporter = nodemailer.createTransport(transporterOptions);

  /* ===============================
     📩 EMAIL TO STUDENT
  =============================== */
  await transporter.sendMail({
    from: `"Uniform Scanner" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: "⚠ Dress Code Violation Warning",
    html: `
      <h2>Hello ${student.name},</h2>
      <p>You are not in proper college uniform.</p>
      <p><strong>Detected Issues:</strong></p>
      <ul>
        ${violations.map(v => `<li>${v}</li>`).join("")}
      </ul>
      <p>Please follow the college dress code policy.</p>
      <br/>
      <p>Regards,<br/>College Administration</p>
    `,
  });

  /* ===============================
     📩 EMAIL TO ADMIN
  =============================== */
  await transporter.sendMail({
    from: `"Uniform Scanner System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🚨 Dress Code Violation Report",
    html: `
      <h2>Dress Code Violation Detected</h2>
      <p><strong>Name:</strong> ${student.name}</p>
      <p><strong>Email:</strong> ${student.email}</p>
      <p><strong>Registration No:</strong> ${student.regNo}</p>
      <p><strong>Year:</strong> ${student.year}</p>
      <p><strong>Gender:</strong> ${student.gender}</p>

      <h3>Violations:</h3>
      <ul>
        ${violations.map(v => `<li>${v}</li>`).join("")}
      </ul>
    `,
  });

  console.log("✅ Email sent to Student & Admin");
}

/* =====================================================
   🚀 SCAN API WITH DEBUG LOGS
===================================================== */
export async function POST(request: Request) {
  try {
    console.log("✅ Scan API Triggered");

    await connectDB();

    const body = await request.json();

    let {
      studentId,
      topColor,
      bottomColor,
      idCardDetected,
    } = body;

    /* ===============================
       🔍 DEBUG LOG - INPUT DATA
    =============================== */
    console.log('📥 Received from frontend:', {
      studentId,
      topColor,
      bottomColor,
      idCardDetected
    });

    /* ===============================
       ✅ VALIDATION
    =============================== */
    if (!studentId || !topColor || !bottomColor) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ===============================
       ✅ NORMALIZE INPUT
    =============================== */
    studentId = String(studentId).trim();
    topColor = String(topColor).toLowerCase().trim();
    bottomColor = String(bottomColor).toLowerCase().trim();
    idCardDetected =
      idCardDetected === true || idCardDetected === "true";

    console.log('🔧 Normalized data:', {
      studentId,
      topColor,
      bottomColor,
      idCardDetected
    });

    /* ===============================
       🧑‍🎓 FIND STUDENT
    =============================== */
    const student = await Student.findOne({
      $or: [
        { email: studentId.toLowerCase() },
        { regNo: studentId.toUpperCase() },
      ],
    });

    if (!student) {
      console.log('❌ Student not found for ID:', studentId);
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    console.log("✅ Student Found:", student.name, {
      year: student.year,
      gender: student.gender
    });

    /* ===============================
       👗 FETCH DRESS RULE
    =============================== */
    const studentYear = student.year?.toLowerCase();
    const studentGender = student.gender?.toLowerCase();

    console.log('🎯 Looking for rule:', { year: studentYear, gender: studentGender });

    if (!studentYear || !studentGender) {
      return NextResponse.json(
        { message: "Student year or gender missing" },
        { status: 400 }
      );
    }

    const rule = await DressRule.findOne({
      year: studentYear,
      gender: studentGender,
    });

    if (!rule) {
      console.log('❌ Dress rule not found:', { year: studentYear, gender: studentGender });
      return NextResponse.json(
        { message: "Dress rule not found" },
        { status: 404 }
      );
    }

    console.log('📋 Dress Rule Found:', {
      year: rule.year,
      gender: rule.gender,
      topColors: rule.topColors,
      bottomColors: rule.bottomColors,
      idCardRequired: rule.idCardRequired
    });

    /* ===============================
       🚩 VIOLATION CHECK WITH DETAILED LOGS
    =============================== */
    // 1️⃣ Normalize DB and input colors to lowercase
    const allowedTopColors = rule.topColors.map((c: string) => c.toLowerCase().trim());
    const allowedBottomColors = rule.bottomColors.map((c: string) => c.toLowerCase().trim());

    const receivedTop = (topColor || '').toLowerCase();
    const receivedBottom = (bottomColor || '').toLowerCase();

    console.log('🎯 MATCH CHECK:', {
      receivedTop,
      allowedTops: allowedTopColors,
      topMatch: allowedTopColors.includes(receivedTop),
      receivedBottom,
      allowedBottoms: allowedBottomColors,
      bottomMatch: allowedBottomColors.includes(receivedBottom),
      idCardCheck: rule.idCardRequired,
      idCardDetected
    });

    // 2️⃣ Initialize violations array
    const violations: string[] = [];

    // 3️⃣ Top color mismatch
    if (!allowedTopColors.includes(receivedTop)) {
      violations.push(`Invalid Top Color (Allowed: ${rule.topColors.join(", ")})`);
    }

    // 4️⃣ Bottom color mismatch
    if (!allowedBottomColors.includes(receivedBottom)) {
      violations.push(`Invalid Bottom Color (Allowed: ${rule.bottomColors.join(", ")})`);
    }

    // 5️⃣ ID card missing check
    if (rule.idCardRequired && !idCardDetected) {
      violations.push("ID Card Missing");
    }

    console.log('🚩 Final Violations:', violations);

    // 6️⃣ Send email only if violation exists
    if (violations.length > 0) {
      console.log('❌ Violations found, sending emails...');
      await sendViolationEmail(student, violations);

      return NextResponse.json(
        {
          status: "Violation",
          student: student.name,
          violations,
        },
        { status: 403 }
      );
    }

    // 7️⃣ All correct → allowed
    console.log('✅ ALL CHECKS PASSED - Entry Allowed!');
    return NextResponse.json(
      {
        status: "Allowed",
        student: student.name,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("🚨 Scan API Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
