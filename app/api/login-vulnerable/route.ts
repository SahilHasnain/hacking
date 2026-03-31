import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 🟢 LOW SECURITY - Very Easy to Exploit
// Direct string concatenation, shows SQL errors, no filtering

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 🚨 VULNERABLE: Direct string concatenation
    const query = `
      SELECT * FROM users 
      WHERE email = '${email}' AND password = '${password}'
    `;

    console.log('🟢 LOW SECURITY - Executing query:', query);
    console.log('📥 Input email:', email);
    console.log('📥 Input password:', password);

    try {
      const user = db.prepare(query).get();

      if (user) {
        return NextResponse.json({
          success: true,
          message: '✅ Login successful!',
          user: user,
          query: query,
          level: 'LOW'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '❌ Invalid credentials',
          query: query,
          level: 'LOW'
        });
      }
    } catch (sqlError: any) {
      // Shows SQL errors - helps attackers!
      return NextResponse.json({
        success: false,
        message: '💥 SQL Error',
        error: sqlError.message,
        query: query,
        level: 'LOW'
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error.message
    }, { status: 500 });
  }
}
