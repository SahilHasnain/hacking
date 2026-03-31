import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 🟡 MEDIUM SECURITY - Moderate Difficulty
// Basic filtering, hides SQL errors, but still vulnerable

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic filtering - blocks some obvious attacks
    const blockedKeywords = ['--', ';', '/*', '*/', 'xp_', 'sp_'];
    
    for (const keyword of blockedKeywords) {
      if (email.toLowerCase().includes(keyword) || password.toLowerCase().includes(keyword)) {
        return NextResponse.json({
          success: false,
          message: '⚠️ Suspicious input detected',
          level: 'MEDIUM'
        }, { status: 400 });
      }
    }

    // Still vulnerable - uses string concatenation
    const query = `
      SELECT * FROM users 
      WHERE email = '${email}' AND password = '${password}'
    `;

    console.log('🟡 MEDIUM SECURITY - Executing query:', query);

    try {
      const user = db.prepare(query).get();

      if (user) {
        return NextResponse.json({
          success: true,
          message: '✅ Login successful!',
          user: user,
          query: query,
          level: 'MEDIUM'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '❌ Invalid credentials',
          query: query,
          level: 'MEDIUM'
        });
      }
    } catch (sqlError: any) {
      // Hides SQL error details from user
      console.error('SQL Error:', sqlError);
      return NextResponse.json({
        success: false,
        message: '❌ Login failed',
        level: 'MEDIUM'
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
