import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    console.log('=== REGISTER API START ===');

    await connectDB(); // ✅ IMPORTANT

    const body = await request.json();
    const { name, email, regNo, year, password, gender } = body;

    // ✅ Basic Validation
    if (!name || !email || !regNo || !year || !password || !gender) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // ✅ Normalize Input
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRegNo = regNo.toUpperCase().trim();
    const normalizedYear = year.toLowerCase().trim();
    const normalizedGender = gender.toLowerCase().trim();

    // ✅ Check Duplicate (Case Safe)
    const existingStudent = await Student.findOne({
      $or: [
        { email: normalizedEmail },
        { regNo: normalizedRegNo }
      ]
    });

    if (existingStudent) {
      console.log('❌ Duplicate found:', { normalizedEmail, normalizedRegNo });

      return NextResponse.json(
        { message: 'Email or Registration number already exists' },
        { status: 400 }
      );
    }

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Create Student
    const student = await Student.create({
      name: name.trim(),
      email: normalizedEmail,
      regNo: normalizedRegNo,
      year: normalizedYear,          // 🔥 FIXED
      gender: normalizedGender,      // 🔥 FIXED
      password: hashedPassword,
    });

    console.log('✅ Student created:', student.regNo);

    return NextResponse.json(
      {
        message: 'Registration successful!',
        studentId: student._id
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Register error:', error.message);

    return NextResponse.json(
      { message: 'Registration failed: ' + error.message },
      { status: 500 }
    );
  }
}