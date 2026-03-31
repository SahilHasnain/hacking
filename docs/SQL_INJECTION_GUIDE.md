# 🔐 SQL Injection Learning Lab

## ⚠️ IMPORTANT: Educational Purpose Only
This lab is designed for learning security concepts in a safe, local environment. Never test these techniques on live websites or systems you don't own.

---

## 🎯 What You'll Learn

1. How SQL injection works
2. Why it's dangerous
3. How to identify vulnerabilities
4. How to fix them properly

---

## 🚀 Getting Started

### Run the Lab
```bash
npm run dev
```

Then open: http://localhost:3000

---

## 📖 Understanding SQL Injection

### Normal Login Flow
When you enter:
- Email: `admin@example.com`
- Password: `admin123`

The SQL query becomes:
```sql
SELECT * FROM users 
WHERE email = 'admin@example.com' AND password = 'admin123'
```

This works as expected ✅

---

## 💉 SQL Injection Attacks

### Attack 1: Comment Injection
**Input:**
- Email: `admin@example.com' --`
- Password: `anything`

**Resulting Query:**
```sql
SELECT * FROM users 
WHERE email = 'admin@example.com' --' AND password = 'anything'
```

**What Happens:**
- The `'` closes the email string
- `--` comments out everything after it
- Password check is ignored!
- ✅ Login successful without knowing the password

---

### Attack 2: Always True Condition
**Input:**
- Email: `' OR '1'='1`
- Password: `' OR '1'='1`

**Resulting Query:**
```sql
SELECT * FROM users 
WHERE email = '' OR '1'='1' AND password = '' OR '1'='1'
```

**What Happens:**
- `'1'='1'` is always true
- The condition becomes: `(false OR true) AND (false OR true)`
- Returns the first user in the database
- ✅ Login successful as admin!

---

### Attack 3: Union-Based Injection (Advanced)
**Input:**
- Email: `' UNION SELECT 1,2,3,4 --`
- Password: `anything`

**What Happens:**
- Combines results from multiple queries
- Can extract data from other tables
- Reveals database structure

---

### Attack 4: Blind SQL Injection
**Input:**
- Email: `admin@example.com' AND 1=1 --`
- Password: `anything`

**What Happens:**
- Tests if conditions are true/false
- Can extract data one bit at a time
- Slower but works even without error messages

---

## 🔒 The Fix: Parameterized Queries

### ❌ Vulnerable Code
```typescript
const query = `
  SELECT * FROM users 
  WHERE email = '${email}' AND password = '${password}'
`;
const user = db.prepare(query).get();
```

### ✅ Secure Code
```typescript
const query = `
  SELECT * FROM users 
  WHERE email = ? AND password = ?
`;
const user = db.prepare(query).get(email, password);
```

**Why This Works:**
- Parameters are treated as DATA, not CODE
- Special characters are automatically escaped
- SQL structure cannot be modified
- Injection attempts become literal strings

---

## 🧪 Test Cases

### Test in Vulnerable Mode:

1. **Normal Login** ✅
   - Email: `admin@example.com`
   - Password: `admin123`
   - Expected: Login successful

2. **Comment Bypass** 💉
   - Email: `admin@example.com' --`
   - Password: `anything`
   - Expected: Login successful (VULNERABLE!)

3. **Always True** 💉
   - Email: `' OR '1'='1`
   - Password: `' OR '1'='1`
   - Expected: Login successful (VULNERABLE!)

4. **Email Bypass** 💉
   - Email: `admin@example.com' OR '1'='1' --`
   - Password: `ignored`
   - Expected: Login successful (VULNERABLE!)

### Test in Secure Mode:

Try the same attacks - they should all fail! ✅

---

## 🎓 Key Takeaways

### Why SQL Injection is Dangerous:
1. **Bypass Authentication** - Login without credentials
2. **Data Theft** - Extract entire database
3. **Data Modification** - Update/delete records
4. **System Compromise** - Execute OS commands (in some cases)

### How to Prevent:
1. ✅ **Use Parameterized Queries** (prepared statements)
2. ✅ **Input Validation** - Validate data types and formats
3. ✅ **Least Privilege** - Database users should have minimal permissions
4. ✅ **Error Handling** - Don't expose SQL errors to users
5. ✅ **ORM Libraries** - Use tools like Prisma, TypeORM (they use parameterized queries)

### Red Flags in Code:
- ❌ String concatenation in SQL: `"SELECT * FROM users WHERE id = " + userId`
- ❌ Template literals in SQL: `` `SELECT * FROM users WHERE id = ${userId}` ``
- ❌ Direct user input in queries

---

## 🔍 Debugging Tips

Check your terminal console when testing - you'll see:
- The actual SQL query being executed
- Input values
- Query results

This helps you understand exactly what's happening!

---

## 📚 Further Learning

### Practice Platforms:
- **DVWA** (Damn Vulnerable Web App)
- **OWASP Juice Shop**
- **HackTheBox**
- **TryHackMe**

### Resources:
- OWASP SQL Injection Guide
- PortSwigger Web Security Academy
- SQL Injection Cheat Sheet

---

## ⚖️ Legal & Ethical Notice

- ✅ Test on your own systems
- ✅ Use authorized practice platforms
- ✅ Learn to build secure applications
- ❌ Never attack systems without permission
- ❌ Unauthorized access is illegal

**Remember:** The goal is to become a better developer who writes secure code, not to break things!

---

## 🛠️ Lab Architecture

```
┌─────────────────┐
│   Frontend      │
│   (page.tsx)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──────┐  ┌──▼────────┐
│Vulnerable│  │  Secure   │
│   API    │  │   API     │
└───┬──────┘  └──┬────────┘
    │            │
    └─────┬──────┘
          │
    ┌─────▼─────┐
    │  SQLite   │
    │ Database  │
    └───────────┘
```

---

Happy Learning! 🚀
