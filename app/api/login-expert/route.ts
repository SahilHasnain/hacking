import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 🟣 EXPERT SECURITY - Very Hard (WAF Simulation)
// Simulates a Web Application Firewall with advanced pattern detection

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Advanced WAF-like filtering
    const input = (email + ' ' + password).toLowerCase();
    
    // Block common SQL injection patterns
    const blockedPatterns = [
      /--/,                    // Comments
      /;/,                     // Statement separator
      /\/\*/,                  // Block comment start
      /\*\//,                  // Block comment end
      /union/i,                // UNION attacks
      /select/i,               // SELECT injection
      /drop/i,                 // DROP attacks
      /insert/i,               // INSERT attacks
      /update/i,               // UPDATE attacks
      /delete/i,               // DELETE attacks
      /exec/i,                 // EXEC attacks
      /script/i,               // XSS attempts
      /or\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/i,  // OR 'x'='x' patterns
      /or\s+\d+\s*=\s*\d+/i,   // OR 1=1 patterns
      /'\s*or\s*'/i,           // ' OR ' patterns
      /like\s*['"]?%/i,        // LIKE '%' patterns
      /\bor\b.*\blike\b/i,     // OR ... LIKE patterns
      /'\s*\+\s*'/,            // String concatenation
      /concat\s*\(/i,          // CONCAT function
      /char\s*\(/i,            // CHAR function
      /0x[0-9a-f]+/i,          // Hex encoding
      /benchmark\s*\(/i,       // Benchmark (time-based)
      /sleep\s*\(/i,           // Sleep (time-based)
      /waitfor\s+delay/i,      // WAITFOR (SQL Server)
      /pg_sleep/i,             // PostgreSQL sleep
      /and\s+\d+\s*[<>=]/i,    // AND 1=1 patterns
      /\|\|/,                  // String concatenation (Oracle/PostgreSQL)
      /&&/,                    // Logical AND
    ];

    for (const pattern of blockedPatterns) {
      if (pattern.test(input)) {
        return NextResponse.json({
          success: false,
          message: '🛡️ WAF: Suspicious pattern detected',
          blocked: pattern.toString(),
          level: 'EXPERT'
        }, { status: 403 });
      }
    }

    // Strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Invalid email format',
        level: 'EXPERT'
      }, { status: 400 });
    }

    // Length validation
    if (email.length > 50 || password.length > 50) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Input too long',
        level: 'EXPERT'
      }, { status: 400 });
    }

    // Check for multiple quotes (potential injection)
    const quoteCount = (email.match(/'/g) || []).length + (password.match(/'/g) || []).length;
    if (quoteCount > 2) {
      return NextResponse.json({
        success: false,
        message: '🛡️ WAF: Too many quotes detected',
        level: 'EXPERT'
      }, { status: 403 });
    }

    // Still uses string concatenation (very subtle vulnerability)
    const query = `
      SELECT * FROM users 
      WHERE email = '${email}' AND password = '${password}'
    `;

    console.log('🟣 EXPERT SECURITY - Executing query:', query);

    try {
      const user = db.prepare(query).get();

      if (user) {
        return NextResponse.json({
          success: true,
          message: '✅ Login successful!',
          user: user,
          query: query,
          level: 'EXPERT'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: '❌ Invalid credentials',
          level: 'EXPERT'
        });
      }
    } catch (sqlError: any) {
      console.error('SQL Error:', sqlError);
      return NextResponse.json({
        success: false,
        message: '❌ Login failed',
        level: 'EXPERT'
      }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
