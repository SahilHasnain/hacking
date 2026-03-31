import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 🔵 BLIND SQL INJECTION - No Direct Feedback
// Returns only "success" or "fail" - no query, no error, no data

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Vulnerable query (string concatenation)
    const query = `
      SELECT * FROM users 
      WHERE email = '${email}' AND password = '${password}'
    `;

    console.log('🔵 BLIND INJECTION - Executing query:', query);

    try {
      const user = db.prepare(query).get();

      // BLIND: Only returns success/fail, no details!
      if (user) {
        return NextResponse.json({
          success: true,
          message: '✅ Login successful',
          level: 'BLIND'
          // No query shown!
          // No user data shown!
          // No error details!
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '❌ Login failed',
          level: 'BLIND'
        });
      }
    } catch (sqlError: any) {
      // Hide all SQL errors - just return generic failure
      console.error('SQL Error (hidden from user):', sqlError);
      return NextResponse.json({
        success: false,
        message: '❌ Login failed',
        level: 'BLIND'
      });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '❌ Login failed'
    });
  }
}
