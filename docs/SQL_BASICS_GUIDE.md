# 📚 SQL Basics for SQL Injection Learning

Before you can exploit SQL injection, you need to understand SQL! This guide teaches you the SQL fundamentals needed for the challenge lab.

---

## 🎯 Why Learn SQL First?

SQL injection works by **manipulating SQL queries**. To manipulate them, you need to understand:
- How SQL queries are structured
- What different SQL keywords do
- How conditions work (WHERE, AND, OR)
- How quotes and special characters behave

---

## 📖 SQL Basics

### What is SQL?

SQL (Structured Query Language) is used to communicate with databases. Think of it as asking questions to a database.

**Database Structure:**
```
Database: vulnerable.db
  └── Table: users
      ├── Column: id (number)
      ├── Column: email (text)
      ├── Column: password (text)
      └── Column: role (text)
```

---

## 🔍 SELECT Statement

The most important SQL command for reading data.

### Basic Syntax:
```sql
SELECT columns FROM table WHERE condition
```

### Example 1: Get All Users
```sql
SELECT * FROM users
```
- `SELECT *` = Get all columns
- `FROM users` = From the users table
- Result: All user records

### Example 2: Get Specific Columns
```sql
SELECT email, role FROM users
```
- Only returns email and role columns
- Ignores id and password

### Example 3: Get One User
```sql
SELECT * FROM users WHERE email = 'admin@example.com'
```
- `WHERE` = Filter condition
- `email = 'admin@example.com'` = Only rows matching this email
- Result: Just the admin user

---

## 🎯 WHERE Clause

Filters which rows to return.

### Comparison Operators:
```sql
=   -- Equals
!=  -- Not equals
<   -- Less than
>   -- Greater than
<=  -- Less than or equal
>=  -- Greater than or equal
```

### Examples:
```sql
-- Find admin users
SELECT * FROM users WHERE role = 'admin'

-- Find non-admin users
SELECT * FROM users WHERE role != 'admin'
```

---

## 🔗 Logical Operators (AND, OR)

Combine multiple conditions.

### AND - Both conditions must be true
```sql
SELECT * FROM users 
WHERE email = 'admin@example.com' AND password = 'admin123'
```
- Returns user ONLY if both email AND password match
- This is how login works!

### OR - At least one condition must be true
```sql
SELECT * FROM users 
WHERE email = 'admin@example.com' OR email = 'user@example.com'
```
- Returns users matching EITHER email
- This is key to SQL injection!

### Combining AND/OR:
```sql
SELECT * FROM users 
WHERE (email = 'admin@example.com' OR email = 'user@example.com') 
AND role = 'admin'
```
- Parentheses control order of operations

---

## 💡 Understanding Quotes

Quotes are CRITICAL in SQL and SQL injection!

### String Values Need Quotes:
```sql
-- ✅ Correct
SELECT * FROM users WHERE email = 'admin@example.com'

-- ❌ Wrong (no quotes)
SELECT * FROM users WHERE email = admin@example.com
```

### Numbers Don't Need Quotes:
```sql
-- ✅ Correct
SELECT * FROM users WHERE id = 1

-- ⚠️ Works but unnecessary
SELECT * FROM users WHERE id = '1'
```

### Quote Types:
- `'single quotes'` - For strings (most common)
- `"double quotes"` - For identifiers (table/column names)

---

## 🎭 SQL Injection Preview

Now that you understand SQL, let's see how injection works:

### Normal Login Query:
```sql
SELECT * FROM users 
WHERE email = 'admin@example.com' AND password = 'admin123'
```
- If both match, login succeeds

### Injected Query:
```sql
SELECT * FROM users 
WHERE email = 'admin@example.com' OR '1'='1' AND password = 'anything'
```
- `'1'='1'` is always true!
- OR makes the whole condition true
- Login succeeds without correct password!

**How it happened:**
User entered: `admin@example.com' OR '1'='1`

The application did:
```javascript
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
```

Became:
```sql
SELECT * FROM users WHERE email = 'admin@example.com' OR '1'='1'
```

---

## 🔧 Useful SQL Functions

### COUNT - Count rows
```sql
SELECT COUNT(*) FROM users
-- Returns: 3 (number of users)
```

### LIMIT - Limit results
```sql
SELECT * FROM users LIMIT 1
-- Returns: Only first user
```

### LIKE - Pattern matching
```sql
SELECT * FROM users WHERE email LIKE '%@example.com'
-- Returns: All users with @example.com email
-- % is wildcard (matches anything)
```

