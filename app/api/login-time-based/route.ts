import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// ⏱️ TIME-BASED BLIND SQL INJECTION
// Extract data by measuring response time delays

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const startTime = Date.now();

    // Vulnerable query
    const query = `
      SELECT * FROM users 
      WHERE email = '${email}' AND password = '${password}'
    `;

    console.log('⏱️ TIME-BASED BLIND - Executing query:', query);

    try {
      // Check if query contains time-delay functions
      const queryLower = query.toLowerCase();
      let delayMs = 0;

      // Simulate different database time functions
      if (queryLower.includes('randomblob(100000000)')) {
        // SQLite CPU-intensive operation
        delayMs = 3000;
      } else if (queryLower.includes('randomblob(50000000)')) {
        delayMs = 1500;
      } else if (queryLower.includes('like(')) {
        // Complex LIKE operations can cause delays
        const likeMatches = queryLower.match(/like\([^)]+\)/g);
        if (likeMatches && likeMatches.length > 5) {
          delayMs = 2000;
        }
      }

      // Simulate delay if time-based injection detected
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      const user = db.prepare(query).get();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // BLIND: Only returns success/fail + response time
      if (user) {
        return NextResponse.json({
          success: true,
          message: '✅ Login successful',
          responseTime: `${responseTime}ms`,
          level: 'TIME-BASED'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '❌ Login failed',
          responseTime: `${responseTime}ms`,
          level: 'TIME-BASED'
        });
      }
    } catch (sqlError: any) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.error('SQL Error (hidden from user):', sqlError);
      return NextResponse.json({
        success: false,
        message: '❌ Login failed',
        responseTime: `${responseTime}ms`,
        level: 'TIME-BASED'
      });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '❌ Login failed'
    });
  }
}
