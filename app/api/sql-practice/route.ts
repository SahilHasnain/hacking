import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 📚 SQL Practice Endpoint - Learn SQL by running queries
// This is for educational purposes to understand SQL before learning injection

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.trim() === '') {
      return NextResponse.json({
        success: false,
        message: 'Please enter a SQL query'
      }, { status: 400 });
    }

    // Security: Only allow SELECT queries for safety
    const trimmedQuery = query.trim().toUpperCase();
    if (!trimmedQuery.startsWith('SELECT')) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Only SELECT queries are allowed in practice mode',
        hint: 'Try: SELECT * FROM users'
      }, { status: 400 });
    }

    // Prevent dangerous operations even in SELECT
    const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE'];
    for (const keyword of dangerousKeywords) {
      if (trimmedQuery.includes(keyword)) {
        return NextResponse.json({
          success: false,
          message: `⚠️ Keyword '${keyword}' is not allowed in practice mode`,
          hint: 'Stick to SELECT queries for learning'
        }, { status: 400 });
      }
    }

    console.log('📚 SQL Practice - Executing:', query);

    try {
      // Execute the query
      const result = db.prepare(query).all();

      return NextResponse.json({
        success: true,
        message: '✅ Query executed successfully!',
        query: query,
        result: result,
        rowCount: result.length
      });
    } catch (sqlError: any) {
      // Show SQL errors for learning
      return NextResponse.json({
        success: false,
        message: '💥 SQL Error',
        error: sqlError.message,
        query: query,
        hint: 'Check your SQL syntax. Common issues: missing quotes, wrong table/column names, unmatched parentheses'
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