### sqlite_version() - Get database version
```sql
SELECT sqlite_version()
-- Returns: 3.40.1 (or your SQLite version)
```

---

## 🎯 Practice Exercises

Try these in the SQL Practice section:

### Exercise 1: Basic SELECT
```sql
SELECT * FROM users
```
**Goal:** See all users in the database

### Exercise 2: Filter by Email
```sql
SELECT * FROM users WHERE email = 'admin@example.com'
```
**Goal:** Get only the admin user

### Exercise 3: Filter by Role
```sql
SELECT email, role FROM users WHERE role = 'admin'
```
**Goal:** Find all admin users (only show email and role)

### Exercise 4: Count Users
```sql
SELECT COUNT(*) as total FROM users
```
**Goal:** Count how many users exist

### Exercise 5: AND Condition
```sql
SELECT * FROM users WHERE email = 'admin@example.com' AND password = 'admin123'
```
**Goal:** Simulate a login check

### Exercise 6: OR Condition (Injection Preview!)
```sql
SELECT * FROM users WHERE email = 'admin@example.com' OR '1'='1'
```
**Goal:** See how OR makes the condition always true!

### Exercise 7: LIKE Pattern
```sql
SELECT * FROM users WHERE email LIKE '%@example.com'
```
**Goal:** Find all users with example.com email

### Exercise 8: Always True Condition
```sql
SELECT * FROM users WHERE '1'='1'
```
**Goal:** Understand why this returns all users

---

## 🧪 Understanding SQL Injection Through SQL

### Normal Query:
```sql
SELECT * FROM users WHERE email = 'user@example.com' AND password = 'user123'
```
**Result:** Returns user if both match ✅

### Injection 1: Comment Out Password
```sql
SELECT * FROM users WHERE email = 'admin@example.com' --' AND password = 'anything'
```
- `--` starts a comment
- Everything after is ignored
- Password check removed!
**Result:** Returns admin without password ✅

### Injection 2: Always True OR
```sql
SELECT * FROM users WHERE email = '' OR '1'='1' AND password = '' OR '1'='1'
```
- `'1'='1'` is always true
- OR makes condition pass
**Result:** Returns first user (usually admin) ✅

### Injection 3: LIKE Wildcard
```sql
SELECT * FROM users WHERE email = 'admin@example.com' OR email LIKE '%' AND password = 'x'
```
- `LIKE '%'` matches everything
- Bypasses email check
**Result:** Returns users ✅

---

## 📊 SQL Query Structure

Understanding the structure helps you manipulate it:

```sql
SELECT [columns]           -- What to return
FROM [table]              -- Which table
WHERE [condition]         -- Filter (this is where injection happens!)
ORDER BY [column]         -- Sort results
LIMIT [number]            -- Limit results
```

**Injection Target:** Almost always the WHERE clause!

---

## 🎓 Key Concepts for SQL Injection

### 1. String Concatenation
```javascript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;
```
Your input becomes part of the SQL code!

### 2. Quote Escaping
```sql
-- Input: admin@example.com'
-- Query becomes: WHERE email = 'admin@example.com''
-- Breaks syntax!
```

### 3. Boolean Logic
```sql
-- false OR true = true
-- true AND false = false
-- true OR anything = true
```

### 4. Comments
```sql
-- This is a comment
/* This is also a comment */
```

---

## 💡 Practice Tips

1. **Start Simple:** Run basic SELECT queries first
2. **Add Conditions:** Practice WHERE with AND/OR
3. **Experiment:** Try different combinations
4. **Break Things:** Intentionally create errors to learn
5. **Compare:** Run normal vs injected queries side-by-side

---

## 🎯 Ready for Injection?

Once you're comfortable with:
- ✅ SELECT statements
- ✅ WHERE conditions
- ✅ AND/OR logic
- ✅ Quote usage
- ✅ Comments

You're ready to try SQL injection in the challenge lab!

---

## 📚 Quick Reference

| Concept | Example | Purpose |
|---------|---------|---------|
| SELECT | `SELECT * FROM users` | Get data |
| WHERE | `WHERE email = 'x'` | Filter |
| AND | `WHERE a = 'x' AND b = 'y'` | Both true |
| OR | `WHERE a = 'x' OR b = 'y'` | Either true |
| LIKE | `WHERE email LIKE '%@x.com'` | Pattern match |
| COUNT | `SELECT COUNT(*) FROM users` | Count rows |
| LIMIT | `SELECT * FROM users LIMIT 1` | Limit results |
| -- | `SELECT * FROM users --` | Comment |

---

**Master SQL basics, then break them with injection!** 🚀📚
