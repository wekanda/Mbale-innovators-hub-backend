// scripts/register_remote_accounts.js
// Registers admin and supervisor accounts on the deployed backend (Render)

async function register(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      return { raw: text };
    }
  } catch (err) {
    return { error: String(err) };
  }
}

(async () => {
  const base = 'https://mbale-innovators-hub-backend-1.onrender.com/api/auth';
  const accounts = [
    { name: 'Admin User', email: 'admin@mbalehub.com', password: 'Admin@12345', role: 'admin' },
    { name: 'Supervisor User', email: 'supervisor@mbalehub.com', password: 'Supervisor@12345', role: 'supervisor' },
  ];

  for (const a of accounts) {
    const r = await register(base + '/register', a);
    console.log('Register', a.email, '=>', r);
  }

  // Try to login admin to get token
  const loginRes = await register(base + '/login', { email: 'admin@mbalehub.com', password: 'Admin@12345' });
  console.log('\nLogin result for admin:', loginRes);
})();
