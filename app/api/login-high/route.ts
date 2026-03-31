import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 🟠 HIGH SECURITY - Hard to Exploit
// Advanced filtering, input validation, but still has a subtle vulnerability

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Advanced filtering
    const blockedPatterns = [
      /--/,           // SQL comments
      /;/,            // Statement separator
      /\/\*/,         // Block comment start
      /\*\//,         // Block comment end
      /union/i,       // UNION attacks
      /select/i,      // SELECT injection
      /drop/i,        // DROP attacks
      /insert/i,      // INSERT attacks
      /update/i,      // UPDATE attacks
      /delete/i,      // DELETE attacks
      /exec/i,        // EXEC attacks
      /script/i,      // XSS attempts
    ];

    for (const pattern of blockedPatterns) {
      if (pattern.test(email) || pattern.test(password)) {
        return NextResponse.json({
          success: false,
          message: '⚠️ Invalid input format',
          level: 'HIGH'
        }, { status: 400 });
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Invalid email format',
        level: 'HIGH'
      }, { status: 400 });
    }

    // Length validation
    if (email.length > 100 || password.length > 100) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Input too long',
        level: 'HIGH'
      }, { status: 400 });
    }

    // Still uses string concatenation (subtle vulnerability)
    // But much harder to exploit due to filters
    const query = `
      SELECT * FROM users 
      WHERE email = '${email}' AND password = '${password}'
    `;

    console.log('🟠 HIGH SECURITY - Executing query:', query);

    try {
      const user = db.prepare(query).get();

      if (user) {
        return NextResponse.json({
          success: true,
          message: '✅ Login successful!',
          user: user,
          query: query,
          level: 'HIGH'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '❌ Invalid credentials',
          level: 'HIGH'
        });
      }
    } catch (sqlError: any) {
      console.error('SQL Error:', sqlError);
      return NextResponse.json({
        success: false,
        message: '❌ Login failed',
        level: 'HIGH'
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
