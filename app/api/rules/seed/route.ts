import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import DressRule from '@/models/DressRule';

export async function GET() {
  try {
    await connectDB();

    // Delete existing rules
    await DressRule.deleteMany({});

    // Create dress rules for each year
    const rules = [
      {
        gender: 'boy',
        year: '2nd',
        topColors: ['Cream'],
        bottomColors: ['Black'],
        idCardRequired: true
      },
      {
        gender: 'girl',
        year: '2nd',
        topColors: ['Cream'],
        bottomColors: ['Black'],
        idCardRequired: true
      },
      {
        gender: 'boy',
        year: '3rd',
        topColors: ['Pink'],
        bottomColors: ['Black'],
        idCardRequired: true
      },
      {
        gender: 'girl',
        year: '3rd',
        topColors: ['Pink'],
        bottomColors: ['Black'],
        idCardRequired: true
      },
      {
        gender: 'boy',
        year: '4th',
        topColors: ['Light Grey'],
        bottomColors: ['Light Grey'],
        idCardRequired: true
      },
      {
        gender: 'girl',
        year: '4th',
        topColors: ['Light Grey'],
        bottomColors: ['Light Grey'],
        idCardRequired: true
      }
    ];

    await DressRule.insertMany(rules);

    return NextResponse.json({ 
      message: 'Dress rules seeded successfully',
      count: rules.length
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
