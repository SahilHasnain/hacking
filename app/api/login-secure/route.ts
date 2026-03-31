import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 🔴 VERY HIGH SECURITY - Not Injectable
// Uses parameterized queries - the proper way

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Input validation (good practice)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Invalid email format',
        level: 'VERY HIGH'
      }, { status: 400 });
    }

    if (email.length > 100 || password.length > 100) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Input too long',
        level: 'VERY HIGH'
      }, { status: 400 });
    }

    // ✅ SECURE: Using parameterized query (prepared statement)
    const query = `
      SELECT * FROM users 
      WHERE email = ? AND password = ?
    `;

    console.log('🔴 VERY HIGH SECURITY - Query template:', query);
    console.log('📥 Parameters:', [email, password]);

    const user = db.prepare(query).get(email, password);

    if (user) {
      return NextResponse.json({
        success: true,
        message: '✅ Login successful!',
        user: user,
        level: 'VERY HIGH'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Invalid credentials',
        level: 'VERY HIGH'
      });
    }

  } catch (error: any) {
    // Don't reveal SQL errors to users
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed',
      level: 'VERY HIGH'
    }, { status: 500 });
  }
}
