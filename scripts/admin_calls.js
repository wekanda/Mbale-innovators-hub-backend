// scripts/admin_calls.js
// Logs in as admin on deployed backend and calls protected endpoints

async function postJson(url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'GET', headers });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

(async () => {
  const base = 'https://mbale-innovators-hub-backend-1.onrender.com/api';
  // Login admin
  const loginRes = await fetch(base + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@mbalehub.com', password: 'Admin@12345' })
  });
  const loginText = await loginRes.text();
  let loginJson;
  try { loginJson = JSON.parse(loginText); } catch { console.log('Login response:', loginText); return; }

  const token = loginJson.token;
  console.log('Admin token:', token);

  // Call stats (admin-only)
  const stats = await postJson(base + '/projects/stats', null, token);
  console.log('\n/projects/stats =>', JSON.stringify(stats, null, 2));

  // Call pending projects (supervisor/admin)
  const pending = await postJson(base + '/projects/pending', null, token);
  console.log('\n/projects/pending =>', JSON.stringify(pending, null, 2));

  // Call public projects listing
  const projects = await postJson(base + '/projects?limit=5', null, null);
  console.log('\n/api/projects?limit=5 =>', JSON.stringify(projects, null, 2));
})();
