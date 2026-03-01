import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request: Request) {
  try {
    console.log('=== CLEARING ALL STUDENTS ===');
    
    await connectDB();
    console.log('Database connected');

    const result = await Student.deleteMany({});
    console.log('Deleted students:', result.deletedCount);

    return NextResponse.json({ 
      message: 'All students deleted',
      deletedCount: result.deletedCount,
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error('Clear error:', error);
    return NextResponse.json({ 
      message: 'Error clearing students',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
