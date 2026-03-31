# 🔐 SQL Injection Challenge Lab

A comprehensive, progressive difficulty learning environment to master SQL injection attacks and defenses.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Seven Security Levels

### 🟢 LOW SECURITY - Very Easy
- No protection at all
- Direct string concatenation
- SQL errors shown
- **Goal:** Learn basic SQL injection techniques

### 🟡 MEDIUM SECURITY - Moderate
- Basic keyword filtering
- Blocks comments (`--`, `;`)
- Hides SQL errors
- **Goal:** Bypass simple filters

### 🟠 HIGH SECURITY - Hard
- Advanced filtering
- Email validation
- Length limits
- Multiple keyword blocks
- **Goal:** Find creative exploitation methods

### 🟣 EXPERT SECURITY - Very Hard
- WAF (Web Application Firewall) simulation
- Pattern-based detection
- Advanced regex filtering
- Strict validation
- **Goal:** Bypass enterprise-grade protection

### 🔵 BLIND INJECTION - Advanced
- No query shown
- No error messages
- No data returned
- Only success/fail response
- **Goal:** Extract data using boolean logic

### ⏱️ TIME-BASED BLIND - Expert
- Extract data via response timing
- Use CPU-intensive operations
- Measure delays to infer data
- **Goal:** Master timing-based extraction

### 🔴 VERY HIGH SECURITY - Not Injectable
- Parameterized queries (the proper way!)
- Input validation
- **Goal:** Understand why this is unbreakable

---

## 📚 What's Inside

- **7 Progressive Difficulty Levels** - From beginner to expert
- **Interactive SQL Practice Zone** - Learn SQL before attempting injection
- **Built-in Hints** - Click "Need Hints?" for guidance at each level
- **Quick Test Buttons** - Pre-filled attack payloads to try
- **Real-time Feedback** - See actual SQL queries being executed
- **Advanced Techniques** - Blind, time-based, WAF bypass
- **SQLite Database** - Local database with demo users (no external setup)
- **Beautiful UI** - Responsive, modern interface

---

## 🎯 Demo Users

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |
| test@example.com | test123 | user |

---

## 💉 Example Attacks by Level

### 🟢 LOW Security:
```
Email: admin@example.com' --
Password: anything
✅ Works! Comments out password check
```

### 🟡 MEDIUM Security:
```
Email: ' OR 'a'='a
Password: ' OR 'a'='a
✅ Works! Bypasses without using blocked comments
```

### 🟠 HIGH Security:
```
Email: admin@example.com' OR email LIKE '%
Password: x
✅ Works! Uses LIKE operator (not blocked)
```

### 🟣 EXPERT Security:
```
Most patterns blocked by WAF...
Can you find the edge case? 🤔
```

### 🔵 BLIND Injection:
```
Email: admin@example.com' AND SUBSTR(password,1,1)='a
Password: x
✅ If login succeeds, first character is 'a'!
Extract data bit by bit using true/false responses
```

### ⏱️ TIME-BASED:
```
Email: admin@example.com' AND RANDOMBLOB(100000000) AND '1'='1
Password: x
⏱️ Response time: ~3000ms (delay confirms injection works)
Use conditional delays to extract data
```

### 🔴 VERY HIGH Security:
```
Try anything... it won't work! 🛡️
This is properly secured with parameterized queries.
```

---

## 📖 Learning Resources

- **[SQL_BASICS_GUIDE.md](./SQL_BASICS_GUIDE.md)** - SQL fundamentals for beginners
- **[ADVANCED_SQL_GUIDE.md](./ADVANCED_SQL_GUIDE.md)** - Advanced SQL for expert levels
- **[DIFFICULTY_GUIDE.md](./DIFFICULTY_GUIDE.md)** - Detailed walkthrough for each level
- **[SQL_INJECTION_GUIDE.md](./SQL_INJECTION_GUIDE.md)** - Comprehensive SQL injection tutorial
- **[ERROR_BASED_INJECTION.md](./ERROR_BASED_INJECTION.md)** - Deep dive into error-based attacks
- **[ATTACK_CHEATSHEET.md](./ATTACK_CHEATSHEET.md)** - Quick reference for attack patterns
- **[SOLUTIONS.md](./SOLUTIONS.md)** - Solutions when you get stuck

---

## 🎓 Learning Path

1. **📚 Learn SQL First** - Use the SQL Practice Zone
   - Basic SELECT statements
   - WHERE conditions with AND/OR
   - String functions (SUBSTR, LENGTH, LIKE)
   - CASE statements
   - Subqueries
   - System metadata (sqlite_master)

2. **🟢 Start with LOW** - Learn the basics
   - Comment injection
   - OR logic
   - Always-true conditions

3. **🟡 Progress to MEDIUM** - Understand filter bypass
   - Work around keyword blocks
   - Alternative syntax

4. **🟠 Challenge HIGH** - Think creatively
   - Advanced operators
   - Email validation constraints

5. **🟣 Master EXPERT** - WAF bypass
   - Pattern evasion
   - Edge case exploitation

6. **🔵 Tackle BLIND** - Boolean-based extraction
   - True/false testing
   - Character-by-character extraction

7. **⏱️ Conquer TIME-BASED** - Timing attacks
   - Conditional delays
   - Response time analysis

8. **🔴 Appreciate VERY HIGH** - Learn the proper defense
   - Parameterized queries
   - Why it's unbreakable

---

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- TypeScript
- SQLite (better-sqlite3)
- Tailwind CSS

---

## ⚠️ Important

This is for **educational purposes only**. 

- ✅ Learn to build secure applications
- ✅ Test on your own local environment
- ✅ Understand both attack and defense
- ❌ Never test on systems you don't own
- ❌ Unauthorized access is illegal

---

## 🎯 What You'll Learn

- How SQL injection works at 7 different security levels
- Why blacklist filtering fails (even advanced WAF)
- How to bypass common protections
- Boolean-based blind injection techniques
- Time-based blind injection techniques
- Why parameterized queries are the only real solution
- How to write secure database code
- Advanced SQL for security testing

---

## 💡 Key Takeaway

**The only real defense against SQL injection is parameterized queries (prepared statements).**

Filtering, validation, and WAFs help, but they're not enough. Always use prepared statements!

---

**Learn. Break. Fix. Secure.** 🚀🔐
