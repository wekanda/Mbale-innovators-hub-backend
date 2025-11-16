// scripts/seed_with_student.js
// Registers a student on the deployed backend and uses that token to create sample projects

async function apiRequest(method, url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

(async () => {
  const base = 'https://mbale-innovators-hub-backend-1.onrender.com/api';

  // Register student
  const student = { name: 'Seed Student', email: 'seedstudent@mbalehub.com', password: 'Student@12345', role: 'student' };
  const reg = await apiRequest('POST', base + '/auth/register', student, null);
  if (!reg || !reg.token) {
    console.error('Student registration failed:', reg);
    // If the account exists, try to login
    const login = await apiRequest('POST', base + '/auth/login', { email: student.email, password: student.password });
    if (!login || !login.token) { console.error('Student login failed too:', login); return; }
    token = login.token;
  } else {
    token = reg.token;
  }

  console.log('Student token obtained, creating projects...');

  const samples = [
    {
      title: 'Community Solar Charger',
      description: 'Portable solar charging station for remote villages.',
      category: 'Technology',
      technologies: ['Solar', 'Raspberry Pi']
    },
    {
      title: 'Market Price Prediction',
      description: 'ML model to predict market prices for local crops.',
      category: 'Business',
      technologies: ['Python', 'scikit-learn']
    }
  ];

  for (const s of samples) {
    const res = await apiRequest('POST', base + '/projects', s, token);
    console.log('Create project result:', res);
  }

  const list = await apiRequest('GET', base + '/projects?limit=10', null, null);
  console.log('\nProjects listing after seeding:', JSON.stringify(list, null, 2));
})();
