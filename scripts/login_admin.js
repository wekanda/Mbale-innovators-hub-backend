// scripts/login_admin.js
// Simple script to login using admin credentials and print the JSON response

(async () => {
  try {
    const res = await fetch('https://mbale-innovators-hub-backend-1.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: 'admin@mbalehub.com', password: 'Admin@12345' }),
    });
    const text = await res.text();
    try {
      console.log(JSON.stringify(JSON.parse(text), null, 2));
    } catch (err) {
      console.log('Non-JSON response:\n', text);
    }
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
