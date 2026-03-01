import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';
import DressRule from '@/models/DressRule';
import ScanLog from '@/models/ScanLog';
import Violation from '@/models/Violation';

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find().lean();
    const dressRules = await DressRule.find().lean();
    const scanLogs = await ScanLog.find().lean();
    const violations = await Violation.find().lean();

    return NextResponse.json({
      students: {
        count: students.length,
        data: students
      },
      dressRules: {
        count: dressRules.length,
        data: dressRules
      },
      scanLogs: {
        count: scanLogs.length,
        data: scanLogs
      },
      violations: {
        count: violations.length,
        data: violations
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      message: 'Server error',
      error: String(error)
    }, { status: 500 });
  }
}
